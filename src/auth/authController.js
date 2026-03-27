import * as authService from './authService.js'

export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body)
    res.json(data)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export const register = async (req, res) => {
  try {
    const data = await authService.register(req.body)
    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// REFRESH
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const data = await authService.refresh(refreshToken)
    res.json(data)
  } catch (e) {
    res.status(401).json({ error: e.message })
  }
}

// LOGOUT
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const data = await authService.logout(refreshToken)
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

// pegar dados user
export const me = async (req, res) => {
  try {
    const data = await authService.me(req.user.id)
    res.json(data)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}