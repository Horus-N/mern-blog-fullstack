import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { FaStepForward } from "react-icons/fa";
import * as request from '../service/axios'
export default function SignUp() {
  const [formData,setFormData] = useState({})
  const [errorMessage,setErrorMessage] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = e=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email||!formData.password){
      return setErrorMessage('Tất cả các trường không được để trống!');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res=await request.post('http://localhost:5000/api/auth/signup',formData);
      setLoading(false);
      if(res.success===false){
        return setErrorMessage(res.message)
      }
      navigate('/sign-in');
     
    } catch (error) {
      setErrorMessage(error.message)
    }

    
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span
              className="px-2 py-1 bg-gradient-to-r from-indigo-500
       via-purple-500 to-pink-500 rounded-lg text-white"
            >
              Sahand's
            </span>
            Blog
          </Link>

          <p className="text-sm mt-5">
            Bạn có thể đăng ký bằng email và mật khẩu hoặc với Google.
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form  onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="">
              <Label value="Your username"></Label>
              <TextInput
                type="text"
                placeholder="Username"
                id="username" onChange={handleChange}
              ></TextInput>
            </div>
            <div className="">
              <Label value="Your emai"></Label>
              <TextInput
                type="text"
                placeholder="name@company.com"
                id="email" onChange={handleChange}
              ></TextInput>
            </div>
            <div className="">
              <Label value="Your password"></Label>
              <TextInput
                type="text"
                placeholder="Password"
                id="password" onChange={handleChange}
              ></TextInput>
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {
                loading?(
                  <>
                  <Spinner size='sm'>
                    <span className="pl-3">Loading...</span>
                  </Spinner>
                  </>
                ):'Sign Up'
              }
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Hav an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>

          {
            errorMessage &&(
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  );
}
