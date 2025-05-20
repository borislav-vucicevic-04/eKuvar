import jwt from 'jsonwebtoken';
import config from '../config/config';

const generateToken = (userID: string) => {
  const secret = config.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET nije definisan u .env fajlu");
  }
  if(!config.JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN nije definisan u .env fajlu");
  }

  const token = jwt.sign(
    { id: userID },
    secret,
    {
      expiresIn: '7d'
    }
  );

  return token;
}

export default generateToken;