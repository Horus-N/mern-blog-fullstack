import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider,getAuth,signInWithPopup} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import * as request from '../service/axios'
import { useNavigate } from 'react-router-dom'
import { app } from './../firebase';

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app)
    const handleGoogleClick =async ()=>{
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({prompt:'select_account'});
      try {
        const resultsFromGoogle = await signInWithPopup(auth,provider);
        console.log(resultsFromGoogle);
        const res = await request.post('http://localhost:5000/api/auth/google',{
          name:resultsFromGoogle.user.displayName,
          email:resultsFromGoogle.user.email,
          googlePhotoUrl:resultsFromGoogle.user.photoURL
        })
console.log(res);
        if(res.success===true){
          dispatch(signInSuccess(res));
          navigate('/')
        }
      } catch (error) {
        console.log(error);
      }
    }
  return (
   <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
    <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
    continue with Google
   </Button>
  )
}

export default OAuth