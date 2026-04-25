import * as userService from '../services/userService.js';

export const create = async (req, res) => {
  try {
    const data = await userService.create(req.body);

    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const list = async (req, res) => {
  try {
    const data = await userService.list();

    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await userService.findById(req.params.id);

    res.json(data);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await userService.update(req.params.id, req.body);

    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const data = await userService.updateStatus(req.params.id, req.body);

    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const data = await userService.updateEmail(req.user.id, req.body);

    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const data = await userService.updatePassword(req.user.id, req.body);

    res.json(data);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
