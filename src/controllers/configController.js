import * as configService from '../services/configService.js';

export const get = async (req, res) => {
  try {
    const data = await configService.getConfig();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await configService.updateConfig(req.body, req.file);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConfig = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM app_config LIMIT 1');
    return res.json(rows[0] || {});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar configurações' });
  }
};
