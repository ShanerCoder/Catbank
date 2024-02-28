import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./LoginOrRegister.css";

function LoginOrRegister() {
  const navigate = useNavigate();

  function handleClick(url) {
    navigate(url);
  }

  return (
    <div className="buttonDiv">
      <Row className="navbarRow">
        <Col xs={6}>
          <button
            className="buttonStyling"
            onClick={() => {
              handleClick("login");
            }}
          >
            Log in
          </button>
        </Col>
        <Col xs={6}>
          <button
            className="buttonStyling"
            onClick={() => {
              handleClick("register");
            }}
          >
            Register
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default LoginOrRegister;
