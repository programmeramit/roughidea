'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
}
