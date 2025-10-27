import React, { createContext, useContext, useState } from "react";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // Ini yang jadi "trigger" buat update dashboard setiap ada transaksi baru
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    // toggle boolean biar useEffect di dashboard ke-trigger
    setRefreshFlag((prev) => !prev);
  };

  return (
    <TransactionContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook biar mudah dipakai
export const useTransactionUpdate = () => useContext(TransactionContext);
