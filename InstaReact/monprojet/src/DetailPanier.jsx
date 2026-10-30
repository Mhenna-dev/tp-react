import { memo } from "react";
import styles from "./panier.module.css";
 
function DetailPanier({ ligne, max, onChangerQuantite, onRetirer }) {
  console.log("[rendu] DetailPanier", ligne.id);
 
  return (
    <li className={styles.ligne}>
      <span>
        {ligne.nom} – {ligne.prix.toFixed(2)} €
      </span>
 
      <span className={styles.actions}>
        <button
          type="button"
          onClick={() => onChangerQuantite(ligne.id, -1)}
          disabled={ligne.quantite <= 1}
          aria-label={`Diminuer la quantité de ${ligne.nom}`}
        >
          −
        </button>
        <span className={styles.quantite}>{ligne.quantite}</span>
        <button
          type="button"
          onClick={() => onChangerQuantite(ligne.id, 1)}
          disabled={ligne.quantite >= max}
          aria-label={`Augmenter la quantité de ${ligne.nom}`}
        >
          +
        </button>
 
        <span className={styles.sousTotal}>
          {(ligne.prix * ligne.quantite).toFixed(2)} €
        </span>
 
        <button type="button" onClick={() => onRetirer(ligne.id)}>
          Supprimer
        </button>
      </span>
    </li>
  );
}
 
export default memo(DetailPanier);