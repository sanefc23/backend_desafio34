const log4js = require('log4js');

log4js.configure({
    appenders: {
        all: {
            type: "file",
            filename: "logs.log",
        },
    },
    categories: {
        default: {
            appenders: ["all"],
            level: "all"
        }
    }
});

const logger = log4js.getLogger('file1');

module.exports = logger;