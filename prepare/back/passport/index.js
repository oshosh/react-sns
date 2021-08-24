// npm i passport passport-local
const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
    // req.login 시
    passport.serializeUser((user, done) => { // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
        done(null, user.id); // session 정보에 모든 정보를 담기힘들어 id만 저장
    });

    passport.deserializeUser(async (id, done) => {
        try {
            // user id로 조회시 user 정보 session 복원
            const user = await User.findOne({ where: { id } });
            done(null, user); // req.user
        } catch (error) {
            console.error(error);
            done(error);
        }
    });

    local();
};

// 프론트에서 서버로는 cookie만 보냄(clhxy), 전체적인 로그인 관련 정보는 서버 세션이 들고 있으나 (radis로 관리하면 좋다) 정보가 커지면 id만 따로 관리를하여 db에서 다시 조회함
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 1 발견
// id: 1이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱