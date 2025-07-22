import { useState } from "react";
import { useStocks } from "../context/StockContext";

function AddStockModal({ onClose, onSubmit }) {
  const { stocks } = useStocks();

  const [symbol, setSymbol] = useState("");
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async () => {
    onSubmit({
      id: selected?.id,
      date,
      quantity: parseFloat(qty),
      purchasePrice: parseFloat(price),
    });
    onClose();
  };

  const matchingStocks = stocks.filter(
    (s) =>
      s.name.toLowerCase().startsWith(symbol.toLowerCase()) ||
      s.ticker.toLowerCase().startsWith(symbol.toLowerCase())
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-500 rounded-lg p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">포지션 추가</h2>

        <input
          placeholder="AAPL 등 검색"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border px-3 py-1 w-full mb-2"
        />

        {symbol && matchingStocks.length > 0 && (
          <ul className="border h-24 overflow-y-auto mb-4">
            {matchingStocks.map((stock) => (
              <li
                key={stock.name}
                className="px-2 py-1 cursor-pointer hover:bg-green-100 text-red-300"
                onClick={() => {
                  setSelected(stock);
                  setSymbol(stock.name);
                }}
              >
                {stock.name} ({stock.ticker})
              </li>
            ))}
          </ul>
        )}

        {selected && (
          <>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-3 py-1 w-full mb-2"
            />
            <input
              type="number"
              placeholder="수량"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="border px-3 py-1 w-full mb-2"
            />
            <input
              type="number"
              placeholder="가격"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border px-3 py-1 w-full mb-2"
            />
          </>
        )}

        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!selected || !date || !qty || !price}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStockModal;
