import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
 
const PanierContext = createContext(null);
 
const QUANTITE_MAX = 10;
const PREFIXE_CLE = "panier-";
 
// Lit le panier sauvegardé ; panier vide si absent ou illisible
function lireStockage(cle) {
  console.log("[init] lecture du panier");
  try {
    const valeur = JSON.parse(localStorage.getItem(cle));
    return Array.isArray(valeur) ? valeur : [];
  } catch {
    return [];
  }
}
 
function PanierInterne({ cle, children }) {
  // Initialisation paresseuse : lecture au premier rendu seulement
  const [lignes, setLignes] = useState(() => (cle ? lireStockage(cle) : []));
  console.log("[rendu] PanierProvider, lignes =", lignes);
 
  // Sauvegarde à chaque modification (jamais sans utilisateur)
  useEffect(() => {
    if (!cle) return;
    console.log("[useEffect] panier sauvegardé");
    localStorage.setItem(cle, JSON.stringify(lignes));
  }, [cle, lignes]);
 
  const ajouter = useCallback((produit) => {
    console.log("[panier] ajouter :", produit.nom);
    setLignes((prev) => {
      const existante = prev.find((l) => l.id === produit.id);
 
      // Cas 1 : produit absent -> nouvelle ligne de quantité 1
      if (!existante) {
        return [
          ...prev,
          { id: produit.id, nom: produit.nom, prix: Number(produit.prix), quantite: 1 },
        ];
      }
 
      // Cas 3 : quantité maximale atteinte -> rien ne change
      if (existante.quantite >= QUANTITE_MAX) return prev;
 
      // Cas 2 : produit déjà présent -> quantité + 1
      return prev.map((l) =>
        l.id === produit.id ? { ...l, quantite: l.quantite + 1 } : l
      );
    });
  }, []);
 
  const changerQuantite = useCallback((id, variation) => {
    setLignes((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, quantite: Math.min(QUANTITE_MAX, Math.max(1, l.quantite + variation)) }
          : l
      )
    );
  }, []);
 
  const retirer = useCallback((id) => {
    setLignes((prev) => prev.filter((l) => l.id !== id));
  }, []);
 
  const vider = useCallback(() => {
    setLignes([]);
  }, []);
 
  // Valeurs dérivées : calculées à partir de `lignes`, jamais stockées
  const nombreArticles = useMemo(
    () => lignes.reduce((somme, l) => somme + l.quantite, 0),
    [lignes]
  );
 
  const total = useMemo(
    () => lignes.reduce((somme, l) => somme + l.prix * l.quantite, 0),
    [lignes]
  );
 
  // { 1: 3, 2: 1 } = 3 exemplaires du produit 1 et 1 du produit 2
  const quantites = useMemo(() => {
    const resultat = {};
    for (const l of lignes) resultat[l.id] = l.quantite;
    return resultat;
  }, [lignes]);
 
  const value = useMemo(() => {
    console.log("[useMemo] value du panier recalculée");
    return {
      lignes,
      quantites,
      nombreArticles,
      total,
      ajouter,
      changerQuantite,
      retirer,
      vider,
      QUANTITE_MAX,
    };
  }, [lignes, quantites, nombreArticles, total, ajouter, changerQuantite, retirer, vider]);
 
  return <PanierContext.Provider value={value}>{children}</PanierContext.Provider>;
}
 
// Enveloppe : connaît l'utilisateur et recrée le panier quand il change (prop key)
export function PanierProvider({ children }) {
  const { user } = useAuth(); // ton AuthContext expose `user` ({ id, prenom })
  const cle = user ? PREFIXE_CLE + user.id : null;
 
  return (
    <PanierInterne key={cle ?? "anonyme"} cle={cle}>
      {children}
    </PanierInterne>
  );
}
 
export function usePanier() {
  const ctx = useContext(PanierContext);
  if (!ctx) {
    throw new Error("usePanier doit être utilisé à l'intérieur de <PanierProvider>");
  }
  return ctx;
}
