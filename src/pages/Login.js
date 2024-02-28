import Navbar from "../components/overlays/Navbar";
import InputForm from "../components/text-inputs/InputForm";
import "./Login.css";
import { useLoadingStore } from "../context/loadingScreenContext";
import { useState } from "react";
import { useUserStore } from "../context/userDetailsContext";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../constants";

function Login() {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loadingScreen, showLoadingScreen] = useLoadingStore();
  const [errorText, setErrorText] = useState("");
  const [user, setUser] = useUserStore();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    const body = {
      accountNumber: accountNumber,
      password: password,
    };

    showLoadingScreen({ type: "SHOW_LOADING" });
    fetch(backendUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Invalid account number or password");
        }
        return response.text();
      })
      .then((data) => {
        const parsedData = JSON.parse(data);
        const userData = {
          accountNumber: parsedData.user.accountNumber,
          silveuros: parsedData.user.silveuros,
          transactions: parsedData.user.transactions,
        };
        setUser(userData);
        navigate("/accountsummary");
      })
      .catch((error) => {
        setErrorText("Error logging in - " + error.message);
      })
      .finally(() => {
        setTimeout(() => {
          showLoadingScreen({ type: "HIDE_LOADING" });
        }, 1000);
      });
  }

  return (
    <>
      <Navbar />
      <div className="formContainer">
        <InputForm title="Login" submitFunction={handleLogin}>
          {errorText && <p className="errorText">{errorText}</p>}
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
