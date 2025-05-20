import { useForm } from 'react-hook-form'
import Style from './DeactivateAccount.module.css'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useKorisnik } from '../../contexts/KorisnikContext';

interface FormValues {
  email: string,
  lozinka: string
}

const fetchDeactivateAccount:any = async ({email, lozinka}: FormValues) => {
  const result = await fetch('/api/account/deactivate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({email, lozinka, datum_gasenja: new Date().toISOString()})
  });

  if(result.status === 400) throw 400;
  if(result.status === 401) throw 401
  if(!result.ok) throw 500;

  return await result.json()
}

export default function DeactivateAccount() {
  const {setIsAuthorised} = useAuth();
  const {setKorisnik} = useKorisnik();
  const navigate = useNavigate();
  const {register, handleSubmit, formState} = useForm<FormValues>();
  const [pendingRequest, setRequestPending] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string | undefined>()

  const onSubmit = async (data: FormValues) => {
    if(!confirm('Molimo Vas da potvrdite da li ste sigurni da želite da ugasite Vaš nalog. Napominjemo da kada ugasite nalog samo Vaši lični podaci biće obrisani. Prilikom uspješne deaktivacije naloga, na Vaš email će te dobiti poruku sa kodovima za potencijalnu reaktivaciju ugašenog naloga.')) return;
    
    const div = document.createElement("div");
    div.classList.add(Style.pendingRequest);

    try {
      document.body.append(div);
      setRequestPending(true);
      await fetchDeactivateAccount(data)
      Cookies.remove('isAuthorised');
      Cookies.remove('korisnik');
      setIsAuthorised(false);
      setKorisnik({
        puno_ime: '',
        datum_registracije: '',
        poslednja_prijava: '',
      })
      navigate('/login', {replace: true})
    } catch (error) {
      if(error === 401) {
        navigate('/unauthorised', {replace: true})
      }
      else if(error === 400) {
        setRequestError('Email i/ili lozinka nisu ispravni...')
      }
      else {
        setRequestError('Došlo je do interne greške na serveru. Pokušajte ponovo kasnije')
      }
    } finally {
      div.remove();
      setRequestPending(false);
    }
  }

  return (
    <div className={Style.container}>
      <form className={Style.form} noValidate={true} onSubmit={handleSubmit(onSubmit)}>
        <h1>Deaktivacija naloga</h1>
        <label>
          <p>Kako biste ugavili Vaš nalog, prvo potvrdite Vaš identitet tako što ćete unijeti email i lozinku Vašeg naloga.</p>
          <span>Email:</span>
          <input type='email' id='email' {...register('email', {
            required: 'Morate unijeti Vašu email adresu...',
            maxLength: {
              value: 50,
              message: 'Email ne smije imati više od 50 karaktera...'
            },
            pattern: {
              value: /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
              message: 'Email adresa nije u ispravnom formatu! Primjer ispravne adrese: milan-milovanovic_09.92@example.com'
            }
          })} />
          <div className={Style.errorMessage}>{formState.errors.email?.message}</div>
        </label>
        <label>
          <span>Lozinka:</span>
          <input type='password' id='lozinka' {...register('lozinka', {
            required: 'Morate unijeti lozinku...'
          })} />
          <div className={Style.errorMessage}>{formState.errors.lozinka?.message}</div>
        </label>
        <div style={{display: requestError ? 'block' : 'none'}} className={Style.errorMessage}>{requestError}</div>
        <button>{!pendingRequest ? 'Potvrdi' : 'Obrada zahtjeva...'}</button>
      </form>
    </div>
  )
}
