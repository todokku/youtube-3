if (process.env.NODE_ENV === 'production') {    // 배포 시에
    module.exports = require('./prod');
} else {    // 로컬에서 작업 시에
    module.exports = require('./dev');
}