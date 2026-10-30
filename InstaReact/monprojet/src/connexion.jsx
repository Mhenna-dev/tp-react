import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import styles from "./connexion.module.css";

function LogIn() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const conxref = useRef(null);

  useEffect(() => {
    conxref.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: Email, password: Password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErreur(data.message);
        return;
      }

      // data = { id, prenom }
      setErreur("");
      login(data);
      navigate("/produits"); // redirection après connexion
    } catch {
      setErreur("Serveur injoignable. Vérifie que le backend est lancé.");
    }
  };

  return (
    <div className={styles.header}>
      <h1>Connexion</h1>
      <form className={styles.corps} onSubmit={handleSubmit}>
        <input
          type="email"
          ref={conxref}
          placeholder="login"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {erreur && <p className={styles.erreur}>{erreur}</p>}

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default LogIn;