import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import banner from '../image/image.jpg'
import {API_URL} from '../service/api'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, pass: password });
      localStorage.setItem('token', response.data.token); // Save token
      localStorage.setItem('user_names', response.data.user_names);
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('user_rol', response.data.user_rol);
      localStorage.setItem('user_email', response.data.user_email);

      toast.success('Login successful!', {
        position: "top-center",
        autoClose: 3000,
      });
      window.location.href = "/Dashboard";
    } catch (error) {
      toast.error('សូមពិនិត្យមើល អ៊ីម៉ែល និង លេខសម្ថាត់ ​របស់អ្នក។.', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className='grid md:grid-cols-2 grid-cols-1'>
      <div
        className="h-screen bg-cover bg-opacity-40 bg-center bg-gray-800"
      >
        <div className="h-screen max-w-sm mx-auto p-4 grid items-center">
          <div className="p-6 bg-slate-100  bg-opacity-40">
            <div className="flex justify-center py-6">
              <h1 className=" font-KhmerMoul font-bold text-2xl text-center">ហាងលក់ <br /> ទំនិញចែប៊ីម៉ាត</h1>
            </div>
            <form onSubmit={handleLogin}>
              <div className="mb-5 space-y-2">
                <label htmlFor="email" className="font-NotoSansKhmer font-bold text-lg">អុីម៉ែល:*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-md block w-full p-2.5"
                  placeholder="អ៊ីម៉ែលរបស់អ្នក"
                  required
                />
              </div>


              <div className="mb-5 space-y-2 relative">
                <label htmlFor="password" className="font-NotoSansKhmer font-bold text-lg">ពាក្យសម្ងាត់:*</label>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="flex justify-center pb-8">
                <button
                  type="submit"
                  className="text-white font-NotoSansKhmer text-xl bg-blue-700 hover:bg-blue-800 font-medium w-1/2  px-5 py-2.5"
                >
                  ចូលប្រើប្រាស់
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <div
          className="h-screen bg-cover bg-gray-950 bg-center sm:block hidden"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="h-screen mx-auto grid items-center ">
            <div className="">
              <div className="text-center">
                <h1 className="p-6 text-8xl text-white font-bold uppercase">ហាងលក់</h1>
                <h1 className="p-6 text-8xl text-white font-bold uppercase"> ទំនិញចែប៊ីម៉ាត</h1>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;
