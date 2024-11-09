import PropTypes from "prop-types";

const ServiceCard = ({ color, title, icon, subtitle }) => {
  return (
    <div className="flex flex-col md:flex-row justify-normal items-center white-glassmorphism p-6 m-3 cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div
        style={{ backgroundColor: color }}
        className="w-12 h-12 md:w-10 md:h-10 rounded-full flex justify-center items-center mb-4 md:mb-0 md:mr-4"
      >
        {icon}
      </div>
      <div className="  flex flex-col flex-1 text-center md:text-left">
        <h3 className="text-white text-xl md:text-lg font-semibold">{title}</h3>
        <p className="text-white text-base md:text-sm mt-2">{subtitle}</p>
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default ServiceCard;
