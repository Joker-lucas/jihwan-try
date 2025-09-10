const { authService } = require('../services'); 


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
    const {email, password } = req.body;
    const {user, token} = await authService.signIn(email, password);

    res.cookie('user-id', user.userId, {
        httponly: false,
        secure: false,
    });

    res.status(200).json({
        token: token,
        user: {
            userId: user.userId,
            nickname: user.nickname,
            email: user.contactEmail
        }
    });

  }
    catch(error){
        // if(error.message) 처리로 바꿔주기
        res.status(500).json({ errorMsg: '서버 오류' });
    }

};
const signOut = (req, res) => {
  try {
    res.clearCookie('auth-cookie');
    res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
  } catch (error) {
    res.status(500).json({ errorMsg: '서버 오류' });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
};