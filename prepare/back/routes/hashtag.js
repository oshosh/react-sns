const express = require('express');
const { Op } = require('sequelize');

const { User, Hashtag, Image, Post, Comment } = require('../models');

const router = express.Router();

router.get('/:hashtag', async (req, res, next) => {
    try {
        const where = {};
        if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
        } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
        console.log('/:hashtag')
        console.log(decodeURIComponent(req.params.hashtag))
        console.log(req.query.lastId)

        const posts = await Post.findAll({
            where,
            limit: 10,
            include: [{
                model: Hashtag,
                where: { name: decodeURIComponent(req.params.hashtag) },
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }],
            }],
        });

        console.log('LOAD_HASHTAG_POSTS_SUCCESS')
        console.log(posts)
        res.json(posts);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;