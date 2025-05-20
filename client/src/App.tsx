import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
// components
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// pages
import Home from './pages/Home/Home'
import MyAccount from './pages/MyAccount/MyAccount'
import NotFound from './pages/NotFound/NotFound'
import LogIn from './pages/LogIn/LogIn'
import SignUp from './pages/SignUp/SignUp'
import Unauthorised from './pages/Unauthorised/Unauthorised'
import ReceptPage from './pages/ReceptPage/ReceptPage'
import ReceptNew from './pages/ReceptNew/ReceptNew'
import ReceptEdit from './pages/ReceptEdit/ReceptEdit'
import PasswordReset from './pages/PasswordReset/PasswordReset'
import DeactivateAccount from './pages/DeactivateAccount/DeactivateAccount'
import RecoverAccount from './pages/RecoverAccount/RecoverAccount'
import Favourites from './pages/Favourites/Favourites'
import LogOut from './pages/LogOut/LogOut'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path='/moj-nalog' element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          } />
          <Route path='/omiljeno' element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }/>
          <Route path='/recept/:id' element={
            <ProtectedRoute>
              <ReceptPage />
            </ProtectedRoute>
          } />
          <Route path='/recept/new' element={
            <ProtectedRoute>
              <ReceptNew />
            </ProtectedRoute>
          } />
          <Route path='/recept/edit/:id' element={
            <ProtectedRoute>
              <ReceptEdit />
            </ProtectedRoute>
          } />
          <Route path='/account/deactivate' element={
            <ProtectedRoute>
              <DeactivateAccount />
            </ProtectedRoute>
          } />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='/login' element={<LogIn />} />
        <Route path='/logout' element={<LogOut />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/account/reactivate' element={<RecoverAccount />} />
        <Route path='/account/deactivate' element={<RecoverAccount />} />
        <Route path='/password-reset' element={<PasswordReset />} />
        <Route path='/unauthorised' element={<Unauthorised />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
