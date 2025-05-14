import { Sidebar as Side, Menu, MenuItem } from'react-pro-sidebar'
import { MdDoubleArrow } from "react-icons/md";
import React, { useState } from 'react'
import store from '../zustand/todo.state';

export default function Sidebar({todos}) {
  const [isopen, setIsopen] = useState('false');

  const setTodo = store((state) => (state.setSelectedTodo));
  
  const handleToggle = () => {
    setIsopen((prev) => (!prev))
  };

  return (
    <div className='h-screen bg-slate-700 rounded-xl overflow-hidden'>
      <Side collapsed={isopen} collapsedWidth='150px' width='280px' transitionDuration='200' className='h-screen'>
        <Menu>
          <div className='flex'>
            <p className='p-3 text-center'>Recent</p>
            <button className={`absolute m-2.5 p-2.5 right-3 duration-300 hover:cursor-pointer hover:bg-slate-200 ${isopen ? '' : 'rotate-180 right-10'}`} onClick={handleToggle}><MdDoubleArrow /></button>
          </div>
          {todos.map((e) => (
            <MenuItem className='hover:font-normal' key={e._id} onClick={() => setTodo(e)}>
              {e.title}
            </MenuItem>
          ))}
        </Menu>
      </Side>
    </div>
  )
}