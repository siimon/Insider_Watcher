var fs = require('fs');
var parser = require('libxml-to-js');
var db = require('./mongo.js');
var stocks = ['AUTOLIV'];
var fetcher = require('./get_insiders.js');

fetcher.fetcher.run(function(result,filename){
  if(result){
   parse_file(filename);
  }else{
    console.log('Fetching insider transactions failed');
  }
});

function parse_file(filename){
  fs.readFile(filename,'utf-8',function(err,data){
    parser(data,function(error,result){
      for(node in result.Table){
        var nodeItem = result.Table[node];
        for(stock in stocks){
          var pattern = new RegExp('^.*'+ stocks[stock]+ '.*$','i');
          if(pattern.test(nodeItem['Bolag'])){
            handleInsiderTrans(nodeItem);
          }
        }
      }
    });
  });
}

function handleInsiderTrans(node){
  db.db.save(node);
}


