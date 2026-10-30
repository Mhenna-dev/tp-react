import { NavLink, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import styles from "./banner.module.css";

function Menu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/connexion");
  };

  return (
    <div className={styles.banner}>
        {user &&(
            <>
                <NavLink to="/produits" className={styles.NavLink}>Produit</NavLink>
                <NavLink to="/panier" className={styles.NavLink}>Panier</NavLink>
            </>
        )}
      

      {!user && (
        <>
          <NavLink to="/connexion" className={styles.NavLink}>Connexion</NavLink>
          <NavLink to="/inscription" className={styles.NavLink}>Inscription</NavLink>
        </>
      )}

      
      <NavLink to="/ajoutproduit" className={styles.NavLink}>Ajouter un Produit</NavLink>

      {user && (
        <>
          <span className={styles.NavLink}>Bonjour {user.prenom}</span>
          <button onClick={handleLogout} className={styles.NavLink}>
            Déconnexion
          </button>
        </>
      )}
    </div>
  );
}

export default Menu;