import { useForm } from 'react-hook-form'
import Style from './SignUp.module.css'
import { useKorisnik } from '../../contexts/KorisnikContext'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import IKorisnik from '../../models/korisnik.interface';
import { useAuth } from '../../contexts/AuthContext';

interface FormValues {
  puno_ime: string,
  email: string,
  lozinka: string,
  lozinkaPotvrda: string
}
const fetchSignUp = async (formValues: FormValues) => {
  const currentDate = new Date().toISOString();
  var response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      puno_ime: formValues.puno_ime.toLowerCase(),
      email: formValues.email,
      lozinka: formValues.lozinka,
      datum_registracije: currentDate,
      poslednja_prijava: currentDate
    })
  });

  if(response.status === 400) throw 400
  if(!response.ok) throw 500
  
  return await response.json() as IKorisnik
}
export default function SignUp() {
  const navigate = useNavigate();
  const {setIsAuthorised} = useAuth();
  const {setKorisnik} = useKorisnik();
  const [lozinkaPotvrdaError, setLozinkaPotvrdaError] = useState<string>('')
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string>('')

  const Validate = (data: FormValues): boolean => {
    if(data.lozinkaPotvrda !== data.lozinka) {
      setLozinkaPotvrdaError('Lozinka i potvrda lozinke ne smiju biti različite...');
      return false
    } else {
      setLozinkaPotvrdaError('');
      return true
    }
  }
  const onSubmit = async (data: FormValues) => {
    if(!Validate(data)) return;
    const div = document.createElement('div');
    div.classList.add(Style.pendingRequest);
    try {
      document.body.append(div);
      setIsRequestPending(true);
      const result: IKorisnik = await fetchSignUp({
        email: data.email,
        lozinka: data.lozinka,
        puno_ime: data.puno_ime.toLowerCase(),
        lozinkaPotvrda: data.lozinkaPotvrda
      });
      Cookies.set('korisnik', JSON.stringify(result), {expires: 7})
      Cookies.set('isAuthorised', 'true', {expires: 7});
      setIsAuthorised(true);
      setKorisnik(result);
      setTimeout(() => {
        navigate('/', {replace: true})
      }, 500);
    } catch (error) {
      if(error === 400) {
        setSignUpError('Već postoji korisnički nalog sa datim emailom')
      } else {
        alert('Došlo je do interne greške na serveru...')
      }
    } finally {
      div.remove();
      setIsRequestPending(false)
    }
  }

  return (
    <div className={Style.container}>
      <form className={Style.signUpForm} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Puno ime:</span>
          <input type="text" id='punoIme' {...register('puno_ime', {
            required: 'Morate unijeti Vaše puno ime...',
            maxLength: {
              value: 50,
              message: 'Puno ime ne smije imati više od 50 karaktera...'
            }
          })} />
          <div className={Style.errorMessage}>{formState.errors.puno_ime?.message}</div>
        </label>
        <label>
          <span>Email:</span>
          <input type="email" id='email' {...register('email', {
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
          <input type="password" id='lozinka' {...register('lozinka', {
            required: 'Morate unijeti lozinku...',
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
              message: 'Lozinka nije u ispravnom formatu. Ona mora da sadrži najmanje 1 veliko slovo, 1 malo slovo, 1 cifru  i 1 specijalni karakter (karakter koji nije niti slovo niti cifra) i mora imati najmanje 8 karaktera.'
            }
          })} />
          <div className={Style.errorMessage}>{formState.errors.lozinka?.message}</div>
        </label>
        <label>
          <span>Potvrdi lozinku:</span>
          <input type="password" id='lozinkaPotvrda' {...register('lozinkaPotvrda', {
            required: 'Morate potvrditi lozinku...',
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
              message: 'Lozinka nije u ispravnom formatu. Ona mora da sadrži najmanje 1 veliko slovo, 1 malo slovo, 1 cifru  i 1 specijalni karakter (karakter koji nije niti slovo niti cifra) i mora imati najmanje 8 karaktera.'
            }
          })} />
          
          <div className={Style.errorMessage}><div>{formState.errors.lozinkaPotvrda?.message}</div><br/><div>{lozinkaPotvrdaError}</div></div>
        </label>
        <div className={Style.errorMessage} style={{display: !!signUpError ? 'block' : 'none'}}>{signUpError}</div>
        <button>{
          !isRequestPending ?
          'registruj se' :
          'registracija u toku...'
        }</button>
      </form>
    </div>
  )
}
