const express = require('express')
const { Post, Image, Comment, User } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middleware')

const router = express.Router();
router.post('/', isLoggedIn, async (req, res, next) => { // POST /post
    try {
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        })
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                module: Image,
            }, {
                module: Comment
            }, {
                module: User
            }]
        })
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
            PostId: req.params.postId,
            UserId: req.user.id,
        })

        res.status(201).json(comment)
    } catch (error) {
        console.error(error)
        next(error)
    }
});

router.delete('/', (req, res) => { // DELETE /post
    res.json(
        {
            id: 1,
        },
    )
});

module.exports = router;
//npm i sequelize sequelize-cli mysql2
//npx sequelize init