// src/api/mystock.js
import { getAuthToken } from "../util/auth";

export const fetchMyStocks = async () => {
  const token = getAuthToken();
  const res = await fetch(
    "https://windmill-be-iqxx.onrender.com/user/mystock",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) throw new Error("보유 종목 조회 실패");
  const data = await res.json();
  return data.data;
};

export const addMyStock = async (stockData) => {
  const token = getAuthToken();
  const res = await fetch(
    `https://windmill-be-iqxx.onrender.com/user/mystock/${stockData.id}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buy_cost: stockData.purchasePrice,
        buy_stock_count: stockData.quantity,
        date: stockData.date,
      }),
    }
  );

  if (!res.ok) throw new Error("포지션 추가 실패");
  return res.json();
};
