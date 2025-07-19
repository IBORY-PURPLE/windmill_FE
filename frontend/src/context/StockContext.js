import { createContext, useContext, useEffect, useState } from "react";

const StockContext = createContext();

export function StockProvider({ children }) {
  const [stocks, setStocks] = useState([]);

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

  return (
    <StockContext.Provider value={{ stocks, setStocks }}>
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
