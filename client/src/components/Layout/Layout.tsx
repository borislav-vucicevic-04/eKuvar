import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Style from './Layout.module.css'

export default function Layout() {
  return (
    <div className={Style.layoutContainer}>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
