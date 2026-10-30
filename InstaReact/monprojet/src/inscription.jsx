import { useState, useRef, useEffect } from "react";
import styles from "./inscription.module.css";
 
const LONGUEUR_MIN_NOM = 5;
const LONGUEUR_MIN_MDP = 12;
 
// Retourne un message d'erreur, ou "" si valide
function verifierNom(valeur, libelle) {
  if (valeur.trim().length < LONGUEUR_MIN_NOM) {
    return `Le ${libelle} doit contenir au moins ${LONGUEUR_MIN_NOM} caractères.`;
  }
  return "";
}
 
// L'email doit contenir un @ (avec du texte avant et après)
function verifierEmail(valeur) {
  const v = valeur.trim();
  const position = v.indexOf("@");
  if (position < 1 || position === v.length - 1) {
    return "L'adresse email doit contenir un @ (ex : nom@exemple.com).";
  }
  return "";
}
 
// Le mot de passe doit faire au moins 12 caractères
function verifierMotDePasse(valeur) {
  if (valeur.length < LONGUEUR_MIN_MDP) {
    return `Le mot de passe doit contenir au moins ${LONGUEUR_MIN_MDP} caractères.`;
  }
  return "";
}
 
// Supprime les chiffres d'une saisie
function retirerChiffres(valeur) {
  return valeur.replace(/[0-9]/g, "");
}
 
const FORMULAIRE_VIDE = {
  prenom: "",
  nom: "",
  email: "",
  password: "",
  passwordConfirm: "",
};
 
function SignIn() {
  const [form, setForm] = useState(FORMULAIRE_VIDE);//les usestate permet de sauvgarder et de modifier une donnees et de informer react de ce changement pour qu'il mette l'affichage a jour
 
  const [erreurNom, setErreurNom] = useState("");
  const [erreurPrenom, setErreurPrenom] = useState("");
  const [erreurEmail, setErreurEmail] = useState("");
  const [erreurPassword, setErreurPassword] = useState("");
  const [erreur, setErreur] = useState("");      // erreur générale (serveur, confirmation du mot de passe)
  const [succes, setSucces] = useState(false);
 
  const inscref = useRef(null)
  useEffect (()=> {
    inscref.current.focus()
  },[]);
 
  const handleNomChange = (e) => {
    const valeur = retirerChiffres(e.target.value); // les chiffres sont bloqués à la saisie
    setForm({ ...form, nom: valeur });
    setErreurNom(verifierNom(valeur, "nom"));
  };
 
  const handlePrenomChange = (e) => {
    const valeur = retirerChiffres(e.target.value); // les chiffres sont bloqués à la saisie
    setForm({ ...form, prenom: valeur });
    setErreurPrenom(verifierNom(valeur, "prénom"));
  };
 
  const handleEmailChange = (e) => {
    const valeur = e.target.value;
    setForm({ ...form, email: valeur });
    setErreurEmail(verifierEmail(valeur));
  };
 
  const handlePasswordChange = (e) => {
    const valeur = e.target.value;
    setForm({ ...form, password: valeur });
    setErreurPassword(verifierMotDePasse(valeur));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    // Revalidation au submit
    const errNom = verifierNom(form.nom, "nom");
    const errPrenom = verifierNom(form.prenom, "prénom");
    const errEmail = verifierEmail(form.email);
    const errPassword = verifierMotDePasse(form.password);
    setErreurNom(errNom);
    setErreurPrenom(errPrenom);
    setErreurEmail(errEmail);
    setErreurPassword(errPassword);
    if (errNom || errPrenom || errEmail || errPassword) return;
 
    if (form.password !== form.passwordConfirm) {
      setErreur("Les mots de passe ne correspondent pas.");
      setSucces(false);
      return;
    }
 
    try {
      /**
       fetch une methose pour appeler un api
       */
      const res = await fetch("/api/inscription", {
        method: "POST",//methode pour envoyer les donnees au server
        headers: { "Content-Type": "application/json" },//envoyer un contenu JSON
        //transformation des donnees 
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();//lire la reponse envoyer par le serveur 
 
      if (!res.ok) {
        setErreur(data.message);
        setSucces(false);
        return;
      }
 
      // Succès : on vide le formulaire seulement maintenant
      setErreur("");
      setSucces(true);
      setForm(FORMULAIRE_VIDE);
      setErreurNom("");
      setErreurPrenom("");
      setErreurEmail("");
      setErreurPassword("");
    } catch {
      setErreur("Serveur injoignable. Vérifie que le backend est lancé.");
      setSucces(false);
    }
  };
 
  return (
    <div className={styles.blog}>
      <h1>Inscription</h1>
 
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          ref={inscref}
          value={form.nom}
          onChange={handleNomChange}
          required
          pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+"
          title="Le nom ne doit pas contenir de chiffres"
        />
        {erreurNom && <p className={styles.erreur}>{erreurNom}</p>}
 
        <input
          type="text"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handlePrenomChange}//evenement react mit a jour le formulaire 
          required
          pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+"
          title="Le prénom ne doit pas contenir de chiffres"
        />
        {erreurPrenom && <p className={styles.erreur}>{erreurPrenom}</p>}
 
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleEmailChange}
          required
        />
        {erreurEmail && <p className={styles.erreur}>{erreurEmail}</p>}
 
        <input
          type="password"
          placeholder="Mot de passe (12 caractères minimum)"
          value={form.password}
          onChange={handlePasswordChange}
          required
          minLength={LONGUEUR_MIN_MDP}
        />
        {erreurPassword && <p className={styles.erreur}>{erreurPassword}</p>}
 
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={form.passwordConfirm}
          onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
          required
        />
 
        {erreur && <p className={styles.erreur}>{erreur}</p>}
        {succes && <p className={styles.succes}>Compte créé avec succès !</p>}
 
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
 
export default SignIn;