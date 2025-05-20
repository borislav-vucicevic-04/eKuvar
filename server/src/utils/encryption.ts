import config from "../config/config";
import CryptoJS from "crypto-js";

const encryption = (data: string) => {
  const secret = CryptoJS.enc.Hex.parse(config.CRYPTOJS_SECRET);
  const iv = CryptoJS.enc.Hex.parse(config.CRYPTOJS_IV);
  const encrypted = CryptoJS.AES.encrypt(data, secret, { iv: iv });
  return encrypted.toString();
}

export default encryption