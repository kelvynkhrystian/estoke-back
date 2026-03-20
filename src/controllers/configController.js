import * as configService from '../services/configService.js'

export const get = async (req, res) => {
  try {
    const data = await configService.getConfig()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const data = await configService.updateConfig(req.body)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}