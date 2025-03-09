import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Services from "./components/Services";
import Transactions from "./components/Transactions";
import Welcome from "./components/Welcome";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <header className="gradient-bg-welcome">
        <NavBar />
        <Welcome />
      </header>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
}

export default App;
