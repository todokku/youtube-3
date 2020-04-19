const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const Schema = mongoose.Schema;

// 스키마 정의(테이블 어트리뷰트 정의)
const subscriberSchema = mongoose.Schema({
   userTo: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User'
   }
}, { timestamps: true });   // 타임 스탬프로 인해 만든 날짜와 수정 날짜가 표시된다.


const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }