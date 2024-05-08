// src/routes.ts
import { Router } from "express";
import { obtenerNuevoFolio } from "./controllers/folioController";

const router = Router();

// Rutas para la API
router.get("/api/folios/nuevo", obtenerNuevoFolio);

export default router;