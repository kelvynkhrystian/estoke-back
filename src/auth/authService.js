import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

import { User, RefreshToken } from '../models/index.js';
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_EXPIRES,
  REFRESH_EXPIRES,
} from '../config/jwt.js';

// 🔐 LOGIN
export const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: {
      email,
      is_active: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha inválida');
  }

  await RefreshToken.destroy({
    where: {
      user_id: user.id,
    },
  });

  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      store_id: user.store_id,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      tokenId: uuidv4(),
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    user_id: user.id,
    token: refreshToken,
    expires_at: expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      store_id: user.store_id,
    },
  };
};

// 🔁 REFRESH TOKEN
export const refresh = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const savedToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!savedToken) {
      throw new Error('Refresh token expirado ou inválido');
    }

    const user = await User.findOne({
      where: {
        id: decoded.id,
        is_active: true,
      },
      attributes: ['id', 'role', 'store_id'],
    });

    if (!user) {
      throw new Error('Usuário inválido');
    }

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

// 🚪 LOGOUT
export const logout = async (refreshToken) => {
  await RefreshToken.destroy({
    where: {
      token: refreshToken,
    },
  });

  return { message: 'Logout realizado com sucesso' };
};

// 👤 ME
export const me = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId,
      is_active: true,
    },
    attributes: ['id', 'name', 'email', 'role', 'store_id'],
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
};
