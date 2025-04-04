import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {API_URL} from '../service/api'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [repass, setRePass] = useState('');
  const [rol, setRol] = useState('user');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (pass !== repass) {
      toast.error('សូមលោកអ្នកបញ្ចូលពាក្យសម្ងាត់ឲបានត្រឹមត្រូវ​ !', {
        position: "top-center",
        autoClose: 3000,
      });
      return; // Stop the form submission
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, { names, email, pass, rol });
      console.log('Registration successful:', response.data);
      toast.success('Register successful!', {
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      toast.error('Register failed.Email already in use.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (

    <div className='h-screen'>
      <div className='h-screen max-w-sm mx-auto grid items-center'>
        <div className='bg-slate-50 shadow-xl p-6 shadow-gray-500 rounded-lg'>
          <div className="flex justify-center py-6">
            <h1 className="font-NotoSansKhmer font-bold text-2xl text-center">បង្កើតអ្នកប្រើប្រាស់</h1>
          </div>
          <form onSubmit={handleRegister}>
            <div className='mb-5 space-y-2'>
              <label htmlFor="email" className="font-NotoSansKhmer font-bold text-lg">ឈ្មោះប្រើប្រាស់:*</label>
              <input
                type="text"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-2.5'
                placeholder="ឈ្មោះប្រើប្រាស់"
                required
              />
            </div>
            <div className='mb-5 space-y-2'>
              <label htmlFor="email" className="font-NotoSansKhmer font-bold text-lg">អុីម៉ែល:*</label>
              <input
                type="email space-y-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm  block w-full p-2.5'
                required
                placeholder="អុីម៉ែល"
              />
            </div>
            <div className="mb-5 space-y-2 relative">
              <label htmlFor="password" className="font-NotoSansKhmer font-bold text-lg">ពាក្យសម្ងាត់:*</label>

              <input
                type={showPassword ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-md block w-full p-2.5"
                required
                placeholder="ពាក្យសម្ងាត់របស់អ្នក"
              />
              <div
                className="absolute top-2/3 right-2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </div>
            </div>
            <div className='mb-5 space-y-2'>
              <label htmlFor="email" className="font-NotoSansKhmer font-bold text-lg">បញ្ជាក់ពាក្យសម្ងាត់:*</label>
              <input
                type="password"
                value={repass}
                onChange={(e) => setRePass(e.target.value)}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-2.5'
                required
                placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
              />
            </div>
            <div className='mb-5 space-y-2'>
              <label htmlFor="email" className="font-NotoSansKhmer font-bold text-lg">អ្នកប្រើប្រាស់:*</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm block w-full p-2.5'
              >
                <option value="superadmin">SuperAdmin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className='flex justify-center pb-10'>
              <button
                type="submit"
                className='text-white bg-blue-700 hover:bg-blue-800 font-medium text-sm w-full sm:w-auto px-5 py-2.5'
              >
                បង្កើតអ្នកប្រើប្រាស់
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Register;
