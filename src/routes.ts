import { Router } from 'express';
import { obtenerNuevoFolio, obtenerPDF, savePDF } from './controllers/folioController';

const router = Router();

router.get('/nuevo-folio', obtenerNuevoFolio);
router.get('/pdf/:id', obtenerPDF);
router.post('/upload', savePDF);

export default router;
