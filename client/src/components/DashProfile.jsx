import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useState, useRef } from "react";
import {
  getDownloadURL,
  ref,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import * as request from "../service/axios";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading,setImageFileUploading] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess,setUpdateUserSuccess] = useState(null)
  const [updateUserError,setUpdateUserError] = useState(null);
  const ditpatch = useDispatch();
  console.log(currentUser);

  console.log(formData);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageFileUrl);
    };
  }, [imageFileUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write:if
    //         request.resource.size<2*1024*1024&&
    //         request.resource.contentType.matches('image/.*')
    //       }
    //     }
    //   }
    setImageFileUploading(true)
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log(error);
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleOnchange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('NO changes make');
      return;
    }
    if(imageFileUploading){
      setUpdateUserError('please wait for image to upload');
      return;
    }
    try {
      ditpatch(updateStart());
      const res = await request.put(
        `http://localhost:5000/api/user/update/${currentUser._id}`,
        formData,
        currentUser.token
      );
      if (res.status === 401) {
        ditpatch(updateFailure(res.data.message)); 
        setUpdateUserError(res.data.message);
      }else{
        ditpatch(updateSuccess({...res.message.user,token:res.message.token,refreshToken:res.message.refreshToken}));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      ditpatch(updateFailure(error.message));
      setUpdateUserError(error.message);

    }
  };
  return (
    <div className="max-w-lg max-auto mx-auto p-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form action="" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          name="file"
          id="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer
         shadow-md overflow-hidden rounded-full"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full 
            border-8 border-[lightgray] object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && <Alert color="failure">{}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleOnchange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleOnchange}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleOnchange}
        />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>

      {
        updateUserSuccess &&(
          <Alert color='success' className="mt-5">
            {updateUserSuccess}
          </Alert>
        )
      }

      {updateUserError &&(
          <Alert color='failure' className="mt-5">
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}

export default DashProfile;
