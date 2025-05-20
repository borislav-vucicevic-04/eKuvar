import { Link } from 'react-router-dom'
import Style from './Navbar.module.css'

// icons
import HomePageIcon from './../../assets/homepage.svg'
import ChefIcon from './../../assets/chef.svg'
import LogOutIcon from './../../assets/log-out.svg'
import PlusIcon from './../../assets/plus.svg'
import EmptyHeart from './../../assets/empty-heart.svg'
import TurnOff from './../../assets/turn-off.svg'

export default function Navbar() {
  return (
    <nav className={Style.navbarContainer}>
      <Link to='/' className={Style.link} title='Početna stranica'>
        <img src={HomePageIcon} alt="home page icon" />
      </Link>
      <Link to={'/omiljeno'} className={Style.link} title='Omiljeno'>
        <img src={EmptyHeart} alt={'empty heart'} />
      </Link>
      <Link to='/moj-nalog' className={Style.link} title='Moj nalog'>
        <img src={ChefIcon} alt="chef icon" />
      </Link>
      <Link to='/recept/new' className={Style.link} title='Novi recept'>
        <img src={PlusIcon} alt='plus icon' />
      </Link>
      <Link to='/logout' className={Style.link} title='Odjava'>
        <img src={LogOutIcon} alt='log out icon' />
      </Link>
      <Link to='/account/deactivate' className={Style.link} title='Ugasi nalog'>
        <img src={TurnOff} alt='log out icon' />
      </Link>
    </nav>
  )
}
