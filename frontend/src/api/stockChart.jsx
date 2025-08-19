import { API_BASE } from "../apiBase";

export async function fetchStockChart({ stockId, days }) {
  const res = await fetch(`https://${API_BASE}/stock/${stockId}/${days}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("차트 데이터를 불러오지 못했습니다.");
  const data = await res.json();

  return data.data;
}
