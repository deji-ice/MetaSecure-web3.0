import { motion } from "framer-motion";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import ServiceCard from "./ServiceCard";

const Services = () => {
  return (
    <div className="py-20 px-4 md:px-8 lg:px-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="text-neutral-500">MetaSecure</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Our blockchain-based platform offers secure, transparent, and
            efficient solutions for all your digital asset transfers.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ServiceCard
              icon={<BsShieldFillCheck fontSize={20} className="text-white" />}
              title="Secure Transfers"
              subtitle="Your transactions are protected with advanced cryptographic security, ensuring that your assets remain safe throughout the transfer process."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ServiceCard
              icon={<BiSearchAlt fontSize={20} className="text-white" />}
              title="Blockchain Verification"
              subtitle="Every transaction is immutably recorded on the blockchain, providing transparent and verifiable proof of all your transfers."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ServiceCard
              icon={<RiHeart2Fill fontSize={20} className="text-white" />}
              title="Unique GIF Receipts"
              subtitle="Receive a one-of-a-kind GIF receipt for each transaction, adding a personalized touch to your blockchain experience."
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Services;
