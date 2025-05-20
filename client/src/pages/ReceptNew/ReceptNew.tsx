import { Controller, FormProvider, useForm } from 'react-hook-form';
import Styles from './ReceptNew.module.css';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';
import SastojsciForm from '../../components/SastocjiForm/SastojsciForm';
import IRecept from '../../models/recept.interface';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const cleanHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h3', 'div', 'span', 'p', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}

const insertRecept = async (receptData: IRecept, sastojci: Sastojak[]) => {
  const result = await fetch('/api/recept/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({receptData, sastojci})
  });
  if(result.status === 401) throw 401
  if(!result.ok) throw 500
  return await result.json() as {insertedReceptID: string};
}


export default function ReceptNew() {
  const navigate = useNavigate();
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false) 
  const methods = useForm<FormValues>({
    defaultValues: {
      sastojci: [],
    },
  });
  const { register, control, handleSubmit, formState } = methods;

  const onSubmit = async (data: FormValues) => {
    const div = document.createElement("div");
    div.classList.add(Styles.requestPendingOverlay);
    const receptData: IRecept = {
      id: 0, // postavljamo na nula jer će se to automatski postaviti na backendu
      korisnik: '', // isto kao i za id
      prosjecna_ocjena: 0, // isto kao i za id
      broj_ocjena: 0, // isto kao i za id
      broj_omiljenih: 0, // isto kao i za id
      naslov: data.naslov.toLowerCase(),
      opis: data.opis,
      porcija: data.porcija,
      posno: data.posno,
      slatko: data.slatko,
      vegansko: data.vegansko,
      priprema: cleanHTML(data.priprema),
      datum_kreiranja: new Date().toISOString(),
      mojRecept: true
    }
    const sastojci = data.sastojci;
    try {
      setIsRequestPending(true)
      document.body.append(div);
      var insertedReceptID = (await insertRecept(receptData, sastojci)).insertedReceptID;
      navigate(`/recept/${insertedReceptID}`, {replace: true})
    } catch (error) {
      if(error === 401) navigate('/unauthorised', {replace: true})
      else alert('Došlo je do interne greške na serveru!')
    }
    finally {
      setIsRequestPending(false);
      div.remove()
    }
  }
  return (
    <div className={Styles.receptNew}>
      <h1 className={Styles.title}>Napravite novi recept</h1>
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
              'Kreiraj recept' :
              'Recept se kreira...'
            }
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
