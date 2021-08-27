const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs');

const { Post, Image, Comment, User, Hashtag } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middleware')

const router = express.Router();

try {
    fs.accessSync('uploads')
} catch (error) {
    console.log('uploads 폴더가 없으므로 생성')
    fs.mkdirSync('uploads')
}

// https://github.com/expressjs/multer
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) { // osh.png
            const ext = path.extname(file.originalname); // 확장자 추출 (png)
            const baseName = path.basename(file.originalname, ext) // osh 추출

            done(null, baseName + '_' + new Date().getTime() + ext) // osh15451231.png
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10mb
})

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /post
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);

        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() },
            }))) // [[노드, true], [리액트, true]]
            await post.addHashtags(result.map((v) => v[0]))
        }

        if (req.body.image) {
            if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [osh.png, oooo.png]
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
                await post.addImages(images);
            } else { // 이미지를 하나만 올리면 image: osh.png
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }

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
        // 성공 후 프론트로 돌려줄때 json(data...)
        res.status(201).json(fullPost)
    } catch (error) {
        console.error(error)
        next(error)
    }
});


// upload.array('image') 여러장 , upload.single('image') 한장, upload.none() // 텍스트
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => { // POST /post/1/retweet
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: Post,
                as: 'Retweet', //post.Retweet
            }],
        });
        if (!post) {
            return res.status(403).send("존재하지 않는 게시글 입니다.");
        }
        // 지금 검사하는 아이디가 내 아이디일 경우(자기 게시물 리트윗) || 어떤 게시글을 리트윗한것을 자기가 리트윗하는 경우
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 글을 리트윗 할 수 없습니다.');
        }
        // 남의 게시물을 다른사람이 리트윗 한것을 자기가 리트윗 할떄
        const retweetTargetId = post.RetweetId || post.id; // 리트윗 된 아이디가 없다면 post의 기본 id 값 사용
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        console.log('expost 통과')
        if (exPost) {
            // 리트윗된 post를 다시 리트윗하는 경우..
            return res.status(403).send('이미 리트윗했습니다.');
        }

        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        });
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: Post,//어떤 게시글을 리트윗한건지..
                as: 'Retweet',
                include: [{
                    model: User, // 리트윗 당한 작성자
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image, // 리트윗 당한 작성자 이미지
                }]
            }, {
                model: User,   // 내 정보들......
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }],
        })
        res.status(201).json(retweetWithPrevPost)
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