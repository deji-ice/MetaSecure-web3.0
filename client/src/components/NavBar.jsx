import { useContext, useState } from "react";
import logo from "../assets/images/logo.png";
import { MdOutlineClose, MdOutlineMenu } from "react-icons/md";
import { TransactionContext } from "../../context/TransactionsContext";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ["Marketplace", "Services", "Transactions", "Wallet"];
  const { currentAccount } = useContext(TransactionContext);

  return (
    <nav className="w-full flex justify-between md:px-28 2xl:px-[10%] items-center lg:items-start p-4 lg:py-6">
      <img
        src={`https://res.cloudinary.com/dhvwthnzq/image/upload/v1733996898/meta_logo_pig0ve.png`}
        alt="meta secure's logo"
        className="w-24 lg:w-24 cursor-pointer"
      />

      <ul className="text-white md:flex list-none mt-3 hidden gap-8 flex-row justify-between items-center flex-initial">
        {navItems.map((item, index) => (
          <li
            key={index + index}
            className="cursor-pointer  hover:text-gray-400"
          >
            {item}
          </li>
        ))}
        {currentAccount ? (
          <li className="bg-blue-600 hover:bg-blue-500 py-2 px-7  rounded-2xl cursor-pointer">
            disconnect wallet
          </li>
        ) : (
          <li className="bg-blue-600 hover:bg-blue-500 py-2 px-7  rounded-2xl cursor-pointer">
            connect wallet
          </li>
        )}
        {/* {currentAccount && (
          <li className="bg-blue-600 hover:bg-blue-500 flex justify-between items-center py-2 px-7  rounded-2xl cursor-pointer">
            <p>{shortenAddress(currentAccount)}</p>
            <img
              src={avatarUrl}
              alt="address avatar"
              className="w-10 h-10 rounded-full"
            />
          </li>
        )} */}
      </ul>
      <div className="flex md:hidden relative text-white">
        {isOpen ? (
          <MdOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <MdOutlineMenu
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        )}
        {isOpen && (
          <ul
            className="fixed h-screen w-[70vw] shadow-2xl list-none z-10 top-0 right-0
          flex flex-col justify-start items-end p-3 md:hidden blue-glassmorphism animate-slide-in
         bg-blue-600 text-white rounded-sm"
          >
            <li className="text-xl w-full my-2">
              <MdOutlineClose
                fontSize={28}
                className=""
                onClick={() => setIsOpen(false)}
              />
            </li>
            {navItems.map((item, index) => (
              <li
                key={index + index}
                className="cursor-pointer my-2 text-lg hover:text-gray-400"
              >
                {item}
              </li>
            ))}
            {/* <li className="bg-blue-600 hover:bg-blue-500 py-2 px-7  rounded-2xl cursor-pointer">
              Login
            </li> */}
          </ul>
        )}
      </div>
    </nav>
  );
};
