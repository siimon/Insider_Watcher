// http://insynsok.fi.se/StartPage.aspx?searchtype=3&publdate=2012-02-27&format=zip&culture=sv-SE
var get_insiders = (function(){
    var http = require('http-get');
    var zipfile = require('zipfile');
    var fs = require('fs');
    var logger = require('./logger.js').log;

    var url_part1 ='http://insynsok.fi.se/StartPage.aspx?searchtype=3&publdate=';
    var yesterday = new Date() ;
    yesterday.setDate(yesterday.getDate() - 1 );
    logger.debug(yesterday);
    var getDateWithZero = function(str){
      return ('0'+str).slice(-2);
    }

    var unzip = function(fileName,callback){
       file = new zipfile.ZipFile(fileName);
       logger.debug(file.names);
       for(fNameKey in file.names){
          var fName = file.names[fNameKey];
          var regex = new RegExp('^.*\.xml$');
          if(regex.test(fName))
          {
            var buff = file.readFileSync(fName);
            fs.writeFile('fetched_files/'+fName,buff.toString(),function(err){
              if(err){
                logger.error(err);
              }
          });
         }
       }
      callback(true);
    }
    var url_part2 = yesterday.getFullYear() + '-' + getDateWithZero(yesterday.getMonth()+1) + '-' + getDateWithZero(yesterday.getDate());
    var url_part3 ='&format=zip&culture=sv-SE';

    var url = '';
    url = { url : url_part1 + url_part2 + url_part3 };
    logger.debug(url);


return {
  run: function(fn){
    http.get(url,'fetched_files/'+url_part2+'.zip',function(error,result){
       unzip(result.file,function(result){
          if(result){
            fn(true,'fetched_files/Transaktioner.xml');
          }
       });
    });
  }
}
});

o = new get_insiders();
exports.fetcher = o;
