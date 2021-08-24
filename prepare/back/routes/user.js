const express = require('express');
const bcrypt = require('bcrypt') // npm i bcrypt
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middleware')
const router = express.Router();

router.get('/', async (req, res, next) => { // GET /user
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.error(error)
        next(error)
    }

})

router.post('/login', isNotLoggedIn, (req, res, next) => {
    //local에서 만든 done이 넘어옴
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // 서버 에러
            console.error(err);
            return next(err);
        }
        if (info) {
            // 클라이언트 에러
            return res.status(401).send(info.reason);// 허가되지 않음
        }
        return req.login(user, async (loginErr) => { // passport 로그인
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            return res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next); // 미들웨어 확장
});

router.post('/logout', isLoggedIn, (req, res, next) => {
    console.log('logout 라우터')
    req.logout();
    req.session.destroy();
    res.send('ok');
})

router.post('/', async (req, res, next) => { // POST /user/
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });

        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 13)
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,

        })

        // npm i cors를 하거나 아래와 같은 코드 작성..
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060')

        res.status(201).send('ok');

    } catch (error) {
        console.error(error)
        next(error) // status 500
    }
});

module.exports = router;

// 200 - 성공
// 300 - 리다이렉트
// 400 - 클라이언트 에러
// 500 - 서버 에러