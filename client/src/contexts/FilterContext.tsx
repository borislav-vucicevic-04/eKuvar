import { createContext, useContext, useState, ReactNode } from "react";
import IFilter from "../models/filter.interface";

type FilterContextType = {
  filter: IFilter,
  setFilter: (filter: IFilter) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<IFilter>({
    naslov: null,
    korisnik: null,
    datum_kreiranja_min: null,
    datum_kreiranja_max: null,
    porcija_min: null,
    porcija_max: null,
    prosjecna_ocjena_min: null,
    prosjecna_ocjena_max: null,
    posno: null,
    slatko: null,
    vegansko: null,
    sortirajPo: 'prosjecna_ocjena',
    poredak: 'desc'
  })

  return (
    <FilterContext.Provider value={{filter, setFilter}}>
      {children}
    </FilterContext.Provider>
  );
}
export const useFilter = () => {
  const context = useContext(FilterContext);
  if(!context) throw new Error("useFilter mora biti koristen unutart FilterProvidera");
  else return context
}