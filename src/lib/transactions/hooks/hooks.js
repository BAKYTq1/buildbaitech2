'use client'; 
import { useQuery } from "@tanstack/react-query";
import { Transactions } from "../api/api";

export const useTransactions = () => {  
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => Transactions.gettransactions(),
  });
};
export const useTransactionById = (id) => {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => Transactions.gettransactionbyid(id),
    enabled: !!id,
  });
};