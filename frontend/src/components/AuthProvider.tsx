import { AuthContext, type User } from "@/lib/useAuth";
import axios from "axios";
import { useState, useEffect } from "react";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ isLoading: boolean; user: User | null }>({
    isLoading: true,
    user: null,
  });
  const logOut = () => {
    setUser({ isLoading: false, user: null });
  };
  const login = (user: User) => {
    setUser({ isLoading: false, user });
  };
  useEffect(() => {
    axios
      .get("/api/user/me")
      .then((response) => {
        setUser({ isLoading: false, user: response.data.user });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUser({ isLoading: false, user: null });
      });
  }, []);

  return <AuthContext value={{ user, logOut, login }}>{children}</AuthContext>;
};
