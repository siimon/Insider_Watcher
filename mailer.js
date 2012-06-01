
var mailer = (function(){
  var node_mailer = require('nodemailer');
  return {
    send : function(msg,fn){
            var options = {
              service: 'Gmail',
              host: 'smtp.gmail.com',
              port: 465,
              auth: {
                user: 'k.simon.eriksson@gmail.com',
                pass: '5olb8rmym0d53xjfgyq6prl8l8sn9v'
              }
           };
            var transport_msg =  {
              to: 'k.simon.eriksson@gmail.com',
              from: 'insiders@simoneriksson.org',
              subject: 'Insider transaction occured',
              text: msg

            };

            var transport = node_mailer.createTransport('SMTP', options);
            transport.sendMail(transport_msg,function(error,response){
              if(error){
                console.log('Error sending mail:' +error);
              }
              fn(error);
            });
  }
  }
});

var m = new mailer();
exports.mailer = m;
