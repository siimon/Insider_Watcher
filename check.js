var fs = require('fs');
var parser = require('libxml-to-js');
var stocks = ['AUTOLIV'];

fs.readFile('Transaktioner.xml','utf-8',function(err,data){
  parser(data,function(error,result){
    for(node in result.Table){
      var nodeItem = result.Table[node];
      for(stock in stocks){
        var pattern = new RegExp('^.*'+ stocks[stock]+ '.*$','i');
        if(pattern.test(nodeItem['Bolag'])){
          handleInsiderTrans(node);
        }
      }
    }
  });
});

function handleInsiderTrans(node){
}


