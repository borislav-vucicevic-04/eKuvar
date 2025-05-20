import Style from './NotFound.module.css'
import Img from './../../assets/chef-hat-mascot.jpg'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className={Style.container}>
      <img src={Img} alt='chef-hat-mascot' />
      <h1>404 - Recept nije pronađen!</h1>
      <p>
        Izgleda da je kuvar pogriješio... ili si zalutao u pogrešnu kuhinju.
      </p>
      <Link to={'/'}>Vrati se na početnu stranu</Link>
    </div>
  )
}
