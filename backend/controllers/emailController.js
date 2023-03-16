/** @format */

import expressAsyncHandler from 'express-async-handler';
import sgMail from '@sendgrid/mail';
import Filter from 'bad-words';
import Email from '../models/emailModel.js';

//-------------------------------------
// Send Email
//-------------------------------------
const sendEmail = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  // Get the message
  const emailMessage = subject + ' ' + message;
  // Prevent profanities or bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(emailMessage);
  if (isProfane) {
    throw new Error('Email sent failed because it contains profane words');
  }
  try {
    // Build up message
    const msg = {
      to,
      from: 'yujie.li1994@gmail.com',
      subject,
      text: message,
    };

    // Send email
    await sgMail.send(msg);

    // Save to database
    await Email.create({
      sentBy: req?.user?._id,
      from: req?.user?.email,
      to,
      subject,
      message,
    });
    res.json('Mail sent successfully');
  } catch (error) {
    res.json(error)
  }
});

export { sendEmail };
