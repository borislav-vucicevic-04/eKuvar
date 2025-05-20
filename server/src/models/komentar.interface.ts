export default interface IKomentar {
  id: number,
  id_korisnik: number,
  puno_ime: string,
  id_recept: number,
  odgovor_na: number | null,
  datum_objave: string,
  sadrzaj: string
}