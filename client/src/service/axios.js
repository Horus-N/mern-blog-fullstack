import axios from "axios";

const request = axios.create({
  baseURL: process.env.BASE_URL,
});

export const get = async (url) => {
  try {
    const res = await request.get(url);
    return res.data;
  } catch (error) {
    return error.response
  }
 
};

export const getUsers = async (url, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.get(url, config);
    return res.data;
  } catch (error) {
    return error.response
  }
};



export const post = async (url, data, option) => {
    try {
        
        const res = await request.post(url, data, option);
        return res.data;
    } catch (error) {
        return error.data
    }
};

export const put = async (url, data, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.put(url, data, config);
    return res.data;
  } catch (error) {
    return error.response
  }
};

export const deletePost = async (url,token) => {
  console.log(token);
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.delete(url,config);
    return res.data;
  } catch (error) {
    return error.response
  }
};

export const deleteUser = async (url, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.delete(url, config);
    return res.data;
  } catch (error) {
    return error.response
  }
};



export const signout = async (url, token) => {
  console.log(token);
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.post(url,null,config);
    return res.data;
  } catch (error) {
    return error.response
  }
};


export const createPost = async (url, data, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.post(url, data, config);
    return res.data;
  } catch (error) {
    return error.response
  }
};