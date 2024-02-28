import "./Navbar.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function handleClick(url) {
    navigate(url);
  }

  return (
    <>
      <div className="navbarDiv">
        <Row className="navbarRow">
          <Col xs={1}>
            <img
              onClick={() => handleClick("/")}
              className="logoImage"
              src={"./images/cat.jpg"}
              alt={"logo"}
            />
          </Col>
          <Col xs={2}>
            <h2 className="logoText" onClick={() => handleClick("/")}>
              Catbank
            </h2>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Navbar;
