const { userService } = require('../services'); 

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ errorMsg: '서버 오류' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) return res.status(404).json({ errorMsg: '사용자를 찾을 수 없습니다.' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ errorMsg: '서버 오류' });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.userId, req.body);
    if (!updatedUser) return res.status(404).json({ errorMsg: '사용자를 찾을 수 없습니다.' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ errorMsg: '서버 오류' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const isDeleted = await userService.deleteUserById(req.params.userId);
    if (!isDeleted) return res.status(404).json({ errorMsg: '사용자를 찾을 수 없습니다.' });
    res.status(200).json({ message: '성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ errorMsg: '서버 오류' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};