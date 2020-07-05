import { createTransport } from 'nodemailer';
import { emailCredentials } from '../config/load-parameters';

const transporter = createTransport({
  host: emailCredentials.host,
  port: emailCredentials.port,
  auth: {
    user: emailCredentials.email,
    pass: emailCredentials.password,
  },
});

async function sendMail(email, data) {
  const mailOptions = {
    from: 'test@test.com',
    to: email,
    subject: 'Dail Employess report',
    text: 'That was easy!',
    html: `Workers report <br><br>
        ${JSON.stringify(data)}
        `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // console.log('errr')
      return error;
    }
    // console.log('true');
    return true;
  });
}

export {
  sendMail,
};
