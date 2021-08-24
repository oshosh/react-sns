const express = require('express');
const router = express.Router();

const { Post, Image, User, Comment } = require('../models');

router.get('/', async (req, res, next) => { // GET /posts
    try {

        // 게시물 가져오기
        const posts = await Post.findAll({
            limit: 10, // 몇개씩 가져올건지..
            order: [ // 정렬
                ['createdAt', 'DESC'],// 최신순부터 정렬해서 
                [Comment, 'createdAt', 'DESC']
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment, // 코멘트
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User, // 좋아요 누른사람
                as: 'Likers',
                attributes: ['id']
            }],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;