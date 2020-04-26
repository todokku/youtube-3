const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const Schema = mongoose.Schema;

// 스키마 정의(테이블 어트리뷰트 정의)
const imageCommentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    imageId: {      // 현재 댓글을 다는 비디오의 아이디
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }
}, { timestamps: true });   // 타임 스탬프로 인해 만든 날짜와 수정 날짜 DB에 자동 저장된다.


const ImageComment = mongoose.model('ImageComment', imageCommentSchema);

module.exports = { ImageComment }