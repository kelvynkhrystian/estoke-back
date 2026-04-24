import pool from '../config/database.js'
import fs from "fs";
import path from "path";

// 🔹 GET CONFIG
export const getConfig = async () => {
  const [rows] = await pool.query("SELECT * FROM app_config LIMIT 1")
  return rows[0] || {}
}

// 🔹 UPDATE CONFIG
export const updateConfig = async (data, file) => {
  // pega config atual
  const [rows] = await pool.query("SELECT * FROM app_config LIMIT 1");
  const current = rows[0];

  let logoUrl = current.logo_url;

  // se veio nova imagem
  if (file) {
    // 🔥 APAGA A ANTIGA
    if (current.logo_url) {
      const oldPath = path.join(process.cwd(), current.logo_url);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // nova logo
    logoUrl = `/uploads/logos/${file.filename}`;
  }

  // atualiza banco
  await pool.query(
    `UPDATE app_config 
     SET app_name = ?, slogan = ?, theme = ?, logo_url = ?
     WHERE id = 1`,
    [
      data.app_name,
      data.slogan,
      data.theme || "dark",
      logoUrl,
    ]
  );

  return {
    ...data,
    logo_url: logoUrl,
  };
};