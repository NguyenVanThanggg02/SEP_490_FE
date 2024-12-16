import axios from "axios";
import { Constants } from "../utils/constants";

const API = axios.create({ baseURL: `${Constants.apiHost}` });

export const createChat = (data) => API.post("/chat/", data);

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) =>
  API.get(`/chat/find/${firstId}/${secondId}`);
