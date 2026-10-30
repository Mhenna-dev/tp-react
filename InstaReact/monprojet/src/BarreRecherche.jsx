import { useEffect, useRef } from "react";
import styles from "./BarreRecherche.module.css";

function BarreRecherche({ valeur, onChange }) {
  const barref = useRef(null);

  useEffect(() => {
    barref.current.focus();
  }, []);

  return (
    <div className={styles.barre}>
      <input
        type="search"
        ref={barref}
        placeholder="Rechercher..."
        aria-label="Rechercher"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default BarreRecherche;