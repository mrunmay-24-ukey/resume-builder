import React, { useEffect } from 'react'
import {Logo} from '../assets/index'
import AuthButtonWithProvider from '../components/AuthButtonWithProvider'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import useUser from '../hooks/useUser'
import Spinner from '../components/Spinner'

const Authentication = () => {

  // toast
  const notify = () => toast("Wow so easy!");


  const {data , isLoading  , isError} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    
    if(!isLoading && data){ // if user is already logged in then we have to navigate the user on home page
      navigate('/' , {replace: true});
    }
  }, [isLoading , data])

  if(isLoading){
    return <Spinner/>;
  }
  

  return (
    <div className='auth-section'>
        {/* top section */}
        <img src={Logo} className='w-12 h-auto object-contain' />

        {/* main section */}
        <div className='w-full flex flex-1 flex-col items-center justify-center gap-6 '>

          <h1 className='text-3xl lg:text-4xl text-blue-700'>Welcome to Expressresume</h1>
          <p className='text-base text-gray-600'>elevate your resume building to the next level</p>
          <h2 className='text-2xl text-gray-600'>Authenticate</h2>

          <div className='flex w-full lg:w-96 rounded-md p-2 items-center justify-start flex-col'>
            <AuthButtonWithProvider Icon={FaGoogle} label={'SignIn with Google'} provider={'GoogleAuthProvider'}/>
            <AuthButtonWithProvider Icon={FaGithub} label={'Signin with Github'} provider={'GithubAuthProvider'}/>
          </div>


          

        </div>

        
        
    </div> 
  )
}

export default Authentication