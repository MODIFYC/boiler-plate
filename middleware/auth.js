const {User} = require('../models/User');

//인증처리
let auth = (req, res, next) => {
    //클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후 유저 찾음
    User.findByToken(token, (err, user) =>{
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, err:true })

        req.token = token;
        req.user = user;
        next();
    })

    //유저 있으면 인증

    //유저 없으면 인증 안 함



}

module.exports = {auth};