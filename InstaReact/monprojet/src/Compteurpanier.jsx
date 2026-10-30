import { Link } from "react-router";
import { usePanier } from "./PanierContext";
import styles from "./panier.module.css";
 
// À placer dans Menu.jsx à la place de ton lien "Panier" actuel
export default function CompteurPanier() {
  const { nombreArticles } = usePanier();
 
  return (
    <Link to="/panier" className={styles.compteur}>
      Panier ({nombreArticles})
    </Link>
  );
}