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
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response
  }
};
