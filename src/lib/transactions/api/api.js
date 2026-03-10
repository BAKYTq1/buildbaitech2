import { $api } from "../../../../API/api";

export const Transactions = {
  gettransactions: async () => {
    const { data } = await $api.get('/ordering/transactions/');
    return data.results;
  },
  gettransactionbyid: async (id) => {
    const { data } = await $api.get(`/ordering/transactions/${id}`);
    return data;

  },
}