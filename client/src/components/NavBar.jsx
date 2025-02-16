import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import {
  FaHome,
  FaHistory,
  FaCog,
  FaWallet,
  FaBars,
  FaTimes,
  FaEthereum,
} from "react-icons/fa";
import { TransactionContext } from "../../context/TransactionsContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    connectWallet,
    currentAccount,
    sendTransaction,
    handleChange,
    formData,
    loading,
    setLoading,
  } = useContext(TransactionContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const connectWallet = async () => {
  //   try {
  //     if (!window.ethereum) throw new Error('No crypto wallet found');

  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     await provider.send('eth_requestAccounts', []);
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();
  //     setWalletAddress(address);
  //   } catch (err) {
  //     console.error('Wallet connection error:', err);
  //   }
  // };

  const navItems = [
    { name: "Home", icon: FaHome, href: "#" },
    { name: "Transactions", icon: FaHistory, href: "#transactions" },
    { name: "Settings", icon: FaCog, href: "#settings" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full
        ${isScrolled ? "bg-black/90" : "bg-black/70"}
        backdrop-blur-md
        transition-all duration-300 ease-in-out
        z-50 px-6 py-4 border-b border-white/10`}
    >
      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <FaEthereum className="text-2xl text-white" />
          <span className="text-xl font-bold text-white font-mono">
            MetaSecure
          </span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
            >
              <item.icon className="text-lg" />
              <span className="font-sans">{item.name}</span>
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            className="flex items-center space-x-2 px-4 py-2 bg-white
              text-black hover:bg-neutral-200 transition-all duration-200"
          >
            <FaWallet className="text-lg" />
            <span className="font-mono">
              {walletAddress
                ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                : "Connect Wallet"}
            </span>
          </motion.button>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white"
        >
          {isMenuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <item.icon className="text-lg" />
                  <span className="font-sans">{item.name}</span>
                </motion.a>
              ))}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="flex items-center space-x-2 px-4 py-2 bg-white
                  text-black hover:bg-neutral-200 transition-all duration-200"
              >
                <FaWallet className="text-lg" />
                <span className="font-mono">
                  {walletAddress
                    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(
                        -4
                      )}`
                    : "Connect Wallet"}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
