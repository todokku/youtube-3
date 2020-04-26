const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");
const { ImageComment } = require('../models/ImageComment');


//=================================
//             Comment
//=================================


router.post('/saveVideoComment', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/comment/saveVideoComment 요청한 클라이언트 : ", clientIp);

    const comment = new Comment(req.body);

    comment.save((err, comment) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        // 저장 시에는 populate을 쓸 수 없으므로 저장 후에 대안으로 다음과 같이 코드를 짠다.
        Comment.find({'_id' : comment._id})
        .populate('writer')
        .exec((err, result) => {
            if(err) {
                return res.json({
                    success: false,
                    err
                });
            }

            return res.status(200).json({
                success: true,
                result
            });
        });
    });
});


router.post('/getVideoComments', (req, res) => {
    Comment.find({ 'postId' : req.body.videoId })
    .populate('writer')
    .exec((err, comments) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        return res.status(200).json({
            success: true,
            comments
        });
    });
});


router.post('/saveImageComment', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/comment/saveImageComment 요청한 클라이언트 : ", clientIp);

    const comment = new ImageComment(req.body);

    comment.save((err, comment) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        // 저장 시에는 populate을 쓸 수 없으므로 저장 후에 대안으로 다음과 같이 코드를 짠다.
        ImageComment.find({'_id' : comment._id})
        .populate('writer')
        .exec((err, result) => {
            if(err) {
                return res.json({
                    success: false,
                    err
                });
            }

            return res.status(200).json({
                success: true,
                result
            });
        });
    });
});


router.post('/getImageComments', (req, res) => {
    ImageComment.find({ 'imageId' : req.body.imageId })
    .populate('writer')
    .exec((err, comments) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        return res.status(200).json({
            success: true,
            comments
        });
    });
});

module.exports = router;