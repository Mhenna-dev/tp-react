import { memo } from "react";
import styles from "./liste.module.css";
 
// La carte ne lit pas le contexte : elle reçoit tout par props (donc memo est efficace)
function ProduitCard({ produit: p, quantite, max, onAjouter }) {
  console.log("[rendu] ProduitCard", p.id);
 
  const rupture = p.stock <= 0;
  const maxAtteint = quantite >= max;
 
  return (
    <article className={styles.carte}>
      {p.image && <img src={p.image} alt={p.nom} />}
 
      <div className={styles.contenu}>
        <span className={styles.categorie}>{p.categorie}</span>
 
        <h3>{p.nom}</h3>
 
        {p.description && <p className={styles.description}>{p.description}</p>}
 
        <div className={styles.bas}>
          <strong>{Number(p.prix).toFixed(2)} €</strong>
 
          <span className={rupture ? styles.rupture : styles.enStock}>
            {rupture ? "Rupture" : `${p.stock} en stock`}
          </span>
        </div>
 
        <button
          type="button"
          onClick={() => onAjouter(p)}
          disabled={rupture || maxAtteint}
        >
          {maxAtteint ? "Maximum atteint" : "Ajouter au panier"}
          {quantite > 0 ? ` (${quantite})` : ""}
        </button>
      </div>
    </article>
  );
}
 
export default memo(ProduitCard);