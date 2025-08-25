import { create } from "zustand";

const userStore = create((set) => ({
    user: null,

    addUser: async (newUser) => {
        // console.log(newUser);   

        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const data = await res.json();
        // console.log(data);
        
        
        if (data.success){
            set({user: newUser});
        }
    },

    removeUser: () => set({user: null})
}))

export default userStore;