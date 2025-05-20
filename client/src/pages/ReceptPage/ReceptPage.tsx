import Style from './ReceptPage.module.css'
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Preloader from '../../components/Preloader/Preloader';
import React, { JSX, useEffect, useState } from 'react';
import IReceptInfo from '../../models/receptInfo.interface';
import DOMPurify from 'dompurify';
import Comment from '../../components/Comment/Comment';
import { useKorisnik } from '../../contexts/KorisnikContext';
import ReceptPagePrintable from '../../components/ReceptPagePrintable/ReceptPagePrintable';
import { pdf } from '@react-pdf/renderer';

interface ReceptSectionProps {
  title: string,
  id?: string,
  children?: React.ReactNode | JSX.Element | string
}

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

const cleanHTML = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h3', 'div', 'span', 'p', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}

// Funkcija za dobijanje pravilno napisane riječi
const getPorcionWord = (porcija: number) => {
  let ostatak = porcija % 10;
  if(porcija >= 11 && porcija <= 20) return 'osoba'
  else if(ostatak === 1) return 'osobu';
  else if(ostatak >= 2 && ostatak <= 4) return 'osobe'
  else return 'osoba'
}

// Funkcija za dobijanje odnosa izbeđu prosječne i maksimalne moguće ocjene
const getPercent = (prosjecna_ocjena: number) => {
  const maximum = 5;
  return (prosjecna_ocjena / maximum) * 100
}

// Generisanje kategorija
const getCategories = (posno: boolean, slatko: boolean, vegansko: boolean) => {
  const categories: string[] = []

  categories.push(posno ? 'posno' : 'mrsno');
  categories.push(slatko ? 'slatko' : 'slano');
  categories.push(vegansko ? 'vegansko' : 'nevegansko');

  return categories.join(', ')
}

// Funkcije za dodavanje / izbacivanje recepata iz Omiljenih
const toggleOmiljeno = async (id_recept: number, omiljeno: boolean) => {
  if(!omiljeno) return await insertOmiljeno(id_recept);
  else return await deleteOmiljeno(id_recept)
}
const insertOmiljeno = async (id_recept: number) => {
  let rs = false;
  try {
    await fetch('/api/omiljeno/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({id_recept})
    });
    rs = true;
  } catch (error) {
    console.error(error)
    alert('Došlo je do greške na serveru. Pokušajte posle');
    rs = false
  } finally {
    return rs;
  }
}
const deleteOmiljeno = async (id_recept: number) => {
  let rs = true;
  try {
    await fetch('/api/omiljeno/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({id_recept})
    });
    rs = false;
  } catch (error) {
    console.error(error)
    alert('Došlo je do greške na serveru. Pokušajte posle');
    rs = true
  } finally {
    return rs;
  }
}

// Funkcija za upsert ocjene
const upsertOcjena = async (id_recept:number, nova_ocjena: number) => {
  
  let result = await fetch('/api/ocjena/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({id_recept, nova_ocjena})
  });
  if(!result.ok) throw result.status;
  return await result.json() as {nova_prosjecna_ocjena: number, novi_broj_ocjena:number};
}

// Funkcija za postovanje komentara
const postComment = async (id_recept: number, odgovor_na: number | null, datum_objave: string, commentContent: string) => {
  let response = await fetch('/api/komentar/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({id_recept, odgovor_na, datum_objave, sadrzaj: commentContent})
  })
  if(!response.ok) throw response.status;
  return await response.json();
}

// funckija za pretvaranje recepta u pdf
const printRecept = async (detaljiRecepta: IReceptInfo) => {
  const blob = await pdf(<ReceptPagePrintable {...detaljiRecepta}/>).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${detaljiRecepta.recept.naslov.split(' ').join('_')}.pdf`;
  a.click();

  // Oslobodi memoriju
  URL.revokeObjectURL(url);
};

// Funkcija za brisanje recepta
const deleteRecept = async (id_recept: number) => {
  const response = await fetch('/api/recept/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({id_recept})
  });
  if(response.status === 400) throw 400
  if(response.status === 401) throw 401;
  if(!response.ok) throw 500;
  return await response.json();
}

export default function ReceptPage() {
  const {korisnik} = useKorisnik();
  const [detaljiRecepta, setDetaljiRecepta] = useState<IReceptInfo | undefined>(undefined);
  const [mojaOcjena, setMojaOcjena] = useState<number | null>(null);
  const [ratingPending, setRatingPending] = useState<boolean>(false);
  const [deleteReceptPending, setDeleteReceptPending] = useState<boolean>(false)
  const [commentPending, setCommentPending] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>('')
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery<IReceptInfo, Error>({
    queryKey: ['recept', id],
    queryFn: () => fetchReceptById(id!),
    enabled: !!id, // fetchuj samo ako postoji id
  });
  const handleToggleFavourite = async () => {
    const result = await toggleOmiljeno(detaljiRecepta!.recept.id, detaljiRecepta!.omiljen);
    const newDetaljiRecepta = {...detaljiRecepta} as IReceptInfo;
    newDetaljiRecepta.omiljen = !!result;
    newDetaljiRecepta.recept.broj_omiljenih += (-1)**Number(!result)
    setDetaljiRecepta(newDetaljiRecepta);
  }
  const handleUpsertOcjena = async () => {
    try {
      setRatingPending(true);
      const result = await upsertOcjena(detaljiRecepta!.recept.id, Number(mojaOcjena));
      if(!result) {
        setRatingPending(false)
        alert('Doslo je do interne greske na serveru!');
        return;
      }
      const newDetaljiRecepta = {...detaljiRecepta} as IReceptInfo;
      newDetaljiRecepta.recept.prosjecna_ocjena = result.nova_prosjecna_ocjena;
      newDetaljiRecepta.recept.broj_ocjena = result.novi_broj_ocjena
      setDetaljiRecepta(newDetaljiRecepta);
    } catch (error) {
        if (error === 401){
          navigate('/unauthorised', {replace: true})
        }
        else {
          alert("Došlo je do interne greške na serveru")
        }
    } finally {
      setRatingPending(false)
    }
  }
  const handleTextAreaChange = (e: React.ChangeEvent) => {
    let value = (e.target as HTMLTextAreaElement).value.slice(0, 255)
    setCommentContent(value)
  }
  const handlePostComment = async () => {
    if(commentContent.length === 0) return;
    try{
      setCommentPending(true);

      const newDetaljiRecepta = {...detaljiRecepta} as IReceptInfo;
      const id_recept = newDetaljiRecepta.recept.id;
      const odgovor_na = null;
      const datum_objave = new Date().toISOString();

      const insertedID = (await postComment(id_recept, odgovor_na, datum_objave, commentContent)).insertedID;
      if(!insertedID) {
        setCommentPending(false)
        alert('Doslo je do interne greske na serveru!');
        return;
      }
      newDetaljiRecepta.komentari.unshift({
        id: insertedID,
        id_recept,
        autor: korisnik!.puno_ime,
        odgovor_na,
        datum_objave,
        mojKomentar: true,
        sadrzaj: commentContent
      });
      setDetaljiRecepta(newDetaljiRecepta);
    } catch (error) {
      if (error === 401){
        navigate('/unauthorised', {replace: true})
      }
      else {
        alert("Došlo je do interne greške na serveru")
      }
    } finally {
      setCommentPending(false);
      setCommentContent('');
    }
  }
  const handleDeleteRecept = async () =>{
    const div = document.createElement("div");
    div.classList.add(Style.deleteReceptPending);
    try {
      document.body.append(div);
      setDeleteReceptPending(true);
      await deleteRecept(data!.recept.id)
      navigate('/', {replace: true})
    } catch (error: any) {
      if(error === 400) {
        alert('Ne možete obrisati recept sa ocjenom većom od ili jednakom 4.5!');
      }
      else if (error === 401){
        navigate('/unauthorised', {replace: true})
      }
      else {
        alert("Došlo je do interne greške na serveru")
      }
    } finally {
      div.remove();
      setDeleteReceptPending(false)
    }
  }
  useEffect(() => {
    if(data) {
      setDetaljiRecepta(data)
      setMojaOcjena(data.ocjena)
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
  }, [data, error, navigate]);

  if (isLoading) return <Preloader />;

  if (error) {
    console.error('Greška pri dohvaćanju recepta:', error);
    return <p>Došlo je do greške.</p>;
  }

  if(!detaljiRecepta) return <p>Nema detalja i doslo je do interne greske na serveru!</p>
  
  return (
    <div className={Style.receptPageContainer} id='recept-page'>
      <div className={Style.receptPageHeader}>
        <h1>{detaljiRecepta.recept.naslov}</h1>
        <div className={Style.buttons}>
          <button className={`${Style.receptControlBtn} ${Style.omiljenoBtn} ${detaljiRecepta.omiljen ? Style.omiljen : ''}`} title={detaljiRecepta.omiljen ? 'Izbaci iz omiljenih' : 'Sačuvaj u omiljene'} onClick={handleToggleFavourite}>
          </button>
          <button className={`${Style.receptControlBtn} ${Style.printBtn}`} onClick={() => {printRecept(detaljiRecepta)}}></button>
          {detaljiRecepta.recept.mojRecept ? <button 
            onClick={() => navigate(`/recept/edit/${id}`)} className={`${Style.receptControlBtn} ${Style.editBtn}`} title='Izmjeni recept'>
          </button> : <></>}
          {detaljiRecepta.recept.mojRecept ? <button onClick={handleDeleteRecept} className={`${Style.receptControlBtn} ${Style.deleteBtn}`} title='Obriši recept'>
          </button> : <></>}
        </div>
      </div>
      <div className={Style.receptSastojci}>
        <span>{`Sastojci za ${detaljiRecepta.recept.porcija} ${getPorcionWord(detaljiRecepta.recept.porcija)}`}</span>
        <ul>{detaljiRecepta.sastojci.map(item => <li key={item.id_sastojak}>{`${item.naziv}, ${item.kolicina}`}</li>)}</ul>
      </div>
      <div className={Style.receptContent}>
        <ReceptSection id='podaci-o-receptu' title='Podaci o receptu:'>
          <table className={Style.tabela}>
            <thead></thead>
            <tbody>
              <tr>
                <th>Datum objave:</th>
                <td>{new Date(detaljiRecepta.recept.datum_kreiranja).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Autor:</th>
                <td style={{textTransform: 'capitalize'}}>{detaljiRecepta.recept.korisnik}</td>
              </tr>
              <tr>
                <th>Prosječna ocjena:</th>
                <td><span className={Style.zvjezdice} style={{'--rating-percent': `${getPercent(detaljiRecepta.recept.prosjecna_ocjena)}%`} as React.CSSProperties}>★★★★★</span>{`${detaljiRecepta.recept.prosjecna_ocjena} (${detaljiRecepta.recept.broj_ocjena})`}</td>
              </tr>
              <tr>
                <th>Broj omiljenih:</th>
                <td>{detaljiRecepta.recept.broj_omiljenih}</td>
              </tr>
              <tr>
                <th>Kategorije:</th>
                <td>{getCategories(detaljiRecepta.recept.posno, detaljiRecepta.recept.slatko, detaljiRecepta.recept.vegansko)}</td>
              </tr>
            </tbody>
          </table>
        </ReceptSection>
        <ReceptSection id='kratki-opis' title='Kratki opis:'>
          {detaljiRecepta.recept.opis}
        </ReceptSection>
        <ReceptSection id='priprema' title='Priprema:'>
          <div style={{textAlign: 'justify'}} dangerouslySetInnerHTML={{__html: cleanHTML(detaljiRecepta.recept.priprema)}}></div>
        </ReceptSection>
        <ReceptSection id='ocjena' title='Ocijenite recept:'>
          <form className={Style.ratingForm}>
            <div className={Style.zvjezdice} style={{'--rating-percent': `${getPercent(Number(mojaOcjena))}%`} as React.CSSProperties}>
              <span className={Style.zvjezda} onClick={() => {setMojaOcjena(1)}}>★</span>
              <span className={Style.zvjezda} onClick={() => {setMojaOcjena(2)}}>★</span>
              <span className={Style.zvjezda} onClick={() => {setMojaOcjena(3)}}>★</span>
              <span className={Style.zvjezda} onClick={() => {setMojaOcjena(4)}}>★</span>
              <span className={Style.zvjezda} onClick={() => {setMojaOcjena(5)}}>★</span>
            </div>
            <button disabled={ratingPending} onClick={handleUpsertOcjena} className={Style.submitBtn} type='button'>{ratingPending ? 'slanje zahtjeva...' : 'potvrdi'}</button>
            <input type='range' min={0} max={5} value={Number(mojaOcjena)} onChange={(e) => {setMojaOcjena(Number(e.target.value))}} />
          </form>
        </ReceptSection>
        <ReceptSection id='komentari' title='Komentari:'>
          <form className={Style.commentForm}>
            <div className={Style.textareaWrapper}>
              <textarea onChange={handleTextAreaChange} value={commentContent}></textarea>
              <span>{`${commentContent.length} / 255`}</span>
            </div>
            <button type='button'  onClick={handlePostComment} disabled={commentPending}>{commentPending ? 'slanje zahtjeva...' : 'sačuvaj komentar'}</button>
          </form>
          {detaljiRecepta.komentari.filter(item => item.odgovor_na === null).map(item => <Comment key={item.id} id={item.id} korisnik={item.autor} odgovorNa={item.odgovor_na} sviKomentari={detaljiRecepta.komentari} datum_objave={item.datum_objave} sadrzaj={item.sadrzaj} mojKomentar={item.mojKomentar} detaljiRecepta={detaljiRecepta} setDetaljiRecepta={setDetaljiRecepta}/>)}
        </ReceptSection>
      </div>
    </div>
  );
}

// Komponenta ReceptSection
const ReceptSection = ({title, id, children}: ReceptSectionProps) => {
  return (
    <section id={id} className={Style.receptSection}>
      <h2 className={Style.title}>{title}</h2>
      <div className={Style.contentWrapper}>{children}</div>
    </section>
  )
}