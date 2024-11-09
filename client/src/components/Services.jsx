import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";
import ServiceCard from "./ServiceCard";

const Services = () => {
  return (
    <div className="flex w-full flex-col lg:flex-row justify-center items-center gradient-bg-services ">
      <div className=" flex md:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex-1 flex flex-col justify-start items-start">
          <h1 className="text-white text-3xl md:text-5xl py-2 text-gradient">
            Services that we <br /> continue to improve
          </h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-start items-center">
        <ServiceCard
          color="#1e90ff"
          title="Secure Payments"
          icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
          subtitle="Your payments are secure with our advanced encryption technology. Enjoy peace of mind with every transaction."
        />
        <ServiceCard
          color="#32cd32"
          title="Market Analysis"
          icon={<BiSearchAlt fontSize={21} className="text-white" />}
          subtitle="Get the latest market analysis and insights to make informed decisions. Stay ahead of the market trends."
        />
        <ServiceCard
          color="#ff4500"
          title="Customer Support"
          icon={<RiHeart2Fill fontSize={21} className="text-white" />}
          subtitle="Our customer support team is here to help you 24/7 with any issues or questions."
        />

      </div>
    </div>
  );
};

export default Services;
