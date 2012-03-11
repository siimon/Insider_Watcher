// http://insynsok.fi.se/StartPage.aspx?searchtype=3&publdate=2012-02-27&format=zip&culture=sv-SE
var get_insiders = function()
{
    this.http = require('http-get');
    this.zipfile = require('zipfile');
    this.fs = require('fs');

    this.url_part1 ='http://insynsok.fi.se/StartPage.aspx?searchtype=3&publdate=';
    this.yesterday = new Date() ;
    this.yesterday.setDate(this.yesterday.getDate() - 1 );
    console.log(this.yesterday);
    this.url_part2 = this.yesterday.getFullYear() + '-' + this.getDateWithZero(this.yesterday.getMonth()+1) + '-' + this.getDateWithZero(this.yesterday.getDate());
    this.url_part3 ='&format=zip&culture=sv-SE';

    this.url = { url : this.url_part1 + this.url_part2 + this.url_part3 };
    console.log(this.url);
}

get_insiders.prototype.getDateWithZero = function (str){
      return ('0'+str).slice(-2);
}

get_insiders.prototype.run = function(fn){
  var that = this;
  this.http.get(this.url,'fetched_files/'+this.url_part2+'.zip',function(error, result){
       if(error){
        console.log(error);
       }else{
        that.unzip(result.file,function(result){
          if(result){
            fn(true,'fetched_files/Transaktioner.xml');
          }
        });
       }
      });
}

get_insiders.prototype.unzip = function(fileName,callback){
       file = new this.zipfile.ZipFile(fileName);
       console.log(file.names);
       for(fNameKey in file.names){
        var fName = file.names[fNameKey];
        var regex = new RegExp('^.*\.xml$');
        if(regex.test(fName))
        {
          var buff = file.readFileSync(fName);
          this.fs.writeFile('fetched_files/'+fName,buff.toString(),function(err){
            if(err){
              console.log(err);
            }
          });
       }
       }
      callback(true);

}

o = new get_insiders();
exports.fetcher = o;
