import React from 'react'
import { PuffLoader } from 'react-spinners'

const Spinner = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <PuffLoader color='#498fCD' size={80}/>
    </div>
  )
}

export default Spinner