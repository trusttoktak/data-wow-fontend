'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { saveAuth, type AuthUser } from '../../lib/auth';
import { toast } from '../../components/Toast';
import {
  IconUser,
  IconLock,
  IconEmail,
  IconEye,
  IconEyeOff,
  IconMonitor,
  IconAdminGear,
} from '../../lib/icons';

type Stage = 'select' | 'login' | 'register';
type AccessRole = 'USER' | 'ADMIN';

const QUOTES: Record<AccessRole, { title: string; sub: string }> = {
  USER: {
    title: '"Your digital workspace, simplified."',
    sub: 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non.',
  },
  ADMIN: {
    title: '"Powering the tools that power the team."',
    sub: 'Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non.',
  },
};

const inputBase =
  'flex-1 border-0 outline-none text-[0.9rem] text-[#111] bg-transparent placeholder:text-[#aaa]';
const inputWrap =
  'flex items-center border border-border rounded-lg py-[0.55rem] px-3 gap-2 transition-[border-color] duration-200 bg-white focus-within:border-primary';

const eyeBtn = (show: boolean, toggle: () => void) => (
  <button
    type='button'
    onClick={toggle}
    className='bg-transparent border-0 cursor-pointer text-[#aaa] p-0 flex'
  >
    {show ? <IconEye size={16} /> : <IconEyeOff size={16} />}
  </button>
);

export default function LoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('select');
  const [accessRole, setAccessRole] = useState<AccessRole>('USER');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function selectRole(role: AccessRole) {
    setAccessRole(role);
    setStage('login');
    setError('');
  }

  async function handleLogin(e: { preventDefault(): void }) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await api
      .post<{ user: AuthUser }>('/auth/login', { username, password })
      .then((res) => {
        if (res.user.role !== accessRole) {
          setError(
            accessRole === 'ADMIN'
              ? 'This account does not have administrator access.'
              : 'Please use the Administrator portal to login.',
          );
          return;
        }
        saveAuth(res.user);
        toast('Welcome back!');
        router.push(res.user.role === 'ADMIN' ? '/admin' : '/');
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  async function handleRegister(e: { preventDefault(): void }) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    await api
      .post('/auth/register', { username, password })
      .then(() => {
        toast('Account created! Please login.');
        setStage('login');
        setPassword('');
        setConfirmPassword('');
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  /* ── Select stage ── */
  if (stage === 'select') {
    return (
      <div className='min-h-screen bg-white flex flex-col pt-8 max-sm:p-5'>
        <div className='flex items-center gap-[0.6rem] text-[1.1rem] font-bold text-[#111] px-10 pb-8 max-sm:px-0 max-sm:pb-5'>
          <div className='w-7 h-7 bg-primary rounded-full shrink-0' />
          BRAND
        </div>
        <div className='flex-1 flex items-center justify-center bg-[#f5f6f8]'>
          <div className='w-full max-w-[860px] text-center px-4 max-sm:max-w-full'>
            <h1 className='text-[2.25rem] font-extrabold text-[#111] mb-2'>
              Select Access Level
            </h1>
            <p className='text-sm text-muted mb-8'>
              Lorem ipsum dolor sit amet consectetur. Elit purus nam.
            </p>
            <div className='grid grid-cols-2 gap-6 mt-8 max-sm:grid-cols-1'>
              {/* User card */}
              <div className='border border-border rounded-xl p-10 px-8 flex flex-col gap-3 cursor-pointer transition-[border-color,background] duration-200 bg-white text-left hover:border-primary'>
                <div className='text-primary'>
                  <IconMonitor size={40} />
                </div>
                <div className='text-[1.1rem] font-bold text-primary'>User</div>
                <div className='text-[0.82rem] text-primary leading-relaxed flex-1'>
                  Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
                  porttitor nibh urna sit ornare a. Proin dolor morbi id ornare
                  aenean non
                </div>
                <button
                  className='mt-6 py-3 rounded-lg text-[0.9rem] font-semibold cursor-pointer border-2 border-primary w-full flex items-center justify-center gap-[0.4rem] bg-primary text-white'
                  onClick={() => selectRole('USER')}
                >
                  Enter Workspace →
                </button>
              </div>
              {/* Admin card */}
              <div className='bg-primary text-white border border-primary rounded-xl p-10 px-8 flex flex-col gap-3 cursor-pointer'>
                <div className='text-white'>
                  <IconAdminGear size={40} />
                </div>
                <div className='text-[1.1rem] font-bold text-white'>
                  Administrator
                </div>
                <div className='text-[0.82rem] text-white/85 leading-relaxed flex-1'>
                  Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
                  porttitor nibh urna sit ornare a. Proin dolor morbi id ornare
                  aenean non
                </div>
                <button
                  className='mt-6 py-3 rounded-lg text-[0.9rem] font-semibold cursor-pointer border-2 border-white w-full flex items-center justify-center gap-[0.4rem] bg-transparent text-white'
                  onClick={() => selectRole('ADMIN')}
                >
                  Enter Portal →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Login / Register stages — split panel ── */
  const quote = QUOTES[accessRole];

  return (
    <div className='flex w-full min-h-screen'>
      {/* Left panel */}
      <div className='w-2/5 bg-primary p-10 px-8 flex flex-col justify-between max-sm:hidden'>
        <div className='flex items-center gap-[0.6rem] text-[1.1rem] font-bold text-white'>
          <div className='w-7 h-7 bg-white rounded-full shrink-0' />
          BRAND
        </div>
        <div>
          <p className='text-[1.35rem] font-bold leading-[1.4] mb-3 text-white'>
            {quote.title}
          </p>
          <p className='text-[0.8rem] opacity-80 leading-relaxed text-white'>
            {quote.sub}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className='flex-1 bg-white flex items-center justify-center p-12 px-10 max-sm:px-6 max-sm:py-8'>
        <div className='w-full max-w-100'>
          {stage === 'login' && (
            <>
              <h1 className='text-[1.75rem] font-extrabold text-center mb-7 text-[#111]'>
                Login
              </h1>
              <form onSubmit={handleLogin}>
                <div className='mb-[1.1rem]'>
                  <label className='text-[0.9rem] font-medium mb-[0.35rem] text-[#111] block'>
                    Email
                  </label>
                  <div className={inputWrap}>
                    <IconUser size={16} className='text-[#aaa] shrink-0' />
                    <input
                      className={inputBase}
                      type='text'
                      placeholder='Enter your Email Address'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      autoComplete='username'
                    />
                  </div>
                </div>
                <div className='mb-[1.1rem]'>
                  <label className='text-[0.9rem] font-medium mb-[0.35rem] text-[#111] block'>
                    Password
                  </label>
                  <div className={inputWrap}>
                    <IconLock size={16} className='text-[#aaa] shrink-0' />
                    <input
                      className={inputBase}
                      type={showPass ? 'text' : 'password'}
                      placeholder='Enter your Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete='current-password'
                    />
                    {eyeBtn(showPass, () => setShowPass(!showPass))}
                  </div>
                </div>
                {error && (
                  <p className='text-coral text-[0.8rem] mb-3'>{error}</p>
                )}
                <button
                  className='inline-flex items-center justify-center gap-[0.4rem] border-0 rounded-lg py-3 px-6 text-base font-semibold cursor-pointer transition-[background-color,opacity] duration-200 disabled:opacity-55 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-dark w-full'
                  type='submit'
                  disabled={loading}
                >
                  {loading
                    ? 'Loading…'
                    : `Login as ${accessRole === 'ADMIN' ? 'Administrator' : 'User'}`}
                </button>
              </form>
              <p className='text-center mt-4 text-sm text-muted'>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setStage('register');
                    setError('');
                  }}
                  className='bg-transparent border-0 text-primary font-semibold cursor-pointer text-sm'
                >
                  Create an account
                </button>
              </p>
              <p className='text-center mt-2'>
                <button
                  onClick={() => {
                    setStage('select');
                    setError('');
                  }}
                  className='bg-transparent border-0 text-muted cursor-pointer text-sm'
                >
                  ← Back
                </button>
              </p>
            </>
          )}

          {stage === 'register' && (
            <>
              <h1 className='text-[1.75rem] font-extrabold text-center mb-7 text-[#111]'>
                Sign Up
              </h1>
              <form onSubmit={handleRegister}>
                <div className='mb-[1.1rem]'>
                  <label className='text-[0.9rem] font-medium mb-[0.35rem] text-[#111] block'>
                    Full name
                  </label>
                  <div className={inputWrap}>
                    <IconUser size={16} className='text-[#aaa] shrink-0' />
                    <input
                      className={inputBase}
                      type='text'
                      placeholder='Enter your Full Name'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      autoComplete='username'
                    />
                  </div>
                </div>
                <div className='mb-[1.1rem]'>
                  <label className='text-[0.9rem] font-medium mb-[0.35rem] text-[#111] block'>
                    Email
                  </label>
                  <div className={inputWrap}>
                    <IconEmail size={16} className='text-[#aaa] shrink-0' />
                    <input
                      className={inputBase}
                      type='email'
                      placeholder='Enter your Email Address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete='email'
                    />
                  </div>
                </div>
                <div className='mb-[1.1rem]'>
                  <label className='text-[0.9rem] font-medium mb-[0.35rem] text-[#111] block'>
                    Password
                  </label>
                  <div className={inputWrap}>
                    <IconLock size={16} className='text-[#aaa] shrink-0' />
                    <input
                      className={inputBase}
                      type={showPass ? 'text' : 'password'}
                      placeholder='Create a Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete='new-password'
                    />
                    {eyeBtn(showPass, () => setShowPass(!showPass))}
                  </div>
                </div>
                <div className='mb-[1.1rem]'>
                  <label className='text-[0.9rem] font-medium mb-[0.35rem] text-[#111] block'>
                    Confirm Password
                  </label>
                  <div className={inputWrap}>
                    <IconLock size={16} className='text-[#aaa] shrink-0' />
                    <input
                      className={inputBase}
                      type={showConfirmPass ? 'text' : 'password'}
                      placeholder='Re-enter your Password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete='new-password'
                    />
                    {eyeBtn(showConfirmPass, () =>
                      setShowConfirmPass(!showConfirmPass),
                    )}
                  </div>
                </div>
                {error && (
                  <p className='text-coral text-[0.8rem] mb-3'>{error}</p>
                )}
                <button
                  className='inline-flex items-center justify-center gap-[0.4rem] border-0 rounded-lg py-3 px-6 text-base font-semibold cursor-pointer transition-[background-color,opacity] duration-200 disabled:opacity-55 disabled:cursor-not-allowed bg-primary text-white hover:bg-primary-dark w-full'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? 'Creating…' : 'Create an account'}
                </button>
              </form>
              <p className='text-center mt-4 text-sm text-muted'>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setStage('login');
                    setError('');
                  }}
                  className='bg-transparent border-0 text-primary font-semibold cursor-pointer text-sm'
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
