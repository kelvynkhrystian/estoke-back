import { AppConfig } from '../models/index.js';
import fs from 'fs';
import path from 'path';

// 🔹 GET CONFIG
export const getConfig = async () => {
  const config = await AppConfig.findOne();

  return config ? config.toJSON() : {};
};

// 🔹 UPDATE CONFIG
export const updateConfig = async (data, file) => {
  let config = await AppConfig.findOne();

  // se não existir ainda, cria
  if (!config) {
    config = await AppConfig.create({});
  }

  let logoUrl = config.logo_url;

  // se veio nova imagem
  if (file) {
    // 🔥 APAGA A ANTIGA
    if (config.logo_url) {
      const oldPath = path.join(process.cwd(), config.logo_url);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // nova logo
    logoUrl = `/uploads/logos/${file.filename}`;
  }

  // atualiza via Sequelize
  await config.update({
    app_name: data.app_name ?? config.app_name,
    slogan: data.slogan ?? config.slogan,
    theme: data.theme ?? config.theme ?? 'dark',
    logo_url: logoUrl,
  });

  return config.toJSON();
};
