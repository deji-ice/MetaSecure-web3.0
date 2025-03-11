import { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaHistory,
  FaWallet,
  FaBars,
  FaTimes,
  FaEthereum,
  FaSignOutAlt,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import { TransactionContext } from "../../context/TransactionsContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { connectWallet, disconnectWallet, currentAccount, currentNetwork } =
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
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed top-0 w-full
          ${isScrolled ? "bg-black/90" : "bg-black/70"}
          backdrop-blur-md
          transition-all duration-200 ease-in-out
          z-50 px-6 py-4 border-b border-white/10`}
      >
        <div className="flex lg:px-10 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FaEthereum className="text-2xl text-white" />
            <span className="text-xl font-bold text-white">
              META<span className="text-neutral-500">SECURE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <a
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                >
                  <item.icon className="text-lg" />
                  <span className="font-sans">{item.name}</span>
                </a>
                {/* Animated underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-200 group-hover:w-full"></span>
              </div>
            ))}

            {/* Wallet Connection Section */}
            {!currentAccount ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={connectWallet}
                className="flex items-center space-x-2 px-4 py-2 
                  bg-gradient-to-r from-white to-gray-200 text-black 
                  font-medium rounded-lg shadow-lg hover:shadow-xl 
                  transition-all duration-200"
              >
                <span className="font-mono">Connect Wallet</span>
                <FaArrowRight className="ml-1" />
              </motion.button>
            ) : (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 
                  bg-white/5 backdrop-blur-lg rounded-lg
                  border border-white/10 shadow-lg
                  text-white hover:bg-white/10 transition-all duration-150"
                >
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
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-md 
                      border border-white/10 shadow-2xl rounded-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-neutral-500">Connected to</p>
                        <p className="text-sm text-white font-semibold">
                          {currentNetwork || "Unknown Network"}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          disconnectWallet();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 
                        text-white hover:bg-white/10 transition-all duration-150"
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

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col gap-6 my-8">
                {navItems.map((item) => (
                  <div key={item.name} className="relative group">
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <item.icon className="text-lg" />
                      <span className="font-sans">{item.name}</span>
                    </a>
                    {/* Animated underline for mobile */}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/50 transition-all duration-200 group-hover:w-1/2"></span>
                  </div>
                ))}

                {/* Mobile Wallet Connection */}
                {!currentAccount ? (
                  <div className="space-y-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={connectWallet}
                      className="flex items-center justify-center space-x-2 px-4 py-3
                        bg-gradient-to-r from-white to-gray-200 text-black 
                        font-medium rounded-lg shadow-lg w-full"
                    >
                      <FaWallet className="text-lg" />
                      <span className="font-mono">Connect Wallet</span>
                    </motion.button>
                    <p className="text-xs text-neutral-400 text-center">
                      For mobile, open this site in your wallet&lsquo;s browser
                      for best experience
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      className="flex flex-col px-4 py-3 bg-white/5 
                      border border-white/10 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center text-xl">
                          {walletEmoji}
                        </div>
                        <span className="font-mono text-white">
                          {`${currentAccount.slice(
                            0,
                            4
                          )}...${currentAccount.slice(-4)}`}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">
                        Connected to {currentNetwork || "Unknown Network"}
                      </p>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={disconnectWallet}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 
                        border border-white/10 rounded-lg text-red-400 hover:bg-white/5 transition-all"
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

      {/* Testnet Banner  */}
      <div className="fixed top-[60px] md:top-[72px] w-full z-40 bg-yellow-500 py-2 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center text-center space-x-1 sm:space-x-2 text-black">
          <FaInfoCircle className="flex-shrink-0" />
          <p className="text-xs sm:text-sm font-medium">
            Currently running on Sepolia Testnet
          </p>
        </div>
      </div>

      {/* Empty space to push content below the fixed navbar and banner */}
      <div className="h-[110px] sm:h-[120px]"></div>
    </>
  );
};

export default NavBar;
