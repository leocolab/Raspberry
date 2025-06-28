// src/components/AuthModal.jsx
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function AuthModal() {
  const { googleLogin, emailLogin, emailSignup } = useAuth();
  const [mode, setMode] = useState('login');   // or 'signup'
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');

  const submit = () =>
    mode === 'login'
      ? emailLogin(email, pass)
      : emailSignup(email, pass);

  return (
    <div className="fixed inset-0 bg-black/60 grid place-items-center">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl w-80 space-y-4">
        <h2 className="text-2xl font-bold">{mode === 'login' ? 'Log in' : 'Sign up'}</h2>
        <input className="w-full border p-2 rounded" placeholder="email"
               value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="password"
               value={pass} onChange={(e)=>setPass(e.target.value)} />
        <button className="w-full bg-[#E30B5C] text-white py-2 rounded" onClick={submit}>
          {mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        <button className="w-full border py-2 rounded" onClick={googleLogin}>
          Continue with Google
        </button>
        <p className="text-sm text-center">
          {mode === 'login' ? 'No account?' : 'Have an account?'}{' '}
          <span className="underline cursor-pointer"
                onClick={()=>setMode(mode==='login'?'signup':'login')}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
}