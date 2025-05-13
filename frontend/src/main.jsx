import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

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
    <RouterProvider router={routes} />
  </StrictMode>,
)
