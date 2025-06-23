import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import store from '../zustand/todo.state';

function Display() {
  const selectedTodo = store((state) => state.selectedTodo);
  const updateTodo = store((state) => state.updateTodo);
  const fetchTodo = store((state) => state.fetchTodo);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const { user } = useAuth0();


  useEffect(() => {
    if (selectedTodo) {
      setTitle(selectedTodo.title);
      setBody(selectedTodo.todo);
    }
  }, [selectedTodo]);

  // Update on both title and body change with debounce
  useEffect(() => {
    if (!selectedTodo) return;

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      const updated = { ...selectedTodo, title, todo: body };
      updateTodo(selectedTodo._id, updated);
      fetchTodo(user.sub); // To refresh sidebar
    }, 500);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [title, body]); // ← include both

  return (
    <div className="flex h-screen rounded-xl w-screen bg-slate-100">
      <div className="flex-1 p-8">
        {selectedTodo ? (
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold bg-transparent outline-none"
              placeholder="Title"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-[calc(100vh-10rem)] resize-none bg-transparent outline-none text-lg leading-relaxed text-gray-700 p-4"
              placeholder="Start writing your note..."
            />
          </div>
        ) : (
          <div className="text-gray-500 text-3xl text-center">
            Select a todo from the sidebar
          </div>
        )}
      </div>
    </div>
  );
}

export default Display;
