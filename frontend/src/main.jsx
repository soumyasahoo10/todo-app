import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { Auth0Provider } from '@auth0/auth0-react'



const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </>
  )
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      cacheLocation="localstorage" // persists login even on hard refresh
      useRefreshTokens={true} // refresh tokens silently
      domain="dev-wcw3ytnc8wfuwgjc.us.auth0.com"
      clientId="sRuqF6ub4auKg0Z9VA1RdrW6LXVwqrnt"
      authorizationParams={{
        redirect_uri: window.location.origin
    }}>
      <RouterProvider router={routes} />
    </Auth0Provider>
  </StrictMode>,
)
