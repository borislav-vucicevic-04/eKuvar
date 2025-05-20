import Style from './LogIn.module.css'
import { useState } from 'react';
import {useForm} from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { useKorisnik } from '../../contexts/KorisnikContext';
import IKorisnik from '../../models/korisnik.interface';
import { useAuth } from '../../contexts/AuthContext';

// interfaces
interface FormValues {
  email: string,
  lozinka: string
}

export default function LogIn() {
  const {setIsAuthorised} = useAuth()
  const {setKorisnik} = useKorisnik()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const form = useForm<FormValues>();
  const { register, handleSubmit, formState } = form;

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message)
      } else {
        const data = await response.json() as IKorisnik;
        Cookies.set('korisnik', JSON.stringify(data), {expires: 7})
        Cookies.set('isAuthorised', 'true', {expires: 7});
        setIsAuthorised(true);
        setKorisnik(data);
        setTimeout(() => {
          navigate('/', {replace: true})
        }, 500);
      }

      setIsLoading(false);
      setErrorMessage('')
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setErrorMessage(error.message)
        setIsLoading(false)
      }
    }
  };
  

  return (
    <div className={Style.container} style={{cursor: isLoading ? 'wait' : 'default'}}>
      <form className={Style.logInForm} onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          <span>Email:</span>
          <input type="email" id='email' {...register('email', {
            required: "Morate unijeti email...",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: "Neispravna email addressa"
            }
          })} />
          <div className={Style.errorMessage}>{formState.errors.email?.message}</div>
        </label>
        <label>
          <span>Lozinka:</span>
          <input type="password" id='lozinka' {...register('lozinka', {
            required: "Morate unijeti lozinku...",
          })}/>
          <div className={Style.errorMessage}>{formState.errors.lozinka?.message}</div>
        </label>
        <div style={{display: !!errorMessage ? 'block' : 'none'}} className={Style.errorMessage}>{errorMessage}</div>
        <button>{isLoading ? 'Provjera...' : 'prijavi se'}</button>
        <div className={Style.linksWrapper}>
          <Link to={'/password-reset'}>Zaboravio/la sam lozinku...</Link>
          <Link to={'/signup'}>Kreirajte nalog...</Link>
          <Link to={'/account/reactivate'}>Oporavite nalog...</Link>
        </div>
      </form>
    </div>
  )
}
