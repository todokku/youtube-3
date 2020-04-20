const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");


//=================================
//             Subscribe
//=================================

/* 해당 동영상을 게시한 사람의 구독자 수를 계산한다. */
router.post('/subscribeNumber', (req, res) => {
    // userTo 어트리뷰트에서 일치하는 값을 찾는다. 쿼리의 where절이라 생각!
    Subscriber.find({ 'userTo': req.body.userTo })
    .exec((err, subscribe) => {
        // subscribe에는 userTo를 구독하는 모든 도큐먼트가 들어 있다.
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        
        res.status(200).json({
            success: true,
            subscribeNumber: subscribe.length
        });
    });
});


/* 해당 동영상을 게시한 사람을 현재 내가 구독하고 있는지의 여부를 판단한다. */
router.post('/subscribed', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom })
    .exec((err, subscribe) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        
        res.status(200).json({
            success: true,
            subscribed: subscribe.length !== 0 ? true : false
        });
    });
});


/* 구독 취소 */
router.post('/unSubscribe', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/subscribe/subscribed로 요청한 클라이언트 : ", clientIp);

    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
    .exec((err, doc) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        
        res.status(200).json({
            success: true,
            doc
        });
    });
});


/* 구독 하기 */
router.post('/subscribe', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/subscribe/subscribe로 요청한 클라이언트 : ", clientIp);

    const subscribe = new Subscriber(req.body);

    subscribe.save((err, doc) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        
        res.status(200).json({
            success: true,
            doc
        });
    });
});

module.exports = router;