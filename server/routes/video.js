const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    // 클라이언트로 전달 받은 파일을 서버의 어느 곳에 저장할지 설정하는 부분이다.
    // node server 폴더 구조에 맞춰서 uploads라는 폴더를 생성해 주자!
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    // 저장되는 파일 이름을 지정하는 부분이다.
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// File Filter
let fileFilter = function(req, file, cb) {
    console.log("file : ", file);
    // 파일 필터링
    let typeArray = file.mimetype.split('/');
    let fileType = typeArray[1];

    console.log('fileType : ', fileType);

    // 확장자가 동영상이라면
    if(fileType == 'mp4') {
        cb(null, true);
    } else{
        cb(null, false);
    }
};

// 파일 저장 방식에 대해 설정한 정보를 upload란 변수에 담는다. 파일은 하나만 핸들링한다.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single("file");


//=================================
//             Video
//=================================

/* 클라이언트에서 받은 비디오 파일을 노드 서버 storage에 저장한다. */
router.post('/uploadfiles', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/video/uploadfiles로 요청한 클라이언트 : ", clientIp);

    upload(req, res, (err) => {
        // 필터링을 통과하면 req.file는 존재하며 통과하지 못하면 undefined이다.
        console.log('req.file : ', req.file);

        if(err) {
            return res.json({
                success: false, 
                err
            });
        } 

        if(req.file) {
            return res.json({
                success: true, 
                url: req.file.path, 
                fileName: req.file.filename
            });
        } else {
            return res.json({
                success: false
            });
        } 
    });
});


/* 썸네일 생성하고 비디오 러닝타임도 가져오기 */
router.post('/thumbnail', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/video/thumbnail로 요청한 클라이언트 : ", clientIp);

    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        fileDuration = metadata.format.duration;
    });

    // 썸네일 생성! on 함수를 통해 해당 객체에 이벤트를 연결한다.
    ffmpeg(req.body.url)    // 클라이언트로부터 온 비디오 저장 경로
    .on('filenames', function(filenames) {  // 비디오 썸네일 파일 이름 생성 이벤트
        filePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function() {     // 썸네일 생성 완료 시에 무엇을 할 것인지의 이벤트
        return res.json({
            success: true,
            url: filePath,
            fileDuration: fileDuration
        });
    })
    .on('error', function(err) {    // 에러 발생 시의 이벤트
        console.log(err);
        return res.json({
            success: false,
            err
        });
    })
    .screenshot({
        // 옵션을 줄 수 있다.
        count: 1,   // 1개의 썸네일을 찍을 수 있다.
        folder: 'uploads/thumbnails',   // 해당 폴더 안에 썸네일이 저장될 것이다.
        size: '320x240',
        filename: 'thumbnail-%b.png'    // %b : 확장자를 제거한 파일의 원래 이름
    });
});


/* MongoDB에 비디오 정보를 저장한다. */
router.post('/uploadVideo', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/video/uploadVideo로 요청한 클라이언트 : ", clientIp);

    // 클라이언트가 보낸 json 데이터에 맞춰 그 정보를 해당 컬럼에 저장한다.
    const video = new Video(req.body);

    video.save( (err, doc) => {
        if(err) return res.json({ success: false, err });

        console.log("video save success !!");
        res.status(200).json({ success: true });
    });
});


/* DB에 저장된 비디오들을 가져와서 클라이언트에 보낸다. */
router.get('/getVideos', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/video/getVideos로 요청한 클라이언트 : ", clientIp);

    // DB의 Video 테이블에서 찾는 쿼리이다.
    Video.find()
    .populate('writer') // writer의 ref인 User의 정보를 가져온다. populate을 해주지 않으면 id만 가져온다.
    .sort( {"createdAt": -1} )  // 날짜 순 내림차순 정렬 => 최신 올린 것이 먼저 올라온다.
    .exec((err, videos) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        res.status(200).json({
            success: true,
            videos
        });
    });
});


/* 사용자가 클릭한 특정 비디오 정보를 가져온다. */
router.post('/getVideoDetail', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/video/getVideoDetail로 요청한 클라이언트 : ", clientIp);

    // _id 애트리뷰트를 이용해서 찾겠다.
    Video.findOne({"_id" : req.body.videoId})
    .populate("writer")
    .exec((err, videoDetail) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        // 조회수 1만큼 증가
        videoDetail.views += 1;
        Video.update( {_id: req.body.videoId}, {$set: {views: videoDetail.views}} )    // 실제 DB에 반영
        .exec((err, video) => {
            if(err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }
        });

        res.status(200).json({
            success: true,
            videoDetail
        });
    });
});


/* 구독 중인 비디오 정보를 가져온다. */
router.post('/getSubscriptionVideos', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/video/getSubscriptionVideos로 요청한 클라이언트 : ", clientIp);

    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
    .exec((err, subscriberInfo) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        // 내가 구독하는 사람들의 id를 담을 것이다.
        let subscribedUser = [];

        subscriberInfo.map((subscriber, i) => {
            subscribedUser.push(subscriber.userTo);
        });

        // 찾은 사람들의 비디오를 가지고 온다.
        Video.find({ writer: { $in: subscribedUser } })      // 1개가 아닌, 여러 명의 아이디를 가지고서 찾아야 한다.
        .populate('writer')
        .exec((err, videos) => {
            if(err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            }

            res.status(200).json({
                success: true,
                videos
            });
        });
    });
});

module.exports = router;