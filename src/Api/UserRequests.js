import axios from "axios";

// Create an instance of axios with a custom baseURL
const API = axios.create({ baseURL: "http://localhost:9999" });

// Add a request interceptor to include the Authorization header if a profile is stored
API.interceptors.request.use((request) => {
  const profile = localStorage.getItem("profile");
  if (profile) {
    const { token } = JSON.parse(profile);
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// API utility functions
export const getUser = async (userId) => await API.get(`/users/${userId}`);

export const updateUser = async (id, formData) =>
  await API.put(`/user/${id}`, formData);

export const getAllUser = async () => await API.get("/user");

export const followUser = async (id, data) =>
  await API.put(`/user/${id}/follow`, data);

export const unfollowUser = async (id, data) =>
  await API.put(`/users/${id}/unfollow`, data);
