const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');

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
    },

    // 파일 종류를 필터링 하는 부분이다.
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        // 확장자가 동영상이 아니라면
        if(ext !== '.mp4' && ext !== '.avi') {
            return cb(res.status(400).end('only mp4, avi is allowed !!'), false);
        }

        cb(null, true);
    }
});

// 파일 저장 방식에 대해 설정한 정보를 upload란 변수에 담는다.
const upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    // 클라이언트에서 받은 비디오 파일을 노드 서버에 저장한다.
    // 이를 위해 multer라는 dependency를 다운받는다.
    upload(req, res, (err) => {
        if(err) {
            return res.json({success: false, err});
        } 

        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.fileName});
    })
})

module.exports = router;