var insider_watcher = (function(){
  var fs = require('fs');
  var config = require('./config.js');
  var parser = require('libxml-to-js');
  var configured_stocks = config.stocks;
  var fetcher = require('./get_insiders.js');
  var smtp = require('./mailer.js').mailer;

  var parse_file = function(filename,fn){
      console.log(filename);
      fs.readFile(filename,'utf-8',function(err,data){
        parser(data,function(error,result){
          var insider_trans = [];
          for(node in result.Table){
            var nodeItem = result.Table[node];
            for(stock in configured_stocks){
              var pattern = new RegExp('^('+ configured_stocks[stock] + ')','i');
              if(pattern.test(nodeItem['Vardepapper'])){
                insider_trans.push(nodeItem);
              }
            }
          }
          if(insider_trans.length > 0){
            mailresult(insider_trans,function(error){
              fn(error);
            });
          }else{
            fn(null);
          }
        });
      });
    }

  var mailresult = function(transactions,fn){
    if(transactions.length <= 0){
      return;
    }

    var resultString = "";
    for(tranKey in transactions){
      var tran = transactions[tranKey];
      var tempString = tran['Bolag'] + " " + tran['Insynsperson'] + ", " + tran['Befattning'] + "\n";
      var vp = tran['Vardepapper'].replace(/\s/g,' ');

      tempString = tempString + tran['Transaktion'] + " " + vp  + " " + tran['Antal_x002F_belopp'] + "\n \n";
      resultString = resultString + tempString;
    }

    s = smtp.send(resultString,function(error){
      if(error){
        console.log('Error sending mail');
      }else{
        console.log('Mail sent');
      }
      fn(error);
    });
  }
  return {
    run: function(){
        fetcher.fetcher.run(function(result,filename){
          if(result){
           parse_file(filename,function(error){
             console.log('Parse completed.');
             if(error){
               console.log('Error occured: '+ error);
             }
             process.exit();
           });
          }else{
            console.log('Fetching insider transactions failed');
          }
      });
    }
  }
});

var watcher = new insider_watcher();
exports.watcher = watcher;
