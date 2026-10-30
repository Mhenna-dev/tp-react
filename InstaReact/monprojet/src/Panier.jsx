import { Link } from "react-router";
import { usePanier } from "./PanierContext";
import DetailPanier from "./DetailPanier";
import styles from "./panier.module.css";
 
export default function Panier() {
  const { lignes, total, changerQuantite, retirer, vider, QUANTITE_MAX } = usePanier();
  console.log("[rendu] Panier");
 
  const handleVider = () => {
    if (window.confirm("Vider le panier ?")) {
      vider();
    }
  };
 
  if (lignes.length === 0) {
    return (
      <div className={styles.page}>
        <h2>Panier</h2>
        <p>Votre panier est vide.</p>
        <Link to="/produits">Voir les produits</Link>
      </div>
    );
  }
 
  return (
    <div className={styles.page}>
      <h2>Panier</h2>
 
      <ul className={styles.liste}>
        {lignes.map((l) => (
          <DetailPanier
            key={l.id}
            ligne={l}
            max={QUANTITE_MAX}
            onChangerQuantite={changerQuantite}
            onRetirer={retirer}
          />
        ))}
      </ul>
 
      <p className={styles.total}>
        <strong>Total : {total.toFixed(2)} €</strong>
      </p>
 
      <button type="button" onClick={handleVider}>
        Vider le panier
      </button>
    </div>
  );
}