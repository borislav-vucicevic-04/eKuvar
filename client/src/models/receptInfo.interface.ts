import IKomentar from "./komentar.interface";
import IRecept from "./recept.interface";
import IReceptSastojak from "./receptSastojak.interface";

export default interface IReceptInfo {
  recept: IRecept,
  sastojci: IReceptSastojak[],
  ocjena: number | null,
  omiljen: boolean,
  komentari: IKomentar[]
}