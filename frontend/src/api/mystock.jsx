// src/api/mystock.js
import { getAuthToken } from "../util/auth";
import { API_BASE } from "../apiBase";

export const fetchMyStocks = async () => {
  const token = getAuthToken();
  const res = await fetch(`https://${API_BASE}/user/mystock`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) throw new Error("보유 주식 정보를 불러오는데 실패했습니다.");
  const data = await res.json();
  return data.data;
};

export const addMyStock = async (stockData) => {
  const token = getAuthToken();
  const res = await fetch(`https://${API_BASE}/user/mystock/${stockData.id}`, {
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
  });

  if (!res.ok) throw new Error("포지션 추가 실패");
  const data = await res.json();
  return data;
};

export const fetchMyStockLogs = async (stockId) => {
  const token = getAuthToken();
  const res = await fetch(`https://${API_BASE}/user/mystock/${stockId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) throw new Error("거래 로그 조회 실패했습니다.");
  const data = await res.json();
  return data.data; // 배열 형태로 로그가 올 것으로 예상
};
