var insider_watcher = (function(){
  var fs = require('fs');
  var config = require('./config.js');
  var parser = require('libxml-to-js');
  var logger = require('./logger.js').log;
  var configured_stocks = config.stocks;
  var fetcher = require('./get_insiders.js');
  var smtp = require('./mailer.js').mailer;

  var parse_file = function(filename,fn){
      logger.debug(filename);
      fs.readFile(filename,'utf-8',function(err,data){
        parser(data,function(error,result){
          var insider_trans = [];
          for(node in result.Table){
            var nodeItem = result.Table[node];
            for(stock in configured_stocks){
              var pattern = new RegExp('^('+ configured_stocks[stock] + ')','i');
              if(pattern.test(nodeItem['VP-namn'])){
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
        logger.error('Error sending mail');
      }else{
        logger.debug('Mail sent');
      }
      fn(error);
    });
  }
  return {
    run: function(){
        fetcher.fetcher.run(function(result,filename){
          if(result){
           parse_file(filename,function(error){
             logger.debug('Parse completed.');
             if(error){
               logger.error('Error occured: '+ error);
             }
             process.exit();
           });
          }else{
            logger.debug('Fetching insider transactions failed');
          }
      });
    }
  }
});

var watcher = new insider_watcher();
exports.watcher = watcher;
