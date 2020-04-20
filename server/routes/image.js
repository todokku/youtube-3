const express = require('express');
const router = express.Router();
const { Image } = require("../models/Image");

const { auth } = require("../middleware/auth");
const multer = require('multer');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    // 클라이언트로 전달 받은 파일을 서버의 어느 곳에 저장할지 설정하는 부분이다.
    // node server 폴더 구조에 맞춰서 uploads라는 폴더를 생성해 주자!
    destination: (req, file, cb) => {
        cb(null, "uploads/images");
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

    // 확장자가 이미지라면
    if(fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'gif') {
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
//             Image
//=================================

/* 클라이언트에서 받은 이미지 파일을 노드 서버 storage에 저장한다. */
router.post('/uploadfiles', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/image/uploadfiles로 요청한 클라이언트 : ", clientIp);

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


/* MongoDB에 비디오 정보를 저장한다. */
router.post('/uploadImage', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/image/uploadImage로 요청한 클라이언트 : ", clientIp);

    // 클라이언트가 보낸 json 데이터에 맞춰 그 정보를 해당 컬럼에 저장한다.
    const image = new Image(req.body);

    image.save( (err, doc) => {
        if(err) return res.json({ success: false, err });

        console.log("image save success !!");
        res.status(200).json({ success: true });
    });
});


/* DB에 저장된 이미지들을 가져와서 클라이언트에 보낸다. */
router.get('/getImages', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/image/getImages로 요청한 클라이언트 : ", clientIp);

    // DB의 Video 테이블에서 찾는 쿼리이다.
    Image.find()
    .populate('writer') // writer의 ref인 User의 정보를 가져온다. populate을 해주지 않으면 id만 가져온다.
    .sort( {"createdAt": -1} )  // 날짜 순 내림차순 정렬 => 최신 올린 것이 먼저 올라온다.
    .exec((err, images) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }
        
        res.status(200).json({
            success: true,
            images
        });
    });
});


/* 사용자가 클릭한 특정 이미지 정보를 가져온다. */
router.post('/getImageDetail', (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] ||  req.connection.remoteAddress;
    console.log("/api/image/getImageDetail 요청한 클라이언트 : ", clientIp);

    // _id 애트리뷰트를 이용해서 찾겠다.
    Image.findOne({"_id" : req.body.imageId})
    .populate("writer")
    .exec((err, imageDetail) => {
        if(err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        res.status(200).json({
            success: true,
            imageDetail
        });
    });
});

module.exports = router;