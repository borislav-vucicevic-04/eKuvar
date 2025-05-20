export default interface IKomentar {
  id: number,
  autor: string,
  id_recept: number,
  odgovor_na: number | null,
  datum_objave: string,
  sadrzaj: string,
  mojKomentar: boolean
}