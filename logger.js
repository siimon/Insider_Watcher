
function log(){
  this.log4js = require('log4js');
  this.log4js.addAppender(this.log4js.consoleAppender());
  this.logger = this.log4js.getLogger('logger');
}

log.prototype.warn = function(msg){
    console.warn(msg);
  }

log.prototype.debug = function(msg){
  this.logger.debug(msg);
}

log.prototype.error = function(msg){
  this.logger.error(msg);
}

var obj = new log();
exports.log = obj;


