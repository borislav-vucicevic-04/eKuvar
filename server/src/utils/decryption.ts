import config from "../config/config";
import CryptoJS from "crypto-js";

const decryption = (encryptedData: string) => {
  const secret = CryptoJS.enc.Hex.parse(config.CRYPTOJS_SECRET);
  const iv = CryptoJS.enc.Hex.parse(config.CRYPTOJS_IV);
  const decrypted = CryptoJS.AES.decrypt(encryptedData, secret, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export default decryption;
