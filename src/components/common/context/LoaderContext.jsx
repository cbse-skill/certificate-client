import { createContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const handleLoading = (value) => {
    setLoading(value);
  };

  return (
    <LoadingContext.Provider value={{ loading, handleLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
