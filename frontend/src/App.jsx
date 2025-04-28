import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import store from './zustand/todo.state'

function App() {
  const fetchTodo = store((state) => state.fetchTodo);
  const products = store((state) => state.todos)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTodo();
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();    
  }, [fetchTodo])

  useEffect(() => {
    products.map((e) => {
      console.log(e);
    })
  }, [products])

  return (
    <>
      <Navbar />
      <Sidebar todos={products}/>
    </>
  )
}

export default App
