import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import store from './zustand/todo.state'
import Display from './components/Display'

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
    console.log(products);
    // products.map((e) => {
    // })
  }, [products])

  return (
    <>
      <Navbar />
      <div className='flex'>
        <Sidebar todos={products} />
        <Display />
      </div>
    </>
  )
}

export default App
