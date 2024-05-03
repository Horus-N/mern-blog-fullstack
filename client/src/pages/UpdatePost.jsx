import { Button, FileInput, Select, TextInput,Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import * as request from '../service/axios'
import {useSelector} from 'react-redux'
import {useNavigate,useParams} from 'react-router-dom'

function UpdatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null);
  const {currentUser} = useSelector((state)=>state.user);
  const {postId}= useParams();
  console.log(formData);
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image! ");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({...formData,image:downloadURL});
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed! ');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const res = await request.put(`http://localhost:5000/api/post/updatepost/${formData._id}/${currentUser._id}`,formData,currentUser.token);
      console.log(res);
      console.log(res?.data?.success);
      if(res?.data?.success===false){
        setPublishError(res.data.message);
        return
      }
      if(res.success===true){
        console.log('hello');
        setPublishError(null);
        navigate(`/post/${res.updatedPost.slug}`)
      }
      
    } catch (error) {
      setPublishError('Something went wrong !')
    }
  }

  useEffect(()=>{
    try {
        const fetchPost = async()=>{
            const res = await request.get(`http://localhost:5000/api/post/getposts?postId=${postId}`);
            if(res.success){
                setFormData(res.posts[0]);
                setPublishError(null)
            }else{
                console.log(res);
                setPublishError(res)
            }
        }
        fetchPost();
    } catch (error) {
        console.log(error);
    }
  },[postId])
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e)=>setFormData({...formData,title:e.target.value})}
          />
          <Select
          onChange={(e)=>setFormData({...formData,category:e.target.value})}
          value={formData.category}
          >
            <option value={"uncategorized"}>Select a category</option>
            <option value={"javascript"}>javascript</option>
            <option value={"reactjs"}>React.js</option>
            <option value={"nextjs"}>Next.js</option>
          </Select>
        </div>

        <div
          className="flex gap-4
         items-center justify-between border-4 border-teal-500 border-dotted p-3"
        >
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size={"sm"}
            outline
            onClick={handleUpdloadImage}
            disabled= {imageUploadProgress}
          >
            {
              imageUploadProgress ? 
              (<div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress|| 0}%`}/>
              </div> ): (
                'Upload image'
              )
            }
          </Button>
        </div>
            {imageUploadError && <Alert color = 'failure'>{imageUploadError}</Alert>}
            {
              formData .image && (
                <img
                src={formData.image}
                alt="upload"
                className="w-full h-72 object-cover"
                />
              )
            }

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          value={formData.content}
          className="h-72 mb-12"
          onChange={(value)=>setFormData({...formData,content:value})}
          required
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Update Post
        </Button>

        {
          publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>
        }
      </form>
    </div>
  );
}

export default UpdatePost;
