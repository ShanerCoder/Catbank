import Navbar from "../components/overlays/Navbar";
import InputForm from "../components/text-inputs/InputForm";
import "./Login.css";
import { useLoadingStore } from "../context/loadingScreenContext";
import { useState } from "react";

function Login() {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loadingScreen, showLoadingScreen] = useLoadingStore();

  function handleLogin(e) {
    e.preventDefault();
    console.log("login + " + accountNumber + " " + password);
    showLoadingScreen({ type: "SHOW_LOADING" });
    setTimeout(() => {
      showLoadingScreen({ type: "HIDE_LOADING" });
    }, 5000);
  }

  return (
    <>
      <Navbar />
      <div className="formContainer">
        <InputForm title="Login" submitFunction={handleLogin}>
          <div className="form-group">
            <label htmlFor="AccountNumber">
              Please enter the account number provided to you by Cat Bank
            </label>
            <input
              type="text"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/[^0-9]/g, ""));
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Password">Please enter your password</label>
            <input
              type="password"
              maxLength={30}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
        </InputForm>
      </div>
    </>
  );
}

export default Login;
