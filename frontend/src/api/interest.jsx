// src/api/interest.js
import { getAuthToken } from "../util/auth";

export const fetchInterestStocks = async () => {
  const token = getAuthToken();
  const res = await fetch(
    "https://windmill-be-iqxx.onrender.com/user/interest",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) throw new Error("관심 종목 정보를 불러오는 데 실패했습니다.");

  const data = await res.json();
  return data.data.map((stock) => stock.stock_id); // stock_id 배열만 반환 수정요구
};

export const toggleInterestStock = async (stockId, isAlreadyInterested) => {
  const token = getAuthToken();
  const method = isAlreadyInterested ? "DELETE" : "POST";
  const res = await fetch(
    `https://windmill-be-iqxx.onrender.com/user/interest/${stockId}`,
    {
      method,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!res.ok) throw new Error("관심 종목 토글 실패");
  return res.json(); // 성공 응답
};
