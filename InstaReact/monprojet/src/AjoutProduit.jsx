import { useState, useRef, useEffect } from "react";
import styles from "./AjoutProduit.module.css";

// Retourne un message d'erreur, ou "" si valide
function verifierPrix(valeur) {
  if (valeur === "" || Number(valeur) <= 0) {
    return "Le prix doit être supérieur à 0.";
  }
  return "";
}



const FORMULAIRE_VIDE = {
  nom: "",
  description: "",
  prix: "",
  stock: "",
  categorie: "",
  image: "",
};

function AjoutProduit() {
  const [form, setForm] = useState(FORMULAIRE_VIDE); // useState sauvegarde les données et prévient React pour mettre l'affichage à jour

  const [erreurPrix, setErreurPrix] = useState("");
  
  const [erreur, setErreur] = useState(""); // erreur générale (serveur)
  const [succes, setSucces] = useState(false);

  const handlePrixChange = (e) => {
    const valeur = e.target.value;
    setForm({ ...form, prix: valeur });
    setErreurPrix(verifierPrix(valeur));
  };

  const nomRef = useRef(null);
  useEffect(()=> {
    nomRef.current.focus();
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Revalidation au submit
    const errPrix = verifierPrix(form.prix);
    
    setErreurPrix(errPrix);
   
    if (errPrix) return;

    try {
      // fetch : méthode pour appeler une API
      const res = await fetch("/api/produits", {
        method: "POST", // méthode pour envoyer les données au serveur
        headers: { "Content-Type": "application/json" }, // on envoie du JSON
        // transformation des données
        body: JSON.stringify({
          nom: form.nom,
          description: form.description,
          prix: Number(form.prix),
          stock: Number(form.stock),
          categorie: form.categorie,
          image: form.image,
        }),
      });
      const data = await res.json(); // lire la réponse envoyée par le serveur

      if (!res.ok) {
        setErreur(data.message);
        setSucces(false);
        return;
      }

      // Succès : on vide le formulaire seulement maintenant
      setErreur("");
      setSucces(true);
      setForm(FORMULAIRE_VIDE);
    } catch {
      setErreur("Serveur injoignable. Vérifie que le backend est lancé.");
      setSucces(false);
    }
  };

  return (
    <div className={styles.blog}>
      <h1>Ajouter un produit</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          ref={nomRef}
          placeholder="Nom du produit"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
        />

        <input
          type="number"
          placeholder="Prix (€)"
          value={form.prix}
          onChange={handlePrixChange} // événement React : met à jour le formulaire
          step="0.01"
          min="0"
          required
        />
        {erreurPrix && <p className={styles.erreur}>{erreurPrix}</p>}

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({...form, stock: e.target.value})}
          min="0"
          step="1"
          required
        />
        

        <select
          value={form.categorie}
          onChange={(e) => setForm({ ...form, categorie: e.target.value })}
          required
        >
          <option value="">-- Choisir une catégorie --</option>
          <option value="vetements">Vêtements</option>
          <option value="electronique">Électronique</option>
          <option value="maison">Maison</option>
          <option value="sport">Sport</option>
          <option value="autre">Autre</option>
        </select>

        <input
          type="url"
          placeholder="URL de l'image (optionnel)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        {erreur && <p className={styles.erreur}>{erreur}</p>}
        {succes && <p className={styles.succes}>Produit ajouté avec succès !</p>}

        <button type="submit">Ajouter le produit</button>
      </form>
    </div>
  );
}

export default AjoutProduit;