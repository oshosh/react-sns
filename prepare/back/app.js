//import
const express = require('express');
const cors = require('cors');
const session = require('express-session') // npm i express-session (login 전략시..)
const cookieParser = require('cookie-parser') // >npm i cookie-parser
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

// 라우터
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');

// db models
const db = require('./models')

// passport 정보 serializeUser, deserializeUser
const passportConfig = require('./passport');

// 기타 설정
dotenv.config()

// express 설정
const app = express();

// 실행
db.sequelize.sync().then(() => {
    console.log('db 연결 성공')
}).catch(console.error)

app.use(express.json()) // json 형식으로..
app.use(express.urlencoded({ extended: true })) // form 형식..

app.use(morgan('dev'))
app.use(cors({
    origin: 'http://localhost:3060',
    credentials: true, // access-control-allow-credentials
}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET
}));
app.use(passport.initialize())
app.use(passport.session());

passportConfig();


app.get('/', (req, res) => {
    res.send('hello express')
});

// 라우터 모듈화
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);

// custom 에러
app.use((err, req, res, next) => {

})

app.listen(3065, () => {
    console.log('서버 실행 중 !')
});