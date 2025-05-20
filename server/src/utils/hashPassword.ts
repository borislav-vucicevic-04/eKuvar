import config from "../config/config";
import bcrypt from 'bcrypt'

const hashPassword = async (data:string) => {
  try {
      // Hashira lozinku koristeći asinhronu funkciju bcrypt.hash
      const hashedPassword = await bcrypt.hash(data, config.BCRYPT_SALT);
      return hashedPassword;
  } catch (error) {
      console.error('Greška pri hashiranju lozinke:', error);
      throw error; // Bacanje greške ako nešto pođe po zlu
  }
}

export default hashPassword