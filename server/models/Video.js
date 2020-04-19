const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const Schema = mongoose.Schema;

// 스키마 정의(테이블 어트리뷰트 정의)
const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,    // 작성하는 User의 id를 넣는다. 
        ref: 'User'     // id만 넣으면 User 모델에 가서 모든 정보를 불러올 수 있다.
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true });   // 타임 스탬프로 인해 만든 날짜와 수정 날짜가 표시된다.


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }