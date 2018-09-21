const nodemailer = require('nodemailer');

function sendNewMail(user){
  console.log(user.dataValues.id);
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'deliveryservice985@gmail.com',
      pass: '19912018'
    }
  });

  let mailOptions = {
    from: 'deliveryservice985@gmail.com',
    to: user.dataValues.contacts,
    subject: 'Notification of successful delivery.',
    text: 'Your order has been successfully delivered. \nDate: '
      + user.dataValues.date_estimated + '. \nAddress: '
      + user.dataValues.address_to + '.'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = {
  sendNewMail
};
