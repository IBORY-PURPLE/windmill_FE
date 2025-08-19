import { API_BASE } from "../apiBase";

export const fetchAllStocks = async () => {
  const res = await fetch(`https://${API_BASE}/stock`);
  if (!res.ok) throw new Error("전체 주식 조회 실패");
  const data = await res.json();
  return data.data;
};
