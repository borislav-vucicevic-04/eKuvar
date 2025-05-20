import { Controller, FormProvider, useForm } from 'react-hook-form';
import Styles from './ReceptEdit.module.css';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import SastojsciForm from '../../components/SastocjiForm/SastojsciForm';
import IRecept from '../../models/recept.interface';
import DOMPurify from 'dompurify';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import IReceptInfo from '../../models/receptInfo.interface';
import Preloader from '../../components/Preloader/Preloader';

interface Sastojak {
  id: number,
  naziv: string;
  kolicina: string;
}

interface FormValues {
  naslov: string,
  opis: string,
  porcija: number,
  posno: boolean,
  slatko: boolean;
  vegansko: boolean,
  priprema: string,
  sastojci: Sastojak[];
}
// funkcija za dohvatanje recepta
const fetchReceptById = async (id: string): Promise<IReceptInfo> => {
  const response = await fetch(`/api/recept/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if(response.status === 401) throw new Error("Sesija je istekla");
  if(response.status === 404) throw new Error("Recept nije pronadjen!");
  if (!response.ok) {
    throw new Error(`Greška prilikom dohvata recepta (ID: ${id})`);
  }

  return response.json();
};
// funkcija za brisanje nedozvoljenih html tagovva
const cleanHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h3', 'div', 'span', 'p', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}
// funkcija za čuvanje promjena
const editRecept = async (receptData: IRecept, sastojci: Sastojak[]) => {
  const result = await fetch(`/api/recept/edit/${receptData.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({receptData, sastojci})
  });
  if(result.status === 401) throw 401
  if(!result.ok) throw 500
  return await result.json() as {updatedID: string};
}


export default function ReceptEdit() {
  const navigate = useNavigate();
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery<IReceptInfo, Error>({
    queryKey: ['recept', id],
    queryFn: () => fetchReceptById(id!),
    enabled: !!id, // fetchuj samo ako postoji id
  });
  const methods = useForm<FormValues>({
    defaultValues: {
      sastojci: [],
    },
  });
  const { register, control, handleSubmit, formState, reset } = methods;

  const onSubmit = async (formValues: FormValues) => {
    const div = document.createElement("div");
    div.classList.add(Styles.requestPendingOverlay);
    const receptData: IRecept = {
      id: data!.recept.id, // postavljamo na nula jer će se to automatski postaviti na backendu
      korisnik: '', // ostavljamo prazno jer nećemo raditi sa tim podatkom
      prosjecna_ocjena: 0, // isto kao i za korisnik
      broj_ocjena: 0, // isto kao i za korisnik
      broj_omiljenih: 0, // isto kao i za korisnik
      naslov: formValues.naslov,
      opis: formValues.opis,
      porcija: formValues.porcija,
      posno: formValues.posno,
      slatko: formValues.slatko,
      vegansko: formValues.vegansko,
      priprema: cleanHTML(formValues.priprema),
      datum_kreiranja: new Date().toISOString(),
      mojRecept: true
    }
    const sastojci = formValues.sastojci;
    try {
      setIsRequestPending(true)
      document.body.append(div);
      var updatedID = (await editRecept(receptData, sastojci)).updatedID;
      navigate(`/recept/${updatedID}`, {replace: true})
    } catch (error) {
      if(error === 401) navigate('/unauthorised', {replace: true})
      else alert('Došlo je do interne greške na serveru!')
    }
    finally {
      setIsRequestPending(false);
      div.remove()
    }
  }
  useEffect(() => {
    if(data) {
      if(!data.recept.mojRecept) {
        navigate('/unauthorised', {replace: true})
      }
      else {
        reset({
          naslov: data.recept.naslov,
          opis: data.recept.opis,
          porcija: data.recept.porcija,
          posno: data.recept.posno,
          slatko: data.recept.slatko,
          vegansko: data.recept.vegansko,
          priprema: data.recept.priprema,
          sastojci: data.sastojci.map(item => { return {id: item.id_sastojak, naziv: item.naziv, kolicina: item.kolicina} })
        })
      }
    }
    if(error) {
      if (error?.message === 'Sesija je istekla') {
        navigate('/unauthorised', {replace: true})
        console.error(error)
      }
      else if(error.message === 'Recept nije pronadjen!') {
        navigate(`/recept/${id}/nije-pronadjen`)
      }
      else {
        alert('Interna greška na serveru, pogledaj konzolu')
      }
    }
  }, [data, error])
  if(isLoading) return <Preloader />
  return (
    <div className={Styles.receptEdit}>
      <h1 className={Styles.title}>Izmijenite recept</h1>
      <FormProvider {...methods}>
        <form className={Styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div 
            className={Styles.errorWrapper}
            style={{display: Object.entries(formState.errors).length > 0 ? 'flex' : 'none'}}
          >
            {Object.entries(formState.errors).map(item => <p key={item[0]}>{item[1].message}</p>)}
          </div>
          <label className={Styles.inputControl}>
            <span>Naslov:</span>
            <input
              type='text'
              id='naslov'
              {...register('naslov', {
                required: 'Morate unijeti naslov...',
                maxLength: {
                  value: 50,
                  message: 'Naslov ne smije biti duži od 50 karaktera',
                },
              })}
            />
          </label>
          <label className={Styles.inputControl}>
            <span>Kratki opis:</span>
            <textarea
              id='opis'
              {...register('opis', {
                required: 'Morate unijeti kratki opis svoga recepta...',
                maxLength: {
                  value: 512,
                  message: 'Tekst kratkog opisa ne smije biti duži od 512 karaktera',
                },
              })}
            ></textarea>
          </label>
          <label className={Styles.inputControl}>
            <span>Porcija:</span>
            <input
              type='number'
              id='porcija'
              {...register('porcija', {
                required: 'Morate unijeti za koliko osoba je recept...',
                min: {
                  value: 1,
                  message: 'Broj porcija ne smije biti manji od 1',
                },
                max: {
                  value: 255,
                  message: 'Broj procija ne smije biti veći od 255',
                },
              })}
            />
          </label>
          <div className={Styles.categoriesWrapper}>
            <span>Kategorije:</span>
            <label className={`${Styles.category} ${Styles.posno}`}>
              <div className={Styles.categoryIndicator}></div>
              <span>Mrsno</span>
              <span>Posno</span>
              <input type='checkbox' id='posno' {...register('posno')} />
            </label>
            <label className={`${Styles.category} ${Styles.slatko}`}>
              <div className={Styles.categoryIndicator}></div>
              <span>Slano</span>
              <span>Slatko</span>
              <input type='checkbox' id='slatko' {...register('slatko')} />
            </label>
            <label className={`${Styles.category} ${Styles.vegansko}`}>
              <div className={Styles.categoryIndicator}></div>
              <span>Nevegansko</span>
              <span>Vegansko</span>
              <input type='checkbox' id='vegansko' {...register('vegansko')} />
            </label>
          </div>
          <label className={Styles.inputControl} htmlFor='priprema' onClick={() => {
            const richTextEditor = document.querySelector('.tiptap.ProseMirror') as HTMLDivElement;
            richTextEditor.focus();
          }}>
            <span>Priprema:</span>
            <Controller
              name='priprema'
              control={control}
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </label>
          <SastojsciForm />
          <button type='submit' className={Styles.createReceptBtn}>
            {
              !isRequestPending ?
              'Sačuvaj promjene' :
              'Promjene se čuvaju...'
            }
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
