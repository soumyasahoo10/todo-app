import { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import store from './zustand/todo.state'
import Display from './components/Display'
import LandingPage from './pages/Landing'
import { useAuth0 } from '@auth0/auth0-react'

export default function Layout() {
    const fetchTodo = store((state) => state.fetchTodo);
    const { user } = useAuth0();
    const products = store((state) => state.todos);
    
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

    console.log(user);
    
    {return user ? (
        <div className=''>
            <Navbar />
            <div className='flex m-1 gap-1'>
                <Sidebar todos={products} />
                <Display />
            </div>
            </div>
    ) : (
        <LandingPage />
    )}
};