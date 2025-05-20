import { JSX, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

// contexts
import { useAuth } from '../../contexts/AuthContext'

interface IProps {
  children: JSX.Element
}
export default function ProtectedRoute({children}: IProps) {
  const {isAuthorised, setIsAuthorised} = useAuth()
  const isAuthCookie = Cookies.get('isAuthorised')

  useEffect(() => {
    if (!isAuthorised && isAuthCookie) {
      setIsAuthorised(true)
    }
  }, [isAuthorised, isAuthCookie, setIsAuthorised])
  // provjeravamo da li je korisnik ulogovan
  if(!isAuthorised) {
    // ako korisnik nije ulogovan i ne postoji kolačić o njegovom logovanju, preusmjeravmo se na stranicu login
    if(!isAuthCookie) return <Navigate to={'/login'} replace={true} />
    // u suprotnom ostavljamo isAuthorised na true i vraćamo children zasticene rute
    else return children
  }
  else return children
}
