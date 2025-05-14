import { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import store from './zustand/todo.state'
import Display from './components/Display'
import LandingPage from './pages/Landing'
import { useAuth0 } from '@auth0/auth0-react'
import userStore from './zustand/user.state'

export default function Layout() {
    const fetchTodo = store((state) => state.fetchTodo);
    const addTodo = store((state) => state.addTodo);
    const setSelectedTodo = store((state) => state.setSelectedTodo);
    const addUser = userStore((state) => state.addUser);
    const { user, isAuthenticated, isLoading  } = useAuth0();
    const products = store((state) => state.todos);

    // macro creation
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.shiftKey && e.key.toLowerCase() === 'n'){
                e.preventDefault();
                const todo = {title: "dummy", todo:" ", userId: user?.sub};
                addTodo(todo)
                setSelectedTodo(todo)
                fetchTodo()
            }
        }
        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        }
    }, [user])
    
    // added user creds to db.
    useEffect(() => {
        if (!user || !isAuthenticated || isLoading) return;
        
        const payload = {
            sub: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture,
        };
        addUser(payload);
    }, [user, isAuthenticated, isLoading, addUser]);
    
    
    // fetch and load notes from db to zstd state.
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

    // console.log(user);
    
    return user ? (
        <div className=''>
            <Navbar />
            <div className='flex m-1 gap-1'>
                <Sidebar todos={products} />
                <Display />
            </div>
            </div>
    ) : (
        <LandingPage />
    )
};