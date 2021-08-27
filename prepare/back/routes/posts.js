const express = require('express');
const { Op } = require('sequelize')
const router = express.Router();

const { Post, Image, User, Comment } = require('../models');

router.get('/', async (req, res, next) => { // GET /posts
    try {
        const where = {}
        if (parseInt(req.query.lastId, 10)) { // 초기로딩이 아닐때
            //https://velog.io/@cadenzah/sequelize-document-2
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
        }
        // 게시물 가져오기
        const posts = await Post.findAll({
            where,
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
            }, {
                model: Post,//어떤 게시글을 리트윗한건지..
                as: 'Retweet',
                include: [{
                    model: User, // 리트윗 당한 작성자
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image, // 리트윗 당한 작성자 이미지
                }]
            }],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }

});

module.exports = router;