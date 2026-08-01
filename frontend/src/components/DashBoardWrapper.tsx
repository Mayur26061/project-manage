import React from "react";
import { LogOut, Menu, User, UserRoundPen, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/useAuth";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar
        className={`max-md:${openSidebar ? "block" : "hidden"}`}
        setOpenSidebar={setOpenSidebar}
      />
      <main
        className={`dark:bg-dark-bg flex w-full flex-col bg-gray-50 md:pl-64 dark:text-white`}
      >
        {openSidebar && (
          <div
            className="bg-gray-900 z-30 w-full h-screen md:hidden absolute opacity-50 "
            onClick={() => setOpenSidebar(false)}
          ></div>
        )}
        <Navbar setOpenSidebar={setOpenSidebar} />
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
};

interface SidebarProps {
  className?: string;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
const Sidebar = ({ className = "", setOpenSidebar }: SidebarProps) => {
  const sidebarClasses = `flex flex-col fixed justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white w-64 ${className}`;

  return (
    <div className={`${sidebarClasses}`}>
      <div className="flex h-full w-full flex-col justify-start">
        <div className="z-50 flex w-64 min-w-14 items-center justify-between bg-white px-6 py-3 dark:bg-black">
          <Link to={"/"}>
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              TaskForge
            </div>
          </Link>
          <X
            size={18}
            className="cursor-pointer active:bg-gray-200 md:hidden"
            onClick={() => setOpenSidebar(false)}
          />
        </div>
        <div>
          <Link to={"/stages"} onClick={() => setOpenSidebar(false)}>
            <div className="flex items-center gap-3 px-8 py-4 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 border-y-[1.5px] border-gray-200">
              <span>Stages</span>
            </div>
          </Link>
          <Link to={"/projects"} onClick={() => setOpenSidebar(false)}>
            <div className="flex items-center gap-3 px-8 py-4 text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 border-b-[1.5px] border-gray-200">
              <span>Projects</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

interface NavbarProps {
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  // You can add props here if needed in the future
}
const Navbar = ({ setOpenSidebar }: NavbarProps) => {
  const { logOut } = useAuth();

  const onLogOut = () => {
    axios
      .post("/api/auth/logout")
      .then(() => {
        logOut();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
    // logOut();
  };
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black sticky top-0 z-30 shadow-md md:flex-row-reverse">
      <div className="flex items-center gap-8 md:hidden">
        <Menu className="cursor-pointer" onClick={() => setOpenSidebar(true)} />
        <Link
          to={"/"}
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          TaskForge
        </Link>
      </div>
      <div className="flex items-center mx-5">
        <Popover>
          <PopoverTrigger asChild>
            <User className="h-6 w-6 cursor-pointer dark:text-white" />
          </PopoverTrigger>
          <PopoverContent className="w-32 p-1" align="center">
            <Link
              className="flex h-8 items-center justify-center gap-2 cursor-pointer hover:bg-gray-200"
              to={"/myprofile"}
            >
              <UserRoundPen className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
            <div
              className="flex h-8 items-center justify-center gap-2 cursor-pointer hover:bg-gray-200"
              onClick={onLogOut}
            >
              <LogOut className="h-4 w-4 " />
              <span>Log Out</span>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DashboardWrapper;
