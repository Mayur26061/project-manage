
import React from "react";
import { Lock, Search, Settings } from "lucide-react";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar/>
      <main
        className={`dark:bg-dark-bg flex w-full flex-col bg-gray-50 md:pl-64 dark:text-white`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};


const Sidebar = () => {
  const sidebarClasses = `flex flex-col fixed justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto
    bg-white w-64`;

  return (
    <div className={`${sidebarClasses}`}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* LOGO */}
        <div className="z-50 flex w-64 min-w-14 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            EDLIST
          </div>
        </div>
        {/* Team */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 py-4 px-8 dark:border-gray-700">
            <img src="/logo.png" alt="Logo" width={40} height={40} />
            <div>
                <h3 className="text-md font-bold tracking-wide dark:text-gray-200">Team Alpha</h3>
                <div className="mt-1 flex items-start gap-2">
                    <Lock className="h-3 w-3 mt-[0.1rem] text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500">Private</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-8">
        <div className="relative flex h-min w-50">
          <Search className="absolute top-1/2 left-1 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer text-gray-400 dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-400 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            placeholder="Search..."
            type="search"
          />
        </div>
      </div>
      <div className="flex items-center">
        {/* <Link
          href={"/setting"}
          className="h-min w-min rounded p-2 hover:bg-gray-600"
        > */}
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        {/* </Link> */}
        <div className="mr-5 ml-2 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
      </div>
    </div>
  );
};

export default DashboardWrapper;