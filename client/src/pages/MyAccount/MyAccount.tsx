import Style from './MyAccount.module.css'
import { useKorisnik } from '../../contexts/KorisnikContext'
import { useQuery } from '@tanstack/react-query';
import Preloader from '../../components/Preloader/Preloader';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IIzvjestajKorisnik from '../../models/izvjestajKorisnik.interface'
import IKorisnik from '../../models/korisnik.interface';
import ReportPagePrintable from '../../components/ReportPagePrintable/ReportPagePrintable';
import { pdf } from '@react-pdf/renderer';
import PrintIcon from './../../assets/print.svg'
import IIzvjestajRecept from '../../models/izvjestajRecept.interface';
import ReceptReportPrintable from '../../components/ReceptReportPrintable/ReceptReportPrintable';

const fetchUserReport = async () => {
  const response = await fetch('/api/userReport', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  if(!response.ok) throw new Error(response.status.toString());
  else return response.json()
}
const fetchReceptReport = async (id: number) => {
  const response = await fetch('/api/recept/generateReport', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({id})
  });

  if(!response.ok) throw new Error(response.status.toString());
  else return response.json();
} 

// funckija za štampanje izvjeptaja
const printReport = async ({korisnik, izvjestaj}: {korisnik: IKorisnik, izvjestaj: IIzvjestajKorisnik}) => {
  const blob = await pdf(<ReportPagePrintable korisnik={korisnik} izvjestaj={izvjestaj} />).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${korisnik.puno_ime.split(' ').join('_')}_izvještaj_o_mome_nalogu.pdf`;
  a.click();

  // Oslobodi memoriju
  URL.revokeObjectURL(url);
};

// funkcija za generisnje izvještaja o receptu
const printReceptReport = async (izvjestaj: IIzvjestajRecept) => {
  const blob = await pdf(<ReceptReportPrintable izvjestaj={izvjestaj} />).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${izvjestaj.osnovni_podaci.naslov.split(' ').join('_')}_izvještaj.pdf`;
  a.click();

  // Oslobodi memoriju
  URL.revokeObjectURL(url);
}
export default function MyAccount() {
  const navigate = useNavigate();
  const {korisnik} = useKorisnik();
  const {data, isLoading, error} = useQuery<IIzvjestajKorisnik>({
    queryKey: ['userReport'],
    queryFn: () => fetchUserReport()
  });

  const handleGenerateReceptReport = async (id: number) => {
    const div = document.createElement('div');
    div.classList.add(Style.pendingRequest);

    try {
      document.body.append(div);
      await printReceptReport(await fetchReceptReport(id));
    } catch (error: any) {
      if(error){
        if(error?.message === '401') navigate('/unauthorised')
        else alert('Interna greška na serveru, pogledaj konzolu')
      }
    } finally {
      div.remove();
    }
  }

  useEffect(() => {   
    if(error){
      if(error?.message === '401') navigate('/unauthorised')
      else alert('Interna greška na serveru, pogledaj konzolu')
    }
  }, [error])

  if(isLoading) return <Preloader />
  if (error || !data) {
    console.error('Greška pri dohvaćanju recepta:', error);
    return <p>Došlo je do greške.</p>;
  }

  return (
    <div className={Style.container}>
      <div className={Style.titleWrapper}>
        <button className={Style.printBtn} onClick={() => {printReport({korisnik, izvjestaj: data})}}>
          <img src={PrintIcon} ></img>
        </button>
        <h1 className={Style.title}>Izvještaj o mome nalogu</h1> 
      </div>
      <div className={Style.contentWrapper}>
        <h2 className={Style.subtitle}>Osnovni podaci:</h2>
        <table className={Style.table}>
          <thead></thead>
          <tbody>
            <tr>
              <th>Puno ime:</th>
              <td>{korisnik.puno_ime}</td>
            </tr>
            <tr>
              <th>Datum registracije:</th>
              <td>{`${new Date(korisnik.datum_registracije).toLocaleDateString()} ${new Date(korisnik.datum_registracije).toLocaleTimeString()}`}</td>
            </tr>
            <tr>
              <th>Datum poslednje prijave:</th>
              <td>{`${new Date(korisnik.poslednja_prijava).toLocaleDateString()} ${new Date(korisnik.poslednja_prijava).toLocaleTimeString()}`}</td>
            </tr>
            <tr>
              <th>Broj recepta:</th>
              <td>{data.broj_recepta}</td>
            </tr>
            <tr>
              <th>Broj ocjena:</th>
              <td>{data.broj_ocjena}</td>
            </tr>
            <tr>
              <th>Broj omiljenih:</th>
              <td>{data.broj_omiljenih}</td>
            </tr>
            <tr>
              <th>Broj komentara:</th>
              <td>{data.broj_komentara}</td>
            </tr>
            <tr>
              <th>Najbolji recept:</th>
              <td>{data.najbolji_recept}</td>
            </tr>
            <tr>
              <th>Najomiljeniji recept:</th>
              <td>{data.najomiljeniji_recept}</td>
            </tr>
          </tbody>
        </table>
        <h2 className={Style.subtitle}>Moje ocjene:</h2>
        <table className={Style.reportTable}>
          <thead>
            <tr>
              <th className={Style.number}>Broj recepta</th>
              <th className={Style.string}>Naslov</th>
              <th className={Style.string}>Autor</th>
              <th className={Style.number}>Ocjena</th>
            </tr>
          </thead>
          <tbody>{data.moje_ocjene.map(item => <tr key={`ocjene-${item.id}`}>
            <td className={Style.number}>{item.id}</td>
            <td className={Style.string}>{item.naslov}</td>
            <td className={Style.string}>{item.autor}</td>
            <td className={Style.number}>{item.vrijednost}</td>
          </tr>)}</tbody>
        </table>
        <h2 className={Style.subtitle}>Moji omiljeni:</h2>
        <table className={Style.reportTable}>
          <thead>
            <tr>
              <th className={Style.number}>Broj recepta</th>
              <th className={Style.string}>Naslov</th>
              <th className={Style.string}>Autor</th>
            </tr>
          </thead>
          <tbody>{data.moji_omiljeni.map(item => <tr key={`omiljeno-${item.id}`}>
            <td className={Style.number}>{item.id}</td>
            <td className={Style.string}>{item.naslov}</td>
            <td className={Style.string}>{item.autor}</td>
          </tr>)}</tbody>
        </table>
        <h2 className={Style.subtitle}>Moji recepti:</h2>
        <table className={Style.reportTable}>
          <thead>
            <tr>
              <th className={Style.number}>Broj recepta</th>
              <th className={Style.string}>Naslov</th>
              <th className={Style.number}>Prosjecna ocjena</th>
              <th className={Style.number}>Broj ocjena</th>
              <th className={Style.number}>Broj omiljenih</th>
              <th className={Style.number}>Broj komentara</th>
              <th className={Style.string}>Izvještaj</th>
            </tr>
          </thead>
          <tbody>{data.moji_recepti.map(item => <tr key={`recept-${item.id}`}>
            <td className={Style.number}>{item.id}</td>
            <td className={Style.string}>{item.naslov}</td>
            <td className={Style.number}>{item.prosjecna_ocjena}</td>
            <td className={Style.number}>{item.broj_ocjena}</td>
            <td className={Style.number}>{item.broj_omiljenih}</td>
            <td className={Style.number}>{item.broj_komentara}</td>
            <td className={Style.string}>
              <a href='#' onClick={async (event) => {
                event.preventDefault();
                const element = event.target as HTMLAnchorElement;

                element.innerText = 'Generisanje'
                await handleGenerateReceptReport(item.id);
                element.innerHTML = 'Generiši'
              }}>
                Generiši
              </a>
            </td>
          </tr>)}</tbody>
        </table>
        <div></div>
      </div>
    </div>
  )
}

