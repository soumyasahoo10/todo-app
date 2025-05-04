import React, { useState } from 'react';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Logged in successfully');
      // redirect or reload
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold">Login</h2>
      <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" className="bg-green-600 text-white py-2 rounded">Login</button>
    </form>
  );
}

export default Login;
