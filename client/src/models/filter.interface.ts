export default interface IFilter {
  naslov?: string | null,
  korisnik?: string | null,
  datum_kreiranja_min?: string | null,
  datum_kreiranja_max?: string | null,
  porcija_min?: number | null,
  porcija_max?: number | null,
  prosjecna_ocjena_min?: number | null,
  prosjecna_ocjena_max?: number | null,
  posno?: string | null,
  slatko?: string | null,
  vegansko?: string | null,
  sortirajPo?: string | null,
  poredak?: string
}