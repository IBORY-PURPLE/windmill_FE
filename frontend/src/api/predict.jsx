export async function predictStock({ stockId, selectedKeys, period }) {
  const body = {
    stock_id: stockId,
    start: selectedKeys.includes("openingPrice"),
    high: selectedKeys.includes("highPrice"),
    low: selectedKeys.includes("lowPrice"),
    volume: selectedKeys.includes("volume"),
    fixed_rate: selectedKeys.includes("interestRate"),
    per: selectedKeys.includes("per"),
    pbr: selectedKeys.includes("pbr"),
    psr: selectedKeys.includes("psr"),
    snp: selectedKeys.includes("snp"),
    roe: selectedKeys.includes("roe"),
    roa: selectedKeys.includes("roa"),
    opm: selectedKeys.includes("opm"),
    npm: selectedKeys.includes("npm"),
    period: parseInt(period),
  };
  console.log(JSON.stringify(body));

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
  console.log(body);

  return await res.json();
}
