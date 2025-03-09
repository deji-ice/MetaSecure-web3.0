import { motion } from "framer-motion";
import PropTypes from "prop-types";
const Input = ({ placeholder, name, type, handleChange }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="relative group">
  <input
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={(e) => handleChange(e, name)}
      className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10
      text-white placeholder-gray-500 outline-none focus:border-white/30 transition-all
      font-mono text-sm"
    />
    {/* <div
      className="absolute inset-0 bg-white/5 opacity-0 
      group-hover:opacity-100 transition-opacity -z-10"
    /> */}
  </motion.div>
);

// Add PropTypes validation
Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default Input;
