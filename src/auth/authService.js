import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_EXPIRES,
  REFRESH_EXPIRES,
} from '../config/jwt.js';

// 🔐 LOGIN
export const login = async ({ email, password }) => {
  const [users] = await pool.query(
    'SELECT * FROM users WHERE email = ? AND is_active = 1',
    [email]
  );

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = users[0];

  // 🔒 bcrypt compare
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha inválida');
  }

  // 🧹 remove tokens antigos (boa prática)
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = ?', [user.id]);

  // 🔑 ACCESS TOKEN
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      store_id: user.store_id,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );

  // 🔁 REFRESH TOKEN
  const refreshToken = jwt.sign(
    {
      id: user.id,
      tokenId: uuidv4(),
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );

  // salva no banco
  await pool.query(
    `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
  `,
    [user.id, refreshToken]
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      store_id: user.store_id,
    },
  };
};

//////////////////////////////////////////////////////////

// 🔁 REFRESH TOKEN
export const refresh = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const [rows] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [refreshToken]
    );

    if (rows.length === 0) {
      throw new Error('Refresh token expirado ou inválido');
    }

    // busca usuário atualizado
    const [users] = await pool.query(
      'SELECT id, role, store_id FROM users WHERE id = ? AND is_active = 1',
      [decoded.id]
    );

    if (users.length === 0) {
      throw new Error('Usuário inválido');
    }

    const user = users[0];

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        store_id: user.store_id,
      },
      JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES }
    );

    return { accessToken: newAccessToken };
  } catch (err) {
    throw new Error('Refresh inválido', { cause: err });
  }
};

//////////////////////////////////////////////////////////

// 🚪 LOGOUT
export const logout = async (refreshToken) => {
  await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [
    refreshToken,
  ]);

  return { message: 'Logout realizado com sucesso' };
};

//////////////////////////////////////////////////////////

// 👤 REGISTER (admin cria)
export const register = async ({
  name,
  email,
  password,
  role = 'employee',
  store_id = null,
}) => {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [
    email,
  ]);

  if (existing.length > 0) {
    throw new Error('E-mail já cadastrado');
  }

  // 🔒 hash da senha
  const password_hash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `
    INSERT INTO users (name, email, password_hash, role, store_id, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `,
    [name, email, password_hash, role, store_id]
  );

  return {
    id: result.insertId,
    name,
    email,
    role,
    store_id,
  };
};

// pegar dados user
export const me = async (userId) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, store_id 
     FROM users 
     WHERE id = ? AND is_active = 1`,
    [userId]
  );

  if (rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  return rows[0];
};

export const updateEmail = async (userId, { new_email, password }) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [
    userId,
  ]);

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha inválida');
  }

  await pool.query('UPDATE users SET email = ? WHERE id = ?', [
    new_email,
    userId,
  ]);

  return { email: new_email };
};

export const updatePassword = async (
  userId,
  { current_password, new_password }
) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [
    userId,
  ]);

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(current_password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha atual inválida');
  }

  const newHash = await bcrypt.hash(new_password, 10);

  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [
    newHash,
    userId,
  ]);

  return { message: 'Senha atualizada com sucesso' };
};
