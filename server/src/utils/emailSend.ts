import config from "../config/config";
import nodemailer from 'nodemailer'

const emailSend = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: config.GMAIL_HOST ,
    port: 587,
    secure: false,
    auth: {
      user: config.GMAIL_USER,
      pass: config.GMAIL_PASS
    }
  })

  const info = await transporter.sendMail({
    from: `eKuvar <${config.GMAIL_USER}>`,
    to,
    subject,
    text,
    html: text,
    priority: 'high'
  });
  return info
}
export default emailSend