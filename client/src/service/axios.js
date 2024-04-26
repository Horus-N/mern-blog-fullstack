import axios from "axios";

const request = axios.create({
  baseURL: process.env.BASE_URL,
});

export const get = async () => {
  const res = await request.get();
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

export const deleteUser = async (url, data=null, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.delete(url, data, config);
    return res.data;
  } catch (error) {
    return error.response
  }
};



export const signout = async (url, data=null, token) => {
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