import axios from "axios";
import { API_BASE_URL } from "./constant"


export const loginAPI = async (body)=>{
    const url = API_BASE_URL + '/api/auth/login';
    try{
        const response = await axios(url,{
            method:"POST",
            data:body
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}

export const registerAPI = async (body)=>{
    const url = API_BASE_URL + '/api/auth/register';
    try{
        const response = await axios(url,{
            method:"POST",
            data:body
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}

export const verifyOtpRAPI = async (body)=>{
    const url = API_BASE_URL + '/api/auth/verifyOtp-register';
    try{
        const response = await axios(url,{
            method:"POST",
            data:body
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}

export const forgotPasswordAPI = async (body)=>{
    const url = API_BASE_URL + '/api/auth/forgot-password';
    try{
        const response = await axios(url,{
            method:"POST",
            data:body
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}

export const resetPasswordAPI = async ({email, newPassword})=>{
    const url = API_BASE_URL + '/api/auth/reset-password';
    try{
        const response = await axios(url,{
            method:"POST",
            data:{email, newPassword}
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}

export const verifyOtpFPAPI = async ({ email, otp }) => {
  const url = API_BASE_URL + '/api/auth/verifyOtp-forgotPassword';
  try {
    const response = await axios.post(url, { email, otp });
    return response?.data;
  } catch (err) {
    throw new Error(err);
  }
}


export const resendOtpAPI = async ({email})=>{
    const url = API_BASE_URL + '/api/auth/resend-otp';
    try{
        const response = await axios(url,{
            method:"POST",
            data:{email}
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}