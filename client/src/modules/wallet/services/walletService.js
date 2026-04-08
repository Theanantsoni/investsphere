import axios from "axios";

const API = "http://localhost:5000/api/wallet";

export const getWallet = async (email) => {
  const res = await axios.get(`${API}?email=${email}`);
  return res.data.wallet;
};

export const addMoney = async (data) => {
  const res = await axios.post(`${API}/add`, data);
  return res.data.wallet;
};

export const withdrawMoney = async (data) => {
  const res = await axios.post(`${API}/withdraw`, data);
  return res.data.wallet;
};

export const transferMoney = async (data) => {
  const res = await axios.post(`${API}/transfer`, data);
  return res.data.wallet;
};