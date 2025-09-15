const jwt = require('jsonwebtoken');
const { authService } = require('../services'); 
const jwtSecret = 'jihwanproject';


const signUp = async (req, res) => {
  try {
    const newUser = await authService.signUp(req.body);
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ errorMsg: '서버 오류' });
  }
};

const signIn = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ errorMsg: '인증 실패' });
    }
    
    if (req.originalUrl.includes('/jwt')) {
      const token = jwt.sign({ userId: req.user.userId }, jwtSecret, { expiresIn: '1m' } );
      return res.status(200).json({
        token: token,
        user: {
            userId: req.user.userId,
            nickname: req.user.nickname,
            email: req.user.contactEmail
        }
      });
    }
    return res.status(200).json({
      message: '로그인 성공',
      user: {
        userId: req.user.userId,
        nickname: req.user.nickname,
        email: req.user.contactEmail
      }
    });

  } catch(error){
    res.status(500).json({ errorMsg: '서버 오류' });
  }

};
const signOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  
    res.clearCookie('sssssssssid');
    console.log(req.session)

    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      console.log(req.session)
      res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    });
  });
};

module.exports = {
  signUp,
  signIn,
  signOut,
};