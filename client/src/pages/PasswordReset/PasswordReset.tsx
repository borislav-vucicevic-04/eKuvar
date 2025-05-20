import Style from './PasswordReset.module.css'
import { ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from 'react-router-dom'

interface FormValuesStep1 {
  email: string
}
interface FormValuesStep2 {
  otp: string
}
interface FormValuesStep3 {
  lozinka: string,
  lozinkaPotvrda: string
}
interface RequestBody {
  email: string,
  otp: string,
  lozinka: string,
}
interface StepFormProps {
  step: number, 
  setStep: (value: number) => void,
  requestBody: RequestBody
  setRequestBody: (value: RequestBody) => void
}
// Ova funkcija sluzi za prelaz sa koraka na korak
const StepFormSwitch = (params:  StepFormProps): ReactNode => {
  switch(params.step) {
    case 1: return <StepOneForm {...params} />;
    case 2: return <StepTwoForm {...params} />;
    case 3: return <StepThreeForm {...params} />;
    case 4: return <StepFourForm step={params.step} />
    default: return <></>
  }
}

// Ova funkcija služi za provjeru emaila 
const fetchVerifyEmail = async (email: string) => {
  const result = await fetch('/api/reset-password/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({email})
  });
  if(result.status === 404) throw 404
  if(!result.ok) throw 500; 
  return await result.json();
}
const fetchVerifyOTP = async (email: string, otp: string) => {
  const result = await fetch('/api/reset-password/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({email, otp})
  });
  if(result.status === 404) throw 404
  if(!result.ok) throw 500; 
  return await result.json();
}
const fetchSetNewPassword = async (email: string, otp: string, lozinka: string) => {
  const result = await fetch('/api/reset-password/set-new-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({email, otp, lozinka})
  });
  if(result.status === 404) throw 404
  if(!result.ok) throw 500; 
  return await result.json();
}

export default function PasswordReset() {
  const [requestBody, setRequestBody] = useState<RequestBody>({
    email: '',
    lozinka: '',
    otp: ''
  })
  const [step, setStep] = useState<number>(1);
  return (
    <div className={Style.container}>
      {StepFormSwitch({step, setStep, requestBody, setRequestBody})}
    </div>
  )
}
function StepOneForm(props: StepFormProps) {
  const {step, setStep, requestBody, setRequestBody} = props
  const {register, handleSubmit, formState} = useForm<FormValuesStep1>();
  const [requestError, setRequestError] = useState<string>('');
  const [requestPending, setRequestPending] = useState<boolean>(false);
  
  const onSubmit = async (data: FormValuesStep1) => {
    const div = document.createElement("div");
    div.classList.add(Style.pendingRequest);
    console.log();
    
    try {
      setRequestPending(true);
      const newReqBody = {...requestBody};
      document.body.append(div);
      await fetchVerifyEmail(data.email);
      newReqBody.email = data.email;
      setStep(step + 1);
      setRequestBody(newReqBody)
    } catch(error: any) {
      if(error === 404) setRequestError('Nije pronađen niti jedan korisnički nalog sa datim emailom')
      else setRequestError('Došlo je do interne greške na serveru. Pokušajte ponovo kasnije')
    } finally {
      setRequestPending(false)
      div.remove()
    }
  }

  return (
  <form className={Style.form} id='stepOne' noValidate onSubmit={handleSubmit(onSubmit)}>
    <StepIndicator step={step} />
    <label>
      <p>Unesite email adresu Vašeg naloga. Nakon toga, na tu adresu cemo Vam poslati kod za promjenu šifre.</p>
      <span>Unesite Vaš email:</span>
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
      <div className={Style.errorMessage}>{formState.errors.email?.message}<br></br>{requestError}</div>
    </label>
    <button>{!requestPending ? 'Dalje' : 'Verifikacija...'}</button>
  </form>
  )
}
function StepTwoForm(props: StepFormProps) {
  const {step, setStep, requestBody, setRequestBody} = props;
  const {register, handleSubmit, formState} = useForm<FormValuesStep2>();
  const [requestError, setRequestError] = useState<string>('');
  const [requestPending, setRequestPending] = useState<boolean>(false);

  const onSubmit = async (data: FormValuesStep2) => {
    const div = document.createElement("div");
    div.classList.add(Style.pendingRequest);
    console.log();
    
    try {
      setRequestPending(true);
      const newReqBody = {...requestBody};
      document.body.append(div);
      await fetchVerifyOTP(requestBody.email, data.otp);
      newReqBody.otp = data.otp;
      setStep(step + 1);
      setRequestBody(newReqBody)
    } catch(error: any) {
      if(error === 404) setRequestError('Uneseni kod nije ispravan. Provjetite još jednom dobijeni mejl.')
      else setRequestError('Došlo je do interne greške na serveru. Pokušajte ponovo kasnije')
    } finally {
      setRequestPending(false)
      div.remove()
    }
  }

  return (
  <form className={Style.form} id='stepTwo' noValidate onSubmit={handleSubmit(onSubmit)}>
    <StepIndicator step={step} />
    <label>
    <p>Poslali smo kod za promjenu šifre na Vaš email.</p>
      <span>Unesite dobijeni kod:</span>
      <input type='text' id='otp' {...register('otp', {
        required: 'Morate unijeti kod...',
        maxLength: {
          value: 16,
          message: 'Kod ima najviše 16 karaktera'
        },
        minLength: {
          value: 16,
          message: 'Kod ima najmanje 16 karaktera'
        },
      })} />
      <div className={Style.errorMessage}>{formState.errors.otp?.message}<br></br>{requestError}</div>
    </label>
    <div className={Style.actionBtnsWrapper}>
      <button style={{display: !requestPending ? 'block' : 'none'}} type='button' onClick={() => {setStep(step - 1)}}>Nazad</button>
      <button>{!requestPending ? 'Dalje' : 'Verifikacija...'}</button>
    </div>
  </form>
  )
}
function StepThreeForm(props: StepFormProps) {
  const {step, setStep, requestBody, setRequestBody} = props;
  const {register, handleSubmit, formState} = useForm<FormValuesStep3>();
  const [requestError, setRequestError] = useState<string>('');
  const [requestPending, setRequestPending] = useState<boolean>(false);

  const onSubmit = async (data: FormValuesStep3) => {
    const div = document.createElement("div");
    div.classList.add(Style.pendingRequest);
    console.log();
    
    try {
      if(data.lozinka !== data.lozinkaPotvrda) throw 400;
      setRequestPending(true);
      const newReqBody = {...requestBody};
      document.body.append(div);
      await fetchSetNewPassword(requestBody.email, requestBody.otp, data.lozinka);
      setStep(step + 1);
      setRequestBody(newReqBody)
    } catch(error: any) {
      if(error === 400) setRequestError('Lozinka i potvrda lozinke moraju biti identične...')
      if(error === 404) setRequestError('Uneseni kod nije ispravan. Provjetite još jednom dobijeni mejl.')
      else setRequestError('Došlo je do interne greške na serveru. Pokušajte ponovo kasnije')
    } finally {
      setRequestPending(false)
      div.remove()
    }
  }

  return (
  <form className={Style.form} id='stepTwo' noValidate onSubmit={handleSubmit(onSubmit)}>
    <StepIndicator step={step} />
    <label>
    <p>Uspješno ste potvrdili Vaš identitet! Sada promijenite lozinku.</p>
      <span>Unesite novu lozinku:</span>
      <input type='text' id='lozinka' {...register('lozinka', {
        required: 'Morate unijeti lozinku...',
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          message: 'Lozinka nije u ispravnom formatu. Ona mora da sadrži najmanje 1 veliko slovo, 1 malo slovo, 1 cifru  i 1 specijalni karakter (karakter koji nije niti slovo niti cifra) i mora imati najmanje 8 karaktera.'
        }
      })} />
      <div className={Style.errorMessage}>{formState.errors.lozinka?.message}</div>
    </label>
    <label>
      <span>Potvrdite lozinku:</span>
      <input type='text' id='lozinka' {...register('lozinkaPotvrda', {
        required: 'Morate potvrditi lozinku...',
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          message: 'Lozinka nije u ispravnom formatu. Ona mora da sadrži najmanje 1 veliko slovo, 1 malo slovo, 1 cifru  i 1 specijalni karakter (karakter koji nije niti slovo niti cifra) i mora imati najmanje 8 karaktera.'
        }
      })} />
      <div className={Style.errorMessage}>{formState.errors.lozinka?.message}<br></br>{formState.errors.lozinkaPotvrda?.message}<br></br>{requestError}</div>
    </label>
    <div className={Style.actionBtnsWrapper}>
      <button style={{display: !requestPending ? 'block' : 'none'}} type='button' onClick={() => {setStep(step - 1)}}>Nazad</button>
      <button>{!requestPending ? 'Dalje' : 'Verifikacija...'}</button>
    </div>
  </form>
  )
}
function StepFourForm({step}: {step: number}) {
  return(
    <div className={Style.form}>
      <StepIndicator step={step} />
      <p className={Style.successMessage}>Uspješno ste promijennili Vašu lozinku!</p>
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
      <div className={`${Style.stepBubbleSeparator} ${step >= 4 ? Style.active : ''}`}></div>
      <div className={`${Style.stepBubble} ${step >= 4 ? Style.active : ''}`}>4</div>
    </div>
  )
}