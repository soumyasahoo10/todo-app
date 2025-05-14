import React, { useEffect, useState } from 'react';
import store from '../zustand/todo.state';

function Display() {
  const selectedTodo = store((state) => state.selectedTodo);
  const updateTodo = store((state) => state.updateTodo);
  const fetchTodo = store((state) => state.fetchTodo);
  const [body, setBody] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    if (selectedTodo) {
      setBody(selectedTodo.todo);
    }
  }, [selectedTodo]);

  useEffect(() => {
    if (!selectedTodo) return;

    // Clear the previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set a new timeout
    const timeout = setTimeout(() => {
      const updated = { ...selectedTodo, todo: body };
      updateTodo(selectedTodo._id, updated);
      fetchTodo();
      // console.log("Auto-saved:", updated);
    }, 1000); // Adjust debounce delay as needed

    setTypingTimeout(timeout);

    // Cleanup on unmount or next effect
    return () => clearTimeout(timeout);
  }, [body]);

  return (
    <div className="flex h-screen rounded-xl w-screen bg-slate-100">
      <div className="flex-1 p-8">
        {selectedTodo ? (
          <div>
            <h1 className="text-3xl font-bold">{selectedTodo.title}</h1>
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