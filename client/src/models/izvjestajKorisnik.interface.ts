export default interface IIzvjestajKorisnik {
  broj_recepta: number,
  broj_ocjena: number,
  broj_omiljenih: number,
  broj_komentara: number,
  najbolji_recept: string,
  najomiljeniji_recept: string,
  moje_ocjene: {
    id: number,
    naslov: string,
    autor: string,
    vrijednost: number
  }[],
  moji_omiljeni: {
    id: number
    naslov: string,
    autor: string,
  }[],
  moji_recepti: {
    id: number,
    naslov: string,
    prosjecna_ocjena: number,
    broj_ocjena: number,
    broj_omiljenih: number,
    broj_komentara: number
  }[]
}