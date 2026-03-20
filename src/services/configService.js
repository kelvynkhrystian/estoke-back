import pool from '../config/database.js'

// GET CONFIG
export const getConfig = async () => {
  const [rows] = await pool.query('SELECT * FROM app_config LIMIT 1')
  return rows[0] || null
}

// UPDATE CONFIG
export const updateConfig = async (data) => {
  const {
    app_name,
    slogan,
    theme,
    logo_url,
    primary_color,
    secondary_color
  } = data

  // verifica se já existe
  const [rows] = await pool.query('SELECT id FROM app_config LIMIT 1')

  if (rows.length === 0) {
    await pool.query(`
      INSERT INTO app_config 
      (app_name, slogan, theme, logo_url, primary_color, secondary_color)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [app_name, slogan, theme, logo_url, primary_color, secondary_color])
  } else {
    await pool.query(`
      UPDATE app_config SET
        app_name = ?,
        slogan = ?,
        theme = ?,
        logo_url = ?,
        primary_color = ?,
        secondary_color = ?
      WHERE id = ?
    `, [
      app_name,
      slogan,
      theme,
      logo_url,
      primary_color,
      secondary_color,
      rows[0].id
    ])
  }

  return { message: 'Config atualizada' }
}