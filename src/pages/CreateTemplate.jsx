import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa'
import { PuffLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { db, storage } from '../config/firebase.config'
import { adminIds, intialTags } from '../utils/helpers'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import useTemplates from '../hooks/useTemplates'
import { useNavigate } from 'react-router-dom'

const CreateTemplate = () => {

  /* states */

  const [formData, setFormData] = useState({
    title:"",
    imageURL: null,
  })

  const [imageAsset, setImageAsset] = useState({
    isImageLoading:false,
    uri:null,
    progress:0

  })

  //*states for selecting tags
  const [selectedTags, setSelectedTags] = useState([]);

  //* states using react query for getting how many templates are there in your cloud
  const {data : templates , isError : templatesIsError , isLoading : templatesIsLoading , refetch : templatesRefetch} = useTemplates();

  const {data : user , isLoading} = useUser();



  const navigate = useNavigate();






  /*  functions  */

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


  const handleSelectTags = (tag) => {
    // check if the tag is selected or not
    if(selectedTags.includes(tag)){
      // if selected hai to selected se remove kar do
      setSelectedTags(selectedTags.filter((selected) => selected !== tag)) // return every tag except the selected one 


    }

    else{
      // we have to push that into the selected tags
      setSelectedTags([...selectedTags , tag])
    }
  }


  const pushToCloud =async () => {
    const timestamp = serverTimestamp(); // firebase function
    const id = `${Date.now()}`;
    const _doc = {
      _id:id,
      title:formData.title,
      imageURL : imageAsset.uri,
      tags: selectedTags,
      name: templates && templates.length > 0 ? `Template${templates.length+1}` : 
      'Template1'
    ,
      timestamp:timestamp,
    }

    /* console.log(_doc); */

    // now push this data into the cloud 
    await setDoc(doc(db , 'templates'/* give same name which you are fetching from the api  */ , id ) , _doc).then(() => {
      setFormData((prevData) => ({...prevData , title : "" , imageURL : "" , }));
      setImageAsset((prevAsset) => ({...prevAsset , uri : null}));
      setSelectedTags([]);
      templatesRefetch();
      toast.success("Data pushed to cloud");

    }).catch(error => {
      toast.error(`Error : ${error.message}`);
    })

  }

  // function to remove the data from the cloud
  const deleteTemplate = async (template) => {
    const deleteRef = ref(storage , template?.imageURL);
    await deleteObject(deleteRef)
    .then(async () => {
      await deleteDoc(doc(db , "templates" , template?._id))
      .then(() => {
        toast.success("Template Deleted successfully");
        templatesRefetch();

      })
      .catch((err) => {
        console.log(err);
        toast.error(`Error : ${err.message}`);

      })
    })
  }


  useEffect(() => {
    if(!isLoading && !adminIds.includes(user?.uid)){
      navigate( '/' , {replace  :true});
    }
  } , [user , isLoading])


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
            <p className='text-sm  capitalize text-txtDark font-bold'>
            {templates && templates.length > 0 ? `Template${templates.length+1}` : 
              'Template1'
            }
            </p>
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

            <div className='w-full flex items-center flex-wrap gap-2 '>
                
                {intialTags.map((tag , i) => (
                  <div key={i} onClick={() => handleSelectTags(tag)}
                    className={`border border-gray-300 px-2 py-2 cursor-pointer rounded-md ${selectedTags.includes(tag) ? "bg-blue-500 text-white " : ""}`}
                  > {/* supplying key to prevent from warning issues */}
                      <p className='text-xs'>{tag}</p>
                  </div>
                ))}

            </div>

            {/* button action */}
            <button type='button' className='w-full bg-blue-700  text-white rounded-md py-3 ' 
              onClick={pushToCloud}
            >
                Save
            </button>

      </div>

      {/* right container */}
      <div className='col-span-12 lg:col-span-8 2xl:col-span-9 bg-red-300 px-2 py-4 w-full flex-1 '>
        {
          templatesIsLoading ? 
          (
            <React.Fragment>
              <div className='w-full h-full flex items-center justify-center'>
                <PuffLoader color='#498FCD' size={40}/>
              </div>
            </React.Fragment>
          )
           :

            (
            <React.Fragment>
                {
                  templates && templates.length > 0 ? 
                  (
                    <React.Fragment>
                      {
                        <div className='w-full h-full grid grid-colS-1 lg:grid-cols-2 2xl:grid-cols-3  gap-4'>
                          {
                            templates?.map( (template) => (
                          <div key={template._id} className='w-full h-[500px] rounded-md overflow-hidden realtive'>
                            <img src={template?.imageURL} alt="" className='w-full h-full object-cover ' />

                              {/* delete action */}
                              <div className='absolute top-[136px] w-8 h-8 flex justify-center items-center rounded-md bg-red-500 cursor-pointer' onClick={() => deleteTemplate(template)}>
                                  <FaTrash className='text-sm text-white '/>
                             </div>
                          </div>
                          ))
                          }

                        </div>
                      }
                    </React.Fragment>
                  ) 
                  :
                  (
                    <React.Fragment>
                        <div className='w-full h-full flex items-center justify-center'>
                          <PuffLoader color='#498FCD' size={40}/>
                          <p className='text-xl tracking-wider capitalize text-txtPrimary'>No data</p>
                        </div>

                    </React.Fragment>
                  )
                }
            </React.Fragment>
            )
          
        }
      </div>
    </div>
  )
}

export default CreateTemplate