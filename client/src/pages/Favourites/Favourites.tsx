import Style from './Favourites.module.css'
import Preloader from '../../components/Preloader/Preloader';
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import IRecept from '../../models/recept.interface';
import KarticaRecepta from '../../components/KarticaRecepta/KarticaRecepta';


const fetchRecepti = async (): Promise<any> => {
  const response = await fetch('/api/recept/kategorija/omiljeno', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if(response.status === 401) throw new Error("Sesija je istekla");
  if(!response.ok) throw new Error("Interna greška na serveru");
  return response.json();
}

export default function Favourites() {
  const navigate = useNavigate();
  const {data, isLoading, error} = useQuery<{recepti: IRecept[]}, Error>({
    queryKey: ['omiljeno'],
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

  if(isLoading) return <Preloader />

  if(isLoading) {
    return <div className={Style.homeContainer}>
    <Preloader />
    </div>
  }
  
  return <div className={Style.favouritesContainer}>
    <h1 className={Style.title}>Šta danas kuvamo?</h1>
    {data!.recepti.map((item, index) => <KarticaRecepta props={{...item}} key={item.id} delay={index * 250}/>)}
  </div>
}
