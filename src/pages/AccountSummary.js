import "./AccountSummary.css";
import Navbar from "../components/overlays/Navbar";
import { useUserStore } from "../context/userDetailsContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/text-inputs/InputForm";
import { useLoadingStore } from "../context/loadingScreenContext";
import { Col, Row } from "react-bootstrap";
import { backendUrl } from "../constants";

function AccountSummary() {
  const [user, setUser] = useUserStore();
  const [loadingScreen, showLoadingScreen] = useLoadingStore();
  const [otherUserAccountNumber, setOtherUserAccountNumber] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const navigate = useNavigate();

  function handleSendOfMoney(e) {
    e.preventDefault();
    if (Number(amountToSend) > Number(user.silveuros)) {
      setErrorText(
        "You do not have enough Silveuros to send this amount, please lower the amount"
      );
      return;
    } else if (amountToSend <= 0) {
      setErrorText("You cannot send a negative amount of Silveuros");
      return;
    }
    const body = {
      otherUserAccountNumber: otherUserAccountNumber,
      amountToSend: amountToSend,
      accountNumber: user.accountNumber,
      password: password,
    };
    showLoadingScreen({ type: "SHOW_LOADING" });
    fetch(backendUrl + "/send", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.user == null) {
          throw new Error("Failed to send Silveuros");
        }
        setUser({
          accountNumber: user.accountNumber,
          silveuros: parsedData.user.silveuros,
          transactions: parsedData.user.transactions,
        });
        setSuccessText(
          `You sent Account '${otherUserAccountNumber}' ${amountToSend} Silveuro successfully!`
        );
        setErrorText("");
      })
      .catch((error) => {
        setErrorText("Error sending Silveuros - " + error.message);
        setSuccessText("");
      })
      .finally(() => {
        setTimeout(() => {
          showLoadingScreen({ type: "HIDE_LOADING" });
        }, 1000);
      });
  }

  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="accountSummaryDiv">
        <h2>Account Details</h2>
        <p>Account Number: {user && user.accountNumber}</p>
        <p>Balance: {user && user.silveuros} Silveuros</p>
      </div>
      <Row className="navbarRow">
        <Col xs={12} md={6}>
          <InputForm
            title="Send to other account"
            submitFunction={handleSendOfMoney}
          >
            {errorText && <p className="errorText">{errorText}</p>}
            {successText && <p className="successText">{successText}</p>}
            <div className="form-group">
              <label htmlFor="AccountNumber">
                Please enter the account number you would like to send Silveuro
                to
              </label>
              <input
                type="text"
                maxLength={10}
                value={otherUserAccountNumber}
                onChange={(e) => {
                  setOtherUserAccountNumber(
                    e.target.value.replace(/[^0-9]/g, "")
                  );
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Value">
                Please enter the value of Silveuro you would like to send
              </label>
              <input
                type="text"
                maxLength={10}
                value={amountToSend}
                onChange={(e) => {
                  setAmountToSend(e.target.value.replace(/[^0-9]/g, ""));
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Password">Please confirm your password</label>
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
        </Col>
        <Col xs={12} md={6}>
          <div className="card">
            <h2>Recent Transactions</h2>
            {user && user.transactions ? (
              user.transactions.map((transaction, index) => {
                if (transaction.accountNumberSentTo === user.accountNumber)
                  return (
                    <div key={index} className="transaction">
                      <p>
                        Received ${transaction.amountSent} Silveuros from
                        Account: {transaction.accountNumberSentFrom}
                      </p>
                    </div>
                  );
                else
                  return (
                    <div key={index} className="transaction">
                      <p>
                        Sent ${transaction.amountSent} Silveuros to Account:{" "}
                        {transaction.accountNumberSentTo}
                      </p>
                    </div>
                  );
              })
            ) : (
              <p>No transactions found</p>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default AccountSummary;
