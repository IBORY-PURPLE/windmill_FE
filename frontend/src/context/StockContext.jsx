import { createContext, useContext, useEffect, useState } from "react";
import { json } from "react-router-dom";
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
  const { token } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [interestList, setInterestList] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [interestLoading, setInterestLoading] = useState(true);
  const [isInterestFetched, setIsInterestFetched] = useState(false);

  const isLoading = stocksLoading || interestLoading;

  const resetStocks = () => {
    setInterestList([]);
    setIsInterestFetched(false);
  };

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

  useEffect(() => {
    const fetchInterest = async () => {
      if (!token) {
        setInterestList([]);
        setInterestLoading(false);
        return;
      }
      try {
        const res = await fetch(
          "https://windmill-be-iqxx.onrender.com/user/interest",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await res.json();
        console.log(data);
        const ids = data.data.map((stock) => stock.stock_id);
        setInterestList(ids);
      } catch (err) {
        console.error("Failed to fetch interest stocks: ", err);
      } finally {
        setInterestLoading(false);
        setIsInterestFetched(true);
      }
    };
    fetchInterest();
  }, [token]);

  const toggleInterest = async (stockId) => {
    const isAlreadyInterested = interestList.includes(stockId);
    try {
      const res = await fetch(
        `https://windmill-be-iqxx.onrender.com/user/interest/${stockId}`,
        {
          method: isAlreadyInterested ? "DELETE" : "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!res.ok) {
        throw json({ message: "failed" }, { status: 500 });
      }

      setInterestList((prev) =>
        isAlreadyInterested
          ? prev.filter((id) => id !== stockId)
          : [...prev, stockId]
      );
    } catch (err) {
      console.error("관심 종목 토글 실패: ", err);
    }
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        setStocks,
        interestList,
        toggleInterest,
        resetStocks,
        isLoading,
        isInterestFetched,
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
