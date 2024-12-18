import axios from "axios";
import { Constants } from "../utils/constants";

const API = axios.create({ baseURL: `${Constants.apiHost}` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
  }

  return req;
});

export const getUser = (userId) => API.get(`/users/${userId}`);
export const updateUser = (id, formData) => API.put(`/user/${id}`, formData);
export const getAllUser = () => API.get("/user");
export const followUser = (id, data) => API.put(`/user/${id}/follow`, data);
export const unfollowUser = (id, data) =>
  API.put(`/users/${id}/unfollow`, data);
