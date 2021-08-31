const express = require('express');
const bcrypt = require('bcrypt') // npm i bcrypt
const passport = require('passport');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middleware')
const router = express.Router();


router.get('/', async (req, res, next) => { // GET /user
    console.log(req.headers);
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

router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/followers
    try {
        const user = await User.findOne({ where: { id: req.user.id } })
        if (!user) {
            res.status(403).send('없는 사람을 팔로우 할 수 없습니다.')
        }
        const followers = await user.getFollowers({
            attributes: {
                exclude: ['password']
            }
        })
        res.status(200).json(followers);

    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/followings
    try {
        const user = await User.findOne({ where: { id: req.user.id } })
        if (!user) {
            res.status(403).send('없는 사람을 팔로우 할 수 없습니다.')
        }
        const followings = await user.getFollowings({
            attributes: {
                exclude: ['password']
            }
        })
        res.status(200).json(followings);

    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.get('/:id', async (req, res, next) => { // GET /user/1
    console.log(' req.params.id : ' + req.params.id)

    try {
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.id },
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

        console.log('LOAD_MY_INFO_REQUEST')
        console.log('fullUserWithoutPassword')
        console.log(fullUserWithoutPassword)

        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length;
            data.Followings = data.Followings.length;
            data.Followers = data.Followers.length;

            res.status(200).json(data);
        } else {
            res.status(404).json('존재하지 않는 사용자입니다.12412')
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

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id },
        })
        res.status(200).json({ nickname: req.body.nickname });

    } catch (error) {
        console.error(error)
        next(error)
    }
})


router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // PATCH /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId } })
        if (!user) {
            res.status(403).send('없는 사람을 팔로우 할 수 없습니다.')
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });

    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { // delete /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId } })
        if (!user) {
            res.status(403).send('없는 사람을 언팔로우 할 수 없습니다.')
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });

    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // delete /user/follower/1
    try {
        const user = await User.findOne({ where: { id: req.params.userId } })
        if (!user) {
            res.status(403).send('없는 사람을 팔로우 해제를 할 수 없습니다.')
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });

    } catch (error) {
        console.error(error)
        next(error)
    }
})


module.exports = router;

// 200 - 성공
// 300 - 리다이렉트
// 400 - 클라이언트 에러
// 500 - 서버 에러