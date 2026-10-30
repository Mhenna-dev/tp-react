import { Router } from "express";
import { listerProduits, ajouterProduit } from "../controllers/produits.controller.js";

const router = Router();

router.get("/", listerProduits);
router.post("/", ajouterProduit);

export default router;