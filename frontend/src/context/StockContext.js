import { createContext, useContext, useEffect, useState } from "react";
import { json } from "react-router-dom";
import { useAuth } from "./AuthContext";

const StockContext = createContext();

export function StockProvider({ children }) {
  const { token } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [interestList, setInterestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const resetStocks = () => {
    setInterestList([]);
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("https://windmill-be-iqxx.onrender.com/stock");
        const data = await res.json();
        setStocks(data.data);
      } catch (err) {
        console.error("Failed to fetch stocks: ", err);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchInterest = async () => {
      if (!token) {
        setInterestList([]);
        setIsLoading(false);
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
        const ids = data.data.map((stock) => stock.stock_id);
        setInterestList(ids);
      } catch (err) {
        console.error("Failed to fetch interest stocks: ", err);
      } finally {
        setIsLoading(false);
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
