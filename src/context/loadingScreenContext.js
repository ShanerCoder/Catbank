import { createContext, useContext, useReducer } from "react";
import Loading from "../components/overlays/Loading";

const Store = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SHOW_LOADING": {
      return true;
    }
    case "HIDE_LOADING": {
      return false;
    }
    default: {
      return state;
    }
  }
};

const useLoadingStore = () => useContext(Store);

const LoadingScreenStoreProvider = ({ children }) => {
  const [loadingScreen, showLoadingScreen] = useReducer(reducer, null);

  return (
    <Store.Provider value={[loadingScreen, showLoadingScreen]}>
      {loadingScreen && <Loading />}
      {children}
    </Store.Provider>
  );
};

export { useLoadingStore, LoadingScreenStoreProvider };
