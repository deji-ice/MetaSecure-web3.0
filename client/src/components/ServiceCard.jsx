import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ServiceCard = ({ icon, title, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="flex flex-col p-6 rounded-2xl bg-white/5 backdrop-blur-sm
      border border-white/10 hover:border-white/20 transition-all duration-300"
  >
    <div className="flex items-center mb-5">
      <div className="w-10 h-10 rounded-full flex justify-center items-center bg-black/40">
        {icon}
      </div>
      <h3 className="text-white text-xl font-medium ml-3">{title}</h3>
    </div>
    <p className="text-neutral-400 mt-2 text-base">{subtitle}</p>
  </motion.div>
);

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default ServiceCard;
