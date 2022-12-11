const AWS = require('aws-sdk');
const SES = new AWS.SES();

const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS;
const TO_EMAIL_ADDRESS = process.env.TO_EMAIL_ADDRESS;

const sendMailToMe = async (data) => {
  const params = {
    Source: FROM_EMAIL_ADDRESS,
    ReplyToAddresses: ['testReply@email.com'],
    Destination: {
      ToAddresses: [TO_EMAIL_ADDRESS]
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Thank you for your message: ${data.message}\n\nName: ${data.name}\n\nEmail: ${data.email}\n\nI will reply you as soon as possible. \n -- Victor`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New Message from Customer'
      },
    },
  };
  console.log(params);

  const res = await SES.sendEmail(params).promise();
  console.log(JSON.stringify(res));
  return res;
}

exports.sendMail = async (event) => {
  console.log('Send email called');

  const dynamodb = event.Records[0].dynamodb;
  console.log(JSON.stringify(dynamodb));

  const formData = {
    name: dynamodb.NewImage.name.S,
    email: dynamodb.NewImage.email.S,
    message: dynamodb.NewImage.message.S
  }
  console.log(JSON.stringify(formData))

  const res = await sendMailToMe(formData);
  return res;
}