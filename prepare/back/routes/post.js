const express = require('express')
const { Post, Image, Comment, User } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middleware')

const router = express.Router();
router.post('/', isLoggedIn, async (req, res, next) => { // POST /post
    try {
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User, // 댓글 작성자
                    attributes: ['id', 'nickname']
                }]
            }, {
                model: User, // 게시글 작성자
                attributes: ['id', 'nickname']
            }, {
                model: User, // 좋아요 누른사람
                as: 'Likers',
                attributes: ['id'],
            }]
        })
        console.log(fullPost)
        // 성공 후 프론트로 돌려줄때 json(data...)
        res.status(201).json(fullPost)
    } catch (error) {
        console.error(error)
        next(error)
    }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { // POST /post/1/comment
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        })
        if (!post) {
            return res.status(403).send("존재하지 않는 게시글 입니다.");
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id,
        })
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname']
            }]
        })
        res.status(201).json(fullComment)
    } catch (error) {
        console.error(error)
        next(error)
    }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { // PATCH /post/1/like
    try {
        const post = await Post.findOne({ where: { id: req.params.postId } });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.addLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => { // DELETE /post/1/like
    try {
        const post = await Post.findOne({ where: { id: req.params.postId } });
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.removeLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
//npm i sequelize sequelize-cli mysql2
//npx sequelize init