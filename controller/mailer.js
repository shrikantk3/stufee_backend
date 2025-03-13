const mailer = require('nodemailer');





// async..await is not allowed in global scope, must use a wrapper
async function main(from, to, subject, text, html) {
    if(to){
        // send mail with defined transport object
    const info = await transports.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
    }
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);

  module.exports = main;