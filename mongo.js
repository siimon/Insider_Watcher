var databaseUrl = "localhost";
var collections = ['insiderTransactions'];
var db = require('mongojs').connect(databaseUrl,collections);

function insert(item){
  db.insiderTransactions.save(item, function (err, saved){
    if( err || !saved ){
      console.log('Error saving item');
      console.log(item);
    }
  });

}

function find(query){
  db.insiderTransactions.find(query, function (err, data){
    if( err || !data ){
      console.log('error finding query ');
      console.log(query);
    } else {
      return data;
    }
  });
}
