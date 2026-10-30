import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import styles from "./liste.module.css";
import BarreRecherche from "./BarreRecherche";
import ProduitCard from "./ProduitCard";
import { useAuth } from "./AuthContext";
import { usePanier } from "./PanierContext";
 
function Produits() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");
 
  const { user } = useAuth();
  const navigate = useNavigate();
  const { ajouter, quantites, QUANTITE_MAX } = usePanier();
 
  useEffect(() => {
    const controller = new AbortController();
 
    async function charger() {
      setChargement(true);
 
      try {
        const res = await fetch("/api/produits", {
          signal: controller.signal,
        });
 
        if (!res.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }
 
        const data = await res.json();
 
        setProduits(data);
        setErreur("");
      } catch (err) {
        if (err.name === "AbortError") return;
 
        setErreur("Impossible de charger les produits.");
      } finally {
        if (!controller.signal.aborted) {
          setChargement(false);
        }
      }
    }
 
    charger();
 
    return () => controller.abort();
  }, []);
 
  // Filtrage : si la barre est vide, on affiche tous les produits
  const texte = recherche.trim().toLowerCase();
 
  const produitsFiltres = useMemo(() => {
    if (texte === "") {
      return produits;
    }
 
    return produits.filter((p) => p.nom.toLowerCase().includes(texte));
  }, [produits, texte]);
 
  // Référence stable (utile pour memo sur ProduitCard).
  // Visiteur non connecté -> on l'envoie se connecter avant d'ajouter.
  const handleAjouter = useCallback(
    (produit) => {
      if (!user) {
        navigate("/connexion");
        return;
      }
      ajouter(produit);
    },
    [user, navigate, ajouter]
  );
 
  return (
    <div className={styles.page}>
      <section className={styles.liste}>
        <h2>Nos produits ({produitsFiltres.length})</h2>
 
        <BarreRecherche valeur={recherche} onChange={setRecherche} />
 
        {chargement && <p>Chargement...</p>}
 
        {erreur && <p className={styles.erreur}>{erreur}</p>}
 
        {!chargement && !erreur && produits.length === 0 && (
          <p>Aucun produit pour le moment.</p>
        )}
 
        {!chargement &&
          !erreur &&
          produits.length > 0 &&
          produitsFiltres.length === 0 && (
            <p>Aucun produit ne correspond à « {recherche} ».</p>
          )}
 
        <div className={styles.grille}>
          {produitsFiltres.map((p) => (
            <ProduitCard
              key={p.id}
              produit={p}
              quantite={quantites[p.id] ?? 0}
              max={QUANTITE_MAX}
              onAjouter={handleAjouter}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
 
export default Produits;