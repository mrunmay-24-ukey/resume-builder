import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa'
import { PuffLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { storage } from '../config/firebase.config'
import { intialTags } from '../utils/helpers'

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
  const handleFileChanges =async (e) => {
    setImageAsset((prevAsset) => ({...prevAsset , isImageLoading:true}))
    const file = e.target.files[0];

    if(file && isAllowed(file)){
      const storageRef = ref(storage , `Templates/${Date.now()}-${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef , file);
      
      uploadTask.on('state_changed' ,
       (snapshot) => {
        setImageAsset(prevAsset => ({
          ...prevAsset ,
           progress : (snapshot.bytesTransferred / snapshot.totalBytes) * 100 , 
           }))
       } ,


        (error) => {
          if(error.message.includes('storage/unauthorized')){
            toast.error(`Error : Authorization required`);
          }
          else{
            toast.error(`Error : ${error.message}`)
          }
        } , 

       () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setImageAsset((prevAsset) => ({
            ...prevAsset , 
            uri : downloadURL
          }))
        })

        toast.success("Image uploaded");
        setInterval(() => {
          setImageAsset((prevAsset) => ({
            ...prevAsset , 
            isImageLoading: false,
          }))
        } , 2000)
       }


    )}
    else{
      toast.info("invalid file format")
    } 

  
  }

  const isAllowed = (file) => {
    const allowedTypes = ['image/jpeg' , 'image/jpg' , 'image.png'];
    return allowedTypes.includes(file.type);
  }
  
  /* delete template */
  const deleteImageObject = async () => {

    setInterval(() => {
          setImageAsset((prevAsset) => ({
            ...prevAsset , 
            progress : 0,
            uri : null,
            
          }))
        } , 2000)
     
    const deleteRef = ref(storage , imageAsset.uri);
    deleteObject(deleteRef).then(() => {


      toast.success("Image removed");
        


    })
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
            <div className='w-full bg-green-300 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[400px] rounded-md border-dotted flex items-center justify-center cursor-pointer '> 
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
                        <div className='flex flex-col items-center justify-center h-full w-full realtive'>
                          <div className='flex items-center justify-center cursor-pointer flex-col'>
                            <FaUpload/>
                            <p>Click to upload</p>
                          </div>
                          
                          <input type="file" className=' w-2 absolute' accept='.jpeg ,.jpg ,.png' onChange={handleFileChanges} />

                        </div>

                      </label>

                      
                    </React.Fragment> 

                    : 
                    <React.Fragment>

                      <div className='relative w-full h-full overflow-hidden rounded-md'>
                          <img src={imageAsset?.uri} className='w-full h-full object-cover' loading='lazy' alt="" />
                      </div>

                      {/* delete action */}
                      <div className='absolute top-4 right-4 w-8 h-8 flex justify-center items-center rounded-md bg-red-500 cursor-pointer' onClick={deleteImageObject}>
                          <FaTrash className='text-sm text-white '/>
                      </div>

                    </React.Fragment>
                    }
                </React.Fragment>
                }
            </div>



            {/* tags */}

            <div className='w-full flex items-center flex-wrap gap-2'>
                
                {intialTags.map((tag , i) => {
                  <div key={i}> {/* supplying key to prevent from warning issues */}
                      <p>{tag}</p>
                  </div>
                } )}

            </div>
      </div>

      {/* right container */}
      <div className=' lg:col-span-8 2xl:col-span-9 bg-red-300'>2</div>
    </div>
  )
}

export default CreateTemplate