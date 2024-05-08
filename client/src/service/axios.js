import axios from "axios";
import { jwtDecode } from "jwt-decode";

const request = axios.create({
  baseURL: process.env.BASE_URL,
});

export const createRefresh = async (user, dispatch, signInSuccess) => {
  console.log(user);
  try {
    const date = new Date();
    const decodedToken = await jwtDecode(user?.token);
    if (decodedToken.exp < date.getTime() / 1000) {
      const res = await refresh(user?.refreshToken);
      dispatch(
        signInSuccess({
          ...res.user,
          token: res.token,
          refreshToken: res.refreshToken,
        })
      );
    }
    return;
  } catch (error) {
    return error.response;
  }
};

const refresh = async (token) => {
  try {
    const config = {
      headers: { Authorization: `bearer ${token}` },
    };
    const res = await request.post(
      "http://localhost:5000/api/auth/refresh-token",
      {},
      config
    );
    return res.data;
  } catch (error) {
    return error.response;
  }
};

export const get = async (url) => {
  try {
    const res = await request.get(url);
    return res.data;
  } catch (error) {
    return error.response;
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
    return error.response;
  }
};

export const post = async (url, data, option) => {
  try {
    const res = await request.post(url, data, option);
    return res.data;
  } catch (error) {
    return error.data;
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
    return error.response;
  }
};

export const createDelete = async (url, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.delete(url, config);
    return res.data;
  } catch (error) {
    return error.response;
  }
};

export const signout = async (url, token) => {
  console.log(token);
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.post(url, null, config);
    return res.data;
  } catch (error) {
    return error.response;
  }
};

export const createComment = async (url, data, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  try {
    const res = await request.post(url, data, config);
    return res.data;
  } catch (error) {
    return error.response;
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
    return error.response;
  }
};
