import Cookies from "js-cookie";
import { createContext, useContext, useState, ReactNode } from "react";
import IKorisnik from "../models/korisnik.interface";

type KorisnikContextType = {
  korisnik: IKorisnik,
  setKorisnik: (korisnik: IKorisnik) => void;
};

const KorisnikContext = createContext<KorisnikContextType | undefined>(undefined);

export const KorisnikProvider = ({ children }: { children: ReactNode }) => {
  const data = Cookies.get('korisnik');
  let initial: IKorisnik = {
    puno_ime: '',
    datum_registracije: '',
    poslednja_prijava: ''
  }

  if(data) {
    initial = JSON.parse(data) as IKorisnik
  }

  const [korisnik, setKorisnik] = useState<IKorisnik>(initial);
  return (<KorisnikContext.Provider value={{korisnik, setKorisnik}}>
    {children}
  </KorisnikContext.Provider>)
}

export const useKorisnik = () => {
  const context = useContext(KorisnikContext);
  if(!context) throw new Error("useKorisnik mora biti koristen unutart FilterProvidera");
  else return context
}