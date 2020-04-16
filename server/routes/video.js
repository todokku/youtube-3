const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

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

// 파일 저장 방식에 대해 설정한 정보를 upload란 변수에 담는다. 파일은 하나만 핸들링한다.
const upload = multer({
    storage: storage
}).single("file");


//=================================
//             Video
//=================================

/* 클라이언트에서 받은 비디오 파일을 노드 서버에 저장한다. */
router.post('/uploadfiles', (req, res) => {
    upload(req, res, (err) => {
        // 파일 필터링
        let typeArray = req.file.filename.split('.');
        let fileType = typeArray[1];

        // 확장자가 동영상이 아니라면
        if(fileType !== 'mp4' && fileType !== 'avi') {
            return res.json({
                success: false, 
                err
            });
        }

        if(err) {
            return res.json({
                success: false, 
                err
            });
        } 

        return res.json({
            success: true, 
            url: req.file.path, 
            fileName: req.file.filename
        });
    })
});


/* 썸네일 생성하고 비디오 러닝타임도 가져오기 */
router.post('/thumbnail', (req, res) => {
    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        fileDuration = metadata.format.duration;
    })

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
        count: 3,   // 3개의 썸네일을 찍을 수 있다.
        folder: 'uploads/thumbnails',   // 해당 폴더 안에 썸네일이 저장될 것이다.
        size: '320x240',
        filename: 'thumbnail-%b.png'    // %b : 확장자를 제거한 파일의 원래 이름
    });
});


/* MongoDB에 비디오 정보를 저장한다. */
router.post('/uploadVideo', (req, res) => {
    console.log('/uploadVideo');
    console.log('req.body : ', req.body);
    // 클라이언트가 보낸 json 데이터에 맞춰 그 정보를 해당 컬럼에 저장한다.
    const video = new Video(req.body);

    video.save( (err, doc) => {
        if(err) return res.json({ success: false, err });

        console.log("video save success !!");
        res.status(200).json({ success: true });
    });
});


module.exports = router;