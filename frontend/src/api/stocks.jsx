export const fetchAllStocks = async () => {
  const res = await fetch("https://windmill-be-iqxx.onrender.com/stock");
  if (!res.ok) throw new Error("전체 주식 조회 실패");
  const data = await res.json();
  return data.data;
};
