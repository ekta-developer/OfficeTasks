import axios from "axios";
import { createHeaders, createHeaderWithoutToken } from "../utils";
import { BASE_URL } from "../constants/Constant";

//verify mobile API
export const loginAPI = async (data, config) => {
  const headers = createHeaderWithoutToken();
  return await axios.post(`${BASE_URL}login`, data, headers);
};
export const ddEmployeeAPI = async (data, config) => {
  const headers = createHeaders();
  return await axios.post(`${BASE_URL}get-emp-list`, data, headers);
};