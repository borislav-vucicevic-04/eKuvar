interface OsnovniPodaci {
  id: number,
  autor: string,
  datum_kreiranja: string,
  naslov: string,
  porcija: number,
  posno: boolean,
  vegansko: boolean,
  slatko: boolean,
  prosjecna_ocjena: number,
  broj_ocjena: number,
  broj_omiljenih: number,
  broj_komentara: number,
}

interface Ocjene {
  korisnik: string,
  vrijednost: string
}

interface Omiljeno {
  korisnik: string,
}

export default interface IIzvjestajRecept {
  osnovni_podaci: OsnovniPodaci,
  ocjene: Ocjene[],
  omiljeni: Omiljeno[]
}