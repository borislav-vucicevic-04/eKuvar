import Style from './Home.module.css'
import Preloader from "../../components/Preloader/Preloader"
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IRecept from '../../models/recept.interface';
import KarticaRecepta from '../../components/KarticaRecepta/KarticaRecepta';
import FilterForm from '../../components/FilterForm/FilterForm';

import FilterIcon from './../../assets/filter.svg'
import { useFilter } from '../../contexts/FilterContext';

const fetchRecepti = async ({ queryKey }: { queryKey: any }): Promise<any> => {
  const [_key, filter] = queryKey
  const response = await fetch('/api/recept/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(filter)
  });

  if(response.status === 401) throw new Error("Sesija je istekla");
  if(!response.ok) throw new Error("Interna greška na serveru");
  return response.json();
}

export default function Home() {
  const {filter, setFilter} = useFilter()
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false)
  const {data, isLoading, error} = useQuery<{recepti: IRecept[]}, Error>({
    queryKey: ['recept', filter],
    queryFn: fetchRecepti
  });

  useEffect(() => {
    if(error) {
      if (error?.message === 'Sesija je istekla') {
        navigate('/unauthorised', {replace: true})
        console.error(error)
      }
      else {
        alert('Interna greška na serveru, pogledaj konzolu')
      }
    }
  }, [error, navigate]);

  if(isLoading) {
    return <div className={Style.homeContainer}>
    <Preloader />
    </div>
  }
  
  return <div className={Style.homeContainer}>
    {visible ? <FilterForm currentFilter={filter} setVisible={setVisible} setFilter={setFilter} /> : <></>}
    <h1 className={Style.title}>Šta danas kuvamo?
      <button title='Filtriraj recepte' className={Style.filterButton} onClick={() => {setVisible(!visible)}}>
        <img src={FilterIcon} alt='filter icon' />
      </button>
    </h1>
    {data?.recepti.map((item, index) => <KarticaRecepta props={{...item}} key={item.id} delay={index * 250}/>)}
  </div>
}
