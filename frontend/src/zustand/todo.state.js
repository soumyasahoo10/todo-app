import { create } from 'zustand';

const store = create((set) => ({
    todos: [],
    selectedTodo: null,


    // set the todo for display
    setSelectedTodo: ((todo) => set({selectedTodo: todo})),

    
    // fetch all todos
    fetchTodo: async () => {
        const response = await fetch('http://localhost:3000/api/', {
            method: 'GET'
        });

        const data = await response.json();
        if(data.success){
            set({todos: data.data});
            return data.message
        }
    },

    // add todo
    addTodo: async (body) => {
        const response = await fetch('http://localhost:3000/api/', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.success){
            set((state) => ({
                todos: [...state.todos, data.data]
            }))
        }
    },

    // update todo
    updateTodo: async (id, updated) => {
        const response = await fetch(`http://localhost:3000/api/${id}`, {
            method: 'PUT',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updated)
        });

        const data = await response.json()

        if(data.success){
            set((state) => ({
                todos: state.todos.map((e) => e._id == id ? {...e, ...data.data} : e)
            }))
        }
    },

    // delete todo
    deleteTodo: async (id) => {
        const response = await fetch(`http://localhost:3000/api/${id}`,{
            method: 'DELETE'
        }
        );
        
        const data = await response.json();

        if(data.success){
            set((state) => ({
                todos: state.todos.filter((e) => e._id !== id)
            }))
        }
    }
}));

export default store;