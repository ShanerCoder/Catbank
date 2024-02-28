import { createContext, useContext, useState } from "react";

const Store = createContext();

const useUserStore = () => useContext(Store);

const UserDetailsStoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return <Store.Provider value={[user, setUser]}>{children}</Store.Provider>;
};

export { useUserStore, UserDetailsStoreProvider };
