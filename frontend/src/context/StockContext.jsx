import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
/*
1. 전체 주식 전역으로 가져오기
2. 관심 종목 주식 전역으로 가져오기
3. 로그아웃시 상태 reset하기
4. (주의) 관심종목 fetch해올 때 stock.stock_id로 주식 id에 접근
    관심종목 키에는 id(관심으로 등록된 주식 id), stock_id(종목 코드로 생각)
 */

const StockContext = createContext();

export function StockProvider({ children }) {
  const [stocks, setStocks] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://windmill-be-iqxx.onrender.com/stock");
        const data = await res.json();
        console.log(data.data);
        setStocks(data.data);
      } catch (err) {
        console.error("Failed to fetch stocks: ", err);
      } finally {
        setStocksLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return (
    <StockContext.Provider
      value={{
        stocks,
        setStocks,
        stocksLoading,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStocks() {
  const context = useContext(StockContext);
  if (!context)
    throw new Error("useStocks must be used within a StockProvider");
  return context;
}
