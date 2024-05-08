import React, { useState } from 'react'
import useUser from '../hooks/useUser'
import { Link } from 'react-router-dom';
import { Logo } from '../assets';
import { AnimatePresence, motion } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import { HiLogout } from 'react-icons/hi';
import { auth } from '../config/firebase.config';
import { useQueryClient } from 'react-query';
import { adminIds } from '../utils/helpers';
import useFilters from '../hooks/useFilters';

const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);

  const queryClient = useQueryClient();

  const {data : filterData } = useFilters();


  const signOutUser = async () => {
    await auth.signOut().then(() => {
        queryClient.setQueriesData('user' , null);

    })
  }

  const handleSearchTerm = () => {
    queryClient.setQueryData("globalFilter" , {...queryClient.getQueryData("globalFilter") , searchTerm:e.target.value})
  }

  return (
    <div className='w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 z-50 bg-bgPrimary gap-12 sticky top-6'>

      {/* logo section */}
      <Link to={'/'}>
        <img src={Logo} alt="display" className='w-12 h-auto object-contain' />
      </Link>

      {/* search bar */}
      <div className='flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200'>
        <input type="text" placeholder='Search here..' className='flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none ' onChange={handleSearchTerm} value={filterData.searchTerm ? filterData.searchTerm : ""} />
      </div>

      {/* profile icon */}
      <AnimatePresence>
        {isLoading ?
          <PuffLoader color='#499FCD' size={40} /> :

          <React.Fragment>
            {data ? <motion.div className='relative' onClick={() => setIsMenu(!isMenu)}>
              {data?.profileURL ? <div className='w-12 h-12 rounded-md relative flex items-center justify-center'>
                <img className='w-full h-full rounded-md object-cover' src={data?.photoURL} referrerPolicy='no-referrer' alt="" />
              </div> : <div className='w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-400'>
                <p className='text-lg text-white'>{data?.email[0]}</p>
              </div>}

              {/* dropdown */}
              <AnimatePresence>
                {isMenu && 
                (<motion.div className='absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12' initial={{opacity:0}} animate={{opacity : 1}} exit={{opacity: 0}}>

                  {data?.profileURL ?

                    <div className='w-20 h-20 rounded-md relative flex flex-col items-center justify-center'>
                      <img className='w-full h-full rounded-md object-cover' src={data?.photoURL} referrerPolicy='no-referrer' alt="" />

                    </div> :

                    <div className='w-20 h-20 rounded-md relative flex items-center justify-center bg-blue-400'>
                      <p className='text-lg text-white'>{data?.email[0]}</p>
                    </div>}

                  {/* displayName */}
                  {data?.displayName && (<p className='text-lg'>{data?.displayName}</p>)}


                  {/* menus */}
                  <div className='w-full flex-col items-start flex gap-8 pt-6'>
                    <Link className='text-txtLight hover:text-txtDark text-base whitespace-nowrap' to={'/profile'}>My Profile</Link>

                    {
                      adminIds.includes(data?.uid) && (
                        <Link className='text-txtLight hover:text-txtDark text-base whitespace-nowrap' to={'/template/create'}>Add template</Link>
                      )
                    }


                    <div className='w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer' onClick={signOutUser}>
                      <p className='group-hover:text-txtDark text-txtLight'>Sign out</p>
                      <HiLogout className='group-hover:text-txtDark text-txtLight' />
                    </div>

                  </div>


                </motion.div>)}
              </AnimatePresence>

                    
            </motion.div> :

              <Link to={'/auth'}>
                <motion.button className='px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150' type='button`'>Login</motion.button>
              </Link>}

          </React.Fragment>}

      </AnimatePresence>

    </div>
  )
}

export default Header


