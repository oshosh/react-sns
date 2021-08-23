//import
const express = require('express');
const cors = require('cors');
const session = require('express-session') // npm i express-session (login 전략시..)
const cookieParser = require('cookie-parser') // >npm i cookie-parser
const passport = require('passport');
const dotenv = require('dotenv')

// 라우터
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const db = require('./models')
const passportConfig = require('./passport');

dotenv.config()
const app = express();
db.sequelize.sync().then(() => {
    console.log('db 연결 성공')
}).catch(console.error)

// json 형식으로..
app.use(express.json())
// form 형식..
app.use(express.urlencoded({ extended: true }))
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

app.get('/api/posts', (req, res) => {
    res.json([
        {
            id: 1,
            content: 'hello1'
        },
        {
            id: 2,
            content: 'hello2'
        },
        {
            id: 3,
            content: 'hello3'
        },
    ])
});

app.use('/user', userRouter);
app.use('/post', postRouter);

app.use((err, req, res, next) => {

})

app.listen(3065, () => {
    console.log('서버 실행 중 !')
});