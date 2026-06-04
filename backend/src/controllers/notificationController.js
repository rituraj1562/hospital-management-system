import { sendMail } from '../services/mailService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const sendNotification = asyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  await sendMail({
    to,
    subject,
    html: `<p>${message}</p>`
  });
  res.json({ success: true, message: 'Notification queued' });
});
