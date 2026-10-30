import { db } from "../db.js";

const CATEGORIES = ["vetements", "electronique", "maison", "sport", "autre"];

// GET /api/produits          -> tous les produits
// GET /api/produits?q=clavier -> produits filtrés par la recherche
export function listerProduits(req, res) {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  try {
    let produits;

    if (q === "") {
      produits = db.prepare("SELECT * FROM produits ORDER BY id DESC").all();
    } else {
      // Échappe les caractères spéciaux de LIKE (% et _) saisis par l'utilisateur
      const motif = `%${q.replace(/[\\%_]/g, "\\$&")}%`;

      produits = db
        .prepare(
          `SELECT * FROM produits
           WHERE nom LIKE @motif ESCAPE '\\'
              OR description LIKE @motif ESCAPE '\\'
              OR categorie LIKE @motif ESCAPE '\\'
           ORDER BY id DESC`
        )
        .all({ motif });
    }

    res.json(produits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la recherche." });
  }
}

// POST /api/produits
export function ajouterProduit(req, res) {
  const { nom, description, prix, stock, categorie, image } = req.body;

  // Validation côté serveur (dernière protection, le front peut être contourné)
  if (typeof nom !== "string" || nom.trim() === "") {
    return res.status(400).json({ message: "Le nom du produit est obligatoire." });
  }
  if (typeof prix !== "number" || !(prix > 0)) {
    return res.status(400).json({ message: "Le prix doit être supérieur à 0." });
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return res
      .status(400)
      .json({ message: "Le stock doit être un nombre entier positif ou nul." });
  }
  if (!CATEGORIES.includes(categorie)) {
    return res.status(400).json({ message: "Catégorie invalide." });
  }

  try {
    const resultat = db
      .prepare(
        `INSERT INTO produits (nom, description, prix, stock, categorie, image)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        nom.trim(),
        description?.trim() || null,
        prix,
        stock,
        categorie,
        image?.trim() || null
      );

    res.status(201).json({
      message: "Produit ajouté avec succès !",
      id: resultat.lastInsertRowid,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout du produit." });
  }
}