import React, { useState } from 'react'
import { FaUpload } from 'react-icons/fa'
import { PuffLoader } from 'react-spinners'

const CreateTemplate = () => {

  const [formData, setFormData] = useState({
    title:"",
    imageURL: null,
  })

  const [imageAsset, setImageAsset] = useState({
    isImageLoading:false,
    uri:null,
    progress:0

  })

  const handleInputChange = (e) => {
    const {name , value} = e.target;
    setFormData((prevRecord) => ({...prevRecord , [name] : value}));


  }

  /* handling image file changes */
  const handleFileChanges =async () => {
    const file = e.target.files[0];
    console.log(file);

  }
  
  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'> 

      {/* left container */}
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 bg-blue-200 w-full flex-1 flex  items-center justify-start flex-col gap-4 px-2'>

          <div className='w-full'>
            <p className='text-lg text-txtPrimary'>Create a new template</p>
          </div>

          {/* template id section */}
          <div className='w-full flex items-center justify-end'> 
            <p className='text-base text-txtLight uppercase font-semibold'>TEMPID:{""}</p>
            <p className='text-sm  capitalize text-txtDark font-bold'>Template1</p>
          </div>


          {/* template title section */}
          <input type="text" className='w-full px-2 py-3 bg-transparent border border-gray-300 text-lg text-txtPrimary focus-within:text-txtDark focus:shadow-md col-span-12  outline-none' name='title' placeholder='Template Title' value={formData.title} onChange={handleInputChange}/>


           {/* file upload section */}
            <div className='w-full bg-green-300 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-dotted flex items-center justify-center cursor-pointer '> 
                {imageAsset.isImageLoading ? 
                <React.Fragment>
                  <div className='flex flex-col items-center justify-center gap-4'>
                      <PuffLoader color='#498FCD' size={40}/>
                      <p>{imageAsset.progress.toFixed(2)}%</p>
                  </div>
 
                </React.Fragment> 
                
                :
                
                <React.Fragment>
                    {!imageAsset?.uri ? 
                    <React.Fragment>
                      <label htmlFor="" className='w-full cursor-pointer h-full'>
                        <div className='flex flex-col items-center justify-center h-full w-full'>
                          <div className='flex items-center justify-center cursor-pointer flex-col'>
                            <FaUpload/>
                            <p>Click to upload</p>
                          </div>
                        </div>



                        <input type="file" className='w-0 h-0' accept='.jpeg ,.jpg ,.png' onChange={handleFileChanges} />
                      </label>

                      
                    </React.Fragment> 

                    : 
                    <React.Fragment></React.Fragment>
                    }
                </React.Fragment>
                }
            </div>

     

      </div>

      {/* right container */}
      <div className=' lg:col-span-8 2xl:col-span-9 bg-red-300'>2</div>
    </div>
  )
}

export default CreateTemplate