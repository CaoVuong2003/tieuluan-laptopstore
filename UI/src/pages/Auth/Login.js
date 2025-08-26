import React, { useCallback, useEffect, useState } from 'react'
import GoogleSignIn from '../../components/Buttons/GoogleSignIn'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/features/common'
import { loginAPI } from '../../api/authentication';
import { saveToken } from '../../utils/jwt-helper';
import { showCustomToast } from '../../components/Toaster/ShowCustomToast';
const Login = () => {
  const [values,setValues] =useState({
    userName:'',
    password:''
  });
  const [error,setError] =useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError("");
      dispatch(setLoading(true));

      loginAPI(values)
        .then((res) => {
          if (res?.token) {
            saveToken(res?.token);
            showCustomToast("Đăng nhập thành công! 🎉", "success"); // ✅ Gọi toast ở đây
            navigate("/"); // toast vẫn hiển thị dù đã chuyển trang
          } else {
            setError("Something went wrong!");
            showCustomToast("Đăng nhập thất bại! 🎉", "error");
          }
        })
        .catch((err) => {
          showCustomToast("Vui lòng kiểm tra lại thông tin đăng nhập!", "warning");
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    },
    [dispatch, navigate, values]
  );

  const handleOnChange = useCallback((e)=>{
    e.persist();
    setValues(values=>({
      ...values,
      [e.target.name]:e.target?.value,
    }))
  },[]);

  return (
    <div className='px-8 w-full'>

      <p className='text-3xl font-bold pb-4 pt-4'>Sign In</p>
      <GoogleSignIn/>
      <p className='text-gray-500 items-center text-center w-full py-2'>OR</p>
    
      <div className='pt-4'>
        <form onSubmit={onSubmit}>
          <input type="email" name='userName' value={values?.userName} onChange={handleOnChange} placeholder='Email address' className='h-[48px] w-full border p-2 border-gray-400' required/>
          <Link to={"/auth/forgot-password"} className='text-right w-full float-right underline pt-2 text-gray-500 hover:text-black text-sm' tabIndex={-1}>Forgot Password?</Link>
          <input type="password" name='password' value={values?.password} onChange={handleOnChange} placeholder='Password' className='h-[48px] mt-2 w-full border p-2 border-gray-400' required autoComplete='new-password'/>
          <button className='border w-full rounded-lg h-[48px] mb-4 bg-black text-white mt-4 hover:opacity-80'>Sign In</button>
        </form>
      </div>
      <Link to={"/auth/register"} className='underline text-gray-500 hover:text-black'>Don’t have an account? Sign up</Link>
    </div>
  )
}

export default Login