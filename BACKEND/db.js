import Database from "better-sqlite3";

export const db = new Database("boutique.db");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    role TEXT NOT NULL,
    cree_le TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    description TEXT,
    prix REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    categorie TEXT NOT NULL DEFAULT 'autre',
    image TEXT,
    cree_le TEXT DEFAULT (datetime('now'))
  );
`);

// Migration : si boutique.db existe déjà avec l'ancienne table (nom, prix),
// on ajoute les colonnes manquantes sans perdre les données.
const colonnes = db
  .prepare("PRAGMA table_info(produits)")
  .all()
  .map((c) => c.name);

function ajouterColonne(nom, definition) {
  if (!colonnes.includes(nom)) {
    db.exec(`ALTER TABLE produits ADD COLUMN ${nom} ${definition}`);
  }
}

ajouterColonne("description", "TEXT");
ajouterColonne("stock", "INTEGER NOT NULL DEFAULT 0");
ajouterColonne("categorie", "TEXT NOT NULL DEFAULT 'autre'");
ajouterColonne("image", "TEXT");

// Données de départ si la table est vide
const { total } = db.prepare("SELECT COUNT(*) AS total FROM produits").get();
if (total === 0) {
  const ajouter = db.prepare("INSERT INTO produits (nom, prix) VALUES (?, ?)");
  ajouter.run("Clavier", 49);
  ajouter.run("Souris", 25);
}