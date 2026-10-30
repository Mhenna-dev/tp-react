import { createContext, useContext, useState } from "react";
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  // On relit le localStorage au démarrage pour rester connecté après un refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
 
  const login = (userData) => {
    // userData = { id, prenom, role }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
 
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
 
  // Valeur dérivée : calculée à partir de `user`, pas stockée dans un état
  const estAdmin = user?.role === "admin";
 
  return (
    <AuthContext.Provider value={{ user, login, logout, estAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  return useContext(AuthContext);
}