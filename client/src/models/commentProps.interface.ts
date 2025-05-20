import IKomentar from "./komentar.interface"
import IReceptInfo from "./receptInfo.interface"

export default interface ICommentProps {
  id: number,
  korisnik: string,
  datum_objave: string
  odgovorNa: number | null
  sadrzaj: string,
  mojKomentar: boolean
  sviKomentari: IKomentar[],
  detaljiRecepta: IReceptInfo,
  setDetaljiRecepta: (value: IReceptInfo) => void
}