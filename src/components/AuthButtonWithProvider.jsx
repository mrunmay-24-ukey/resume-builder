import { GithubAuthProvider, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { auth } from '../config/firebase.config';


const AuthButtonWithProvider = ({Icon , label , provider}) => {
    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();
    

    const handleClick = async () => {
        switch(provider){
            case "GoogleAuthProvider":
                await signInWithRedirect(auth, googleAuthProvider).then((result) => {
                    console.log(result);

                }).catch(err => {
                    console.log(`Error : ${err.Message}`);
                })
                break;

            case "GithubAuthProvider":
                await signInWithRedirect(auth , githubAuthProvider).then((result) => {
                    console.log(result);
                }).catch(err => {
                    console.log(`Err : ${err.Message}`);
                })
                break;
            
            default:
                console.log("Inside the Google Auth");
                break;

        }
    }
    

  return (
    <div onClick={handleClick} className='w-full px-4 py-3 mb-6 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group active:scale-95 duration-150 hover:shadow-md hover:bg-blue-700'>
       <Icon className='text-txtPrimary text-xl group-hover:text-white'/>
       <p className='text-txtPrimary text-lg group-hover:text-white'>{label}</p>
       <FaChevronRight className='text-txtPrimary text-base group-hover:text-white '/>
    </div>
  )
}

export default AuthButtonWithProvider