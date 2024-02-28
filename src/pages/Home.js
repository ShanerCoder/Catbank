import "./Home.css";
import Navbar from "../components/overlays/Navbar";
import LoginOrRegister from "../components/form/LoginOrRegister";

function Home() {
  return (
    <>
      <Navbar />
      <h2>Home Page</h2>
      <LoginOrRegister />
    </>
  );
}

export default Home;
