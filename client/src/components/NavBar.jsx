import { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaHistory,
  FaCog,
  FaWallet,
  FaBars,
  FaTimes,
  FaEthereum,
  FaSignOutAlt,
} from "react-icons/fa";
import { TransactionContext } from "../../context/TransactionsContext";
// import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { connectWallet, disconnectWallet, currentAccount } =
    useContext(TransactionContext);

  // Generate emoji avatar based on wallet address
  const walletEmoji = useMemo(() => {
    if (!currentAccount) return "👽";

    // Use address to deterministically select an emoji
    const emojiList = [
      "🤖",
      "👾",
      "🦊",
      "🐱",
      "🐼",
      "🦁",
      "🐵",
      "🐻",
      "🐯",
      "🐺",
      "🦄",
      "🐲",
      "🐉",
      "🦖",
      "🦕",
    ];
    const addressNum = parseInt(currentAccount.slice(2, 10), 16);
    const emojiIndex = addressNum % emojiList.length;

    return emojiList[emojiIndex];
  }, [currentAccount]);

  // const jazziconSeed = currentAccount ? jsNumberForAddress(currentAccount) : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <div className="flex lg:px-10 items-center justify-between">
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

          {/* Wallet Connection Section */}
          {!currentAccount ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="flex items-center space-x-2 px-4 py-2 bg-white
                text-black hover:bg-neutral-200 transition-all duration-200"
            >
              <FaWallet className="text-lg" />
              <span className="font-mono">Connect Wallet</span>
            </motion.button>
          ) : (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10
                  text-white hover:bg-white/10 transition-all duration-200"
              >
                {/* Blockie Avatar */}
                <div className="flex items-center justify-center text-xl">
                  {walletEmoji}
                </div>
                <span className="font-mono">
                  {`${currentAccount.slice(0, 4)}...${currentAccount.slice(
                    -4
                  )}`}
                </span>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-full bg-black border border-white/10 shadow-lg"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        disconnectWallet();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/10 transition-all"
                    >
                      <FaSignOutAlt className="text-red-400" />
                      <span>Disconnect</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
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
            <div className="flex flex-col gap-6 my-8">
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

              {/* Mobile Wallet Connection */}
              {!currentAccount ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={connectWallet}
                  className="flex items-center space-x-2 px-4 py-2 bg-white
                    text-black hover:bg-neutral-200 transition-all duration-200"
                >
                  <FaWallet className="text-lg" />
                  <span className="font-mono">Connect Wallet</span>
                </motion.button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10">
                    <div className="flex items-center justify-center text-xl">
                      {walletEmoji}
                    </div>
                    {/* <Jazzicon diameter={20} seed={jazziconSeed} /> */}
                    <span className="font-mono text-white">
                      {`${currentAccount.slice(0, 4)}...${currentAccount.slice(
                        -4
                      )}`}
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={disconnectWallet}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                      border border-white/10 text-red-400 hover:bg-white/5 transition-all"
                  >
                    <FaSignOutAlt />
                    <span>Disconnect Wallet</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
