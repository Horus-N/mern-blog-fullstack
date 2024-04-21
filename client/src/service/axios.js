import axios from 'axios'

const request = axios.create({
    baseURL: process.env.BASE_URL,
  });

export const get=async()=>{
    const res=await request.get();
}

export const post= async(url,data,option)=>{
    const res = await request.post(url,data,option);
    return res.data;
}

  