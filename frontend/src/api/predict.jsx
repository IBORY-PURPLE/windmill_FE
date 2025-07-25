export async function predictStock({ stockId, selectedKeys, period }) {
  const body = {
    stock_id: stockId,
    start: selectedKeys.includes("openingPrice"),
    high: selectedKeys.includes("highPrice"),
    low: selectedKeys.includes("lowPrice"),
    volume: selectedKeys.includes("volume"),
    fixed_rate: selectedKeys.includes("interestRate"),
    period: parseInt(period),
  };

  const res = await fetch(
    `https://windmill-be-iqxx.onrender.com/predict/${stockId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error("예측에 실패했습니다.");
  }

  return await res.json();
}
