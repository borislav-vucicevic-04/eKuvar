import Style from './Unauthorised.module.css'
import LockedCookBook from './../../assets/locked-cookbook.svg'
import { Link } from 'react-router-dom'

export default function 	() {
  return (
    <div className={Style.container}>
      <img src={LockedCookBook} alt='locked-cookbook' />
      <h1>401 - Zabranjen pirstup!</h1>
      <p>
        Ili je sesija istekla ili pokušavate izvršiti neovlaštenu radnju.
      </p>
      <Link to={'/'}>Vrati se na početnu stranu</Link>
      <Link to={'/login'}>Uloguj se (ako je sesija istekla)</Link>
    </div>
  )
}
