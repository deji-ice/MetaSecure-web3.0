const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center p-6 md:p-10 gradient-bg-footer">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-screen-xl px-4 md:px-8">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-wider text-center md:text-left">
            MetaSecure
          </h1>
          <p className="text-gray-300 text-base mt-2 text-center md:text-left">
            Connecting the future, one block at a time
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <p className="text-white text-lg font-semibold mb-2">Marketplace</p>
          <p className="text-gray-300 text-sm mb-1">Tutorials</p>
          <p className="text-gray-300 text-sm mb-1">Roadmap</p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <p className="text-white text-lg font-semibold mb-2">Socials</p>
          <p className="text-gray-300 text-sm mb-1">Twitter</p>
          <p className="text-gray-300 text-sm mb-1">Github</p>
          <p className="text-gray-300 text-sm mb-1">LinkedIn</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center w-full">
        <hr className="w-full border-gray-700 mb-4" />
        <p className="text-gray-400 text-sm text-center">All rights reserved © 2023</p>
        <p className="text-gray-400 text-sm mt-1 text-center">
          Privacy Policy | Terms of Service
        </p>
      </div>
    </footer>
  );
};

export default Footer;
