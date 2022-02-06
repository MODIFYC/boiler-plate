const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const {User} = require("./models/User");
const {auth} = require("./middleware/auth");
const config = require('./config/key');

//application/x-www-form-urlencoded 타입 가져옴
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

// mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI
).then(()=> console.log("MongoDB Connected ..."))
.catch(err => console.log(err))

app.post('/api/users/register', (req, res) => {
  //회원가입 정보 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.get('/', (req, res) => {
  res.send('Hello World~~!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/api/users/login', (req, res) => {
  // 1. 요청 이메일 DB에서 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 2. DB에 요청한 이메일이 있다면 비밀번호 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) =>{
      if(!isMatch)
      return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      // 3. 비밀번호까지 같으면 Token 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
          // token을 쿠키에 저장
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) =>{
  // 미들웨어를 통과해오면 Authentication은 true임
  res.status(200).json({
    _id: req.user.id,
    isAdmin: req.user.role === 0 ? false: true,
    isAuth: true,
    emial: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) =>{
  User.findOneAndUpdate({ _id: req.user._id}, 
    { token: ""},
    (err, user) => {
      if (err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})

