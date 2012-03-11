
var db_handler = {
  db : require('mongojs').connect('localhost',['stocks','insiderTransactions']),
  logger : require('./logger.js'),
  save : function(item) {
    this.db.insiderTransactions.save(item, function (err, saved){
      if( err || !saved ){
        logger.log.error('Error saving insider transaction');
        logger.log.error(item);
      }
    });
  }
  ,
  save_stock : function(stock){
    this.db.stocks.save(stock,function(err,saved){
      if(err || !saved){

      }
    });
  }
  ,
  find : function() {
    this.db.insiderTransactions.find(query, function (err, data){
      if( err || !data ){
        console.log('error finding query ');
        console.log(query);
      } else {
        return data;
      }
    });
  },

  find_all_stocks : function(fn){
    this.db.stocks.find(function(err,data){
      fn(data);
    });
  }
}

var obj = Object.create(db_handler);

exports.db = obj;
