import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import Services from "./components/Services";
import Transactions from "./components/Transactions";
import Welcome from "./components/Welcome";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Toaster position="top-right" />
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
      <header className="gradient-bg-welcome">
        <NavBar />
        <Welcome />
      </header>
      <Services />
      <Transactions />
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
