const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs');

const { Post, Image, Comment, User } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middleware')

const router = express.Router();

try {
    fs.accessSync('uploads')
} catch (error) {
    console.log('uploads 폴더가 없으므로 생성')
    fs.mkdirSync('uploads')
}


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

// https://github.com/expressjs/multer
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) { // osh.png
            const ext = path.extname(file.originalname); // 확장자 추출 (png)
            const baseName = path.basename(file.originalname, ext) // osh 추출

            done(null, baseName + new Date().getTime() + ext) // osh15451231.png
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10mb
})
// upload.array('image') 여러장 , upload.single('image') 한장, upload.none() // 텍스트
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
    console.log(req.files);//이미지 정보
    res.json(req.files.map((v) => v.filename));
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

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
    try {
        await Post.destroy({
            where: { id: req.params.postId },
            UserId: req.user.id,
        });
        res.status(200).json({ PostId: parseInt(req.params.postId, 10) })
    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = router;
//npm i sequelize sequelize-cli mysql2
//npx sequelize init