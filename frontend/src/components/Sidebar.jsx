import { Sidebar as Side, Menu, MenuItem, SubMenu } from'react-pro-sidebar'
import { MdDoubleArrow } from "react-icons/md";

import React, { useState } from 'react'

export default function Sidebar({todos}) {
  const [isopen, setIsopen] = useState('false');
  
  const handleToggle = () => {
    setIsopen((prev) => (!prev))
  };

  return (
    <div className='flex items-center font-light'>
      <Side collapsed={isopen} collapsedWidth='150px' width='280px' transitionDuration='200'>
        <Menu>
          <div className='flex'>
            <p className='p-3 text-center'>Recent</p>
            <hr />
            {isopen ? (
              <button className='absolute m-2.5 p-2.5 top-0 right-0 duration-300 hover:cursor-pointer hover:bg-slate-200' onClick={handleToggle}><MdDoubleArrow /></button>
            ) : (
              <button className='absolute m-2.5 p-2.5 top-0 right-0 duration-300 hover:cursor-pointer rotate-180  hover:bg-slate-200' onClick={handleToggle}><MdDoubleArrow /></button>
            )}
          </div>
          {todos.map((e) => (
            <MenuItem className='hover:font-normal' key={e._id}>
              {e.title}
            </MenuItem>
          ))}
        </Menu>
      </Side>
    </div>
  )
}