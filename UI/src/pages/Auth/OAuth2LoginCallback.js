import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken } from '../../utils/jwt-helper';
import { showCustomToast } from '../../components/Toaster/ShowCustomToast';

const OAuth2LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if(token){
      saveToken(token);
      showCustomToast("Đăng nhập Google thành công!", "success");
      navigate('/');
    }
    else{
      navigate('/auth/login')
      showCustomToast("Đăng nhập Google thất bại!", "error");
    }

  },[navigate])
  return (
    <div></div>
  )
}

export default OAuth2LoginCallback