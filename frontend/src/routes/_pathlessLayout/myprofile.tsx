import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/useAuth";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import ChangePasswordDialog from "@/components/ChangePasswordDialog";

export const Route = createFileRoute("/_pathlessLayout/myprofile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logOut } = useAuth();

  return (
    <div className="max-w-3xl mx-auto my-6 h-full font-sans p-6 bg-white rounded-lg shadow-md mt-10 flex flex-col items-center gap-6">
      <div className="rounded-full p-3 border-gray-300 bg-gray-200 text-gray-600 w-24 h-24 flex items-center justify-center text-4xl">
        {user?.user?.first_name?.[0].toUpperCase() || "U"}
      </div>
      <div>
        <h2>
          {user?.user?.first_name} {user?.user?.last_name}
        </h2>
        <p>{user?.user?.email}</p>
      </div>
      <div className="border-2 p-5 flex flex-col gap-3 mt-5 w-full">
        <div className="cursor-pointer text-gray-700 hover:text-gray-900">
          <EditProfileDialog
            firstName={user?.user?.first_name || ""}
            lastName={user?.user?.last_name || ""}
          />
        </div>
        <div className="cursor-pointer text-gray-700 hover:text-gray-900">
          <ChangePasswordDialog />
        </div>
        <div
          onClick={logOut}
          className="cursor-pointer text-red-500 hover:text-red-700"
        >
          Log Out
        </div>
      </div>
    </div>
  );
}
