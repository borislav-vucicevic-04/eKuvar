import { useForm } from 'react-hook-form'
import Style from './RecoverAccount.module.css'
import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'

interface FormValues1{
  primarni_kod_oporavka: string,
  sekundarni_kod_oporavka: string,
}
interface FormValues2{
  email: string,
  puno_ime: string,
  lozinka: string,
  lozinkaPotvrda: string
}

interface UserDetails extends FormValues2, FormValues1 {

}

interface StepFormProps {
  step: number, 
  setStep: (value: number) => void,
  codesContainer: FormValues1
  setCodesContainer: (value: FormValues1) => void
}
// Ova funkcija sluzi za prelaz sa koraka na korak
const StepFormSwitch = (params:  StepFormProps): ReactNode => {
  switch(params.step) {
    case 1: return <StepOneForm {...params} />;
    case 2: return <StepTwoForm {...params} />;
    case 3: return <StepThreeForm {...params} />;
    default: return <></>
  }
}

// ova funkcija verifikuje date kodove
const fetchVerifyUserIdentity = async (codes: FormValues1) => {
  const response = await fetch('/api/account/reactivate/verify-user-identity', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(codes)
  })

  if(!response.ok) throw response.status
  else return response.json();
}

// ova funkcija postavlja nove vrednosti u korisnikov nalog
const fetchSetUserDetails = async (details: UserDetails) => {
  const response = await fetch('/api/account/reactivate/set-user-details', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(details)
  })

  if(!response.ok) throw response.status
  else return response.json();
}

export default function RecoverAccount() {
  const [step, setStep] = useState<number>(1);
  const [codesContainer, setCodesContainer] = useState<FormValues1>({
    primarni_kod_oporavka: '',
    sekundarni_kod_oporavka: ''
  });

  return (
    <div className={Style.container}>
      {StepFormSwitch({step, setStep, codesContainer, setCodesContainer})}
    </div>
  )
}

const StepOneForm = (props: StepFormProps) => {
  const {step, setStep, setCodesContainer} = props;
  const {register, handleSubmit, formState} = useForm<FormValues1>();
  const [requestPending, setRequestPending] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string | undefined>(undefined);
  
  const onSubmit = async (data: FormValues1) => {
    const div = document.createElement('div');
    div.classList.add(Style.pendingRequest);
    try {
      document.body.append(div);
      setRequestPending(true);
      await fetchVerifyUserIdentity(data);
      setStep(step + 1);
      setCodesContainer({
        primarni_kod_oporavka: data.primarni_kod_oporavka,
        sekundarni_kod_oporavka: data.sekundarni_kod_oporavka,
      })
    } catch (error) {
      if(error === 404) {
        setRequestError('Niste unijeli ispravne kodove za oporavak naloga')
      } else {
        setRequestError('Došlo je do interne greške na serveru...')
      }
    } finally {
      div.remove();
      setRequestPending(false)
    }
  }
  return (
    <form className={Style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepIndicator step={step} />
      <label>
        <p>Unesite kodove za oporavak naloga koje ste dobili putem email kada ste ugasili Vaš nalog, kako biste potvrdili Vaš identitet.</p>
        <span>Primarni kod:</span>
        <input type='text' id='primarni_kod_oporavka' {...register('primarni_kod_oporavka', {
          required: 'Morate unijeti primarni kod za oporavak naloga...',
          maxLength: {
            value: 16,
            message: 'Primarni kod može imati najviše 16 karaktera'
          },
          minLength: {
            value: 16,
            message: 'Primarni kod mora imati najmanje 16 karaktera'
          }
        })} />
        <div className={Style.errorMessage}>{formState.errors.primarni_kod_oporavka?.message}</div>
      </label>
      <label>
        <span>Sekundarni kod:</span>
        <input type='text' id='sekundarni_kod_oporavka' {...register('sekundarni_kod_oporavka', {
          required: 'Morate unijeti sekundarni kod za oporavak naloga...',
          maxLength: {
            value: 16,
            message: 'Sekundarni kod može imati najviše 16 karaktera'
          },
          minLength: {
            value: 16,
            message: 'Sekundarni kod mora imati najmanje 16 karaktera'
          }
        })} />
        <div className={Style.errorMessage}>{formState.errors.sekundarni_kod_oporavka?.message}</div>
      </label>
      <div className={Style.errorMessage} style={{display: requestError ? 'block' : 'none'}}>{requestError}</div>
      <button>{!requestPending ? 'Dalje' : 'Verifikacija'}</button>
    </form>
  )
}
const StepTwoForm = (props: StepFormProps) => {
  const {step, setStep, codesContainer} = props;
  const {register, handleSubmit, formState} = useForm<FormValues2>();
  const [requestPending, setRequestPending] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string | undefined>(undefined);
  
  const onSubmit = async (data: FormValues2) => {
    const div = document.createElement('div');
    div.classList.add(Style.pendingRequest);
    try {
      if(data.lozinka !== data.lozinkaPotvrda) throw 400;
      document.body.append(div);
      setRequestPending(true);
      await fetchSetUserDetails({
        primarni_kod_oporavka: codesContainer.primarni_kod_oporavka,
        sekundarni_kod_oporavka: codesContainer.sekundarni_kod_oporavka,
        email: data.email,
        puno_ime: data.puno_ime.toLowerCase(),
        lozinka: data.lozinka,
        lozinkaPotvrda: data.lozinkaPotvrda
      });
      setStep(step + 1);
    } catch (error) {
      if(error === 400) {
        setRequestError('Lozinka i potvrda lozinke moraju biti iste...')
      }
      else if(error === 404) {
        setRequestError('Već postoji korisnički nalog sa datim emailom')
      } else {
        console.error(error)
        setRequestError('Došlo je do interne greške na serveru...')
      }
    } finally {
      div.remove();
      setRequestPending(false)
    }
  }
  return (
    <div className={Style.container}>
      <form className={Style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <StepIndicator step={step} />
        <label>
          <p>Uspješno ste potvrdili Vaš identitet! Molimo Vas ponovo unesite Vaše puno ime, email adresu i postavite lozinku.</p>
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
          </label>
          <div className={Style.errorMessage} style={{display: requestError ? 'block' : 'none'}}>{requestError}</div>
        <button>{!requestPending ? 'Potvrdi' : 'Oporavak...'}</button>
      </form>
    </div>
  )
}
const StepThreeForm = ({step}: {step: number}) => {
  return(
    <div className={Style.form}>
      <StepIndicator step={step} />
      <p className={Style.successMessage}>Uspješno ste opravili Vaš nalog!</p>
      <Link className={Style.link} to={'/login'}>Prijavite se...</Link>
    </div>
  )
}
function StepIndicator({step}:{step: number}) {
  return (
    <div className={Style.stepIndicatorWrapper}>
      <div className={`${Style.stepBubble} ${Style.active}`}>1</div>
      <div className={`${Style.stepBubbleSeparator} ${step >= 2 ? Style.active : ''}`}></div>
      <div className={`${Style.stepBubble} ${step >= 2 ? Style.active : ''}`}>2</div>
      <div className={`${Style.stepBubbleSeparator} ${step >= 3 ? Style.active : ''}`}></div>
      <div className={`${Style.stepBubble} ${step >= 3 ? Style.active : ''}`}>3</div>
    </div>
  )
}
