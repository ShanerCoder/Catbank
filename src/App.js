import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import { UserDetailsStoreProvider } from "./context/userDetailsContext";
import { LoadingScreenStoreProvider } from "./context/loadingScreenContext";
import AccountSummary from "./pages/AccountSummary";

function App() {
  return (
    <>
      <UserDetailsStoreProvider>
        <LoadingScreenStoreProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/accountsummary" element={<AccountSummary />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
        </LoadingScreenStoreProvider>
      </UserDetailsStoreProvider>
    </>
  );
}

export default App;
