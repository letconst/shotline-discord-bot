const SimpleNodeLogger = require('simple-node-logger');

const opts = {
    logDirectory: '/logs',
    fileNamePattern: '<DATE>.log',
    dateFormat: 'YYYY-MM-DD HH:mm:ss'
}

const logger = SimpleNodeLogger.createSimpleLogger(opts);

module.exports = logger;
