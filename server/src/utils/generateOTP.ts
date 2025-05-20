const generateOTP = () => {
  const OTP_LENGTH = 16;
  return Math.floor(Math.random() * (10 ** OTP_LENGTH)).toString().padStart(OTP_LENGTH, '0')
}

export default generateOTP