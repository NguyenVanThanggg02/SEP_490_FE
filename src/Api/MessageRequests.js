import axios from "axios";
import { Constants } from "../utils/constants";

const API = axios.create({ baseURL: `${Constants.apiHost}` });

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post("/message/", data);
