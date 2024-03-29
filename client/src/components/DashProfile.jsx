import { useSelector } from 'react-redux'
import { Button, TextInput, Alert} from 'flowbite-react'
import { useState, useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {app} from '../firebase'
export default function DashProfile() {
  const {currentUser} = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  console.log(imageFileUploadProgress, imageFileUploadError);
  const filePickerRef = useRef()
  const handleImageChange  = (e)=>{
    const file = e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file))
    }

  };
  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async ()=>{
    // service firebase storege
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches("image/.*")
    //     }
    //   }
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new  Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0))
      },
      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB) ');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>{
          setImageFileUrl(downloadUrl);
        });
      }
    );
  };
  return (
    <div className=' max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-y text-center font-semibold text-3xl'>Profile</h1>
      <input type="file" accept='image/*' name="" id="" onChange={handleImageChange} ref={filePickerRef}/>
      <form className='flex flex-col gap-4'>
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>
        filePickerRef.current.click()
        }>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
            strokeWidth={5} 
            styles={{
              root:{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top : 0,
                left: 0,
              },
              path : {
                stroke: `rgb(62, 152, 199, ${imageFileUploadProgress/100})`
              }
            }}/>
          )}
         <img src={imageFileUrl || currentUser.profilePicture} alt="user"  className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}/>
        </div>
        {imageFileUploadError && (

        <Alert color='failure'>{imageFileUploadError }</Alert>
        )}
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='Password' defaultValue='***********'/>
        <Button type='submit' gradientDuoTone='purpleToBlue'>Update</Button>
      </form>
      <div className=" text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
