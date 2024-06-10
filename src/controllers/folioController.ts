import { Request, Response } from "express";
import { crearFolio } from "../services/folioService";
import connectDB from '../database';
import { QueryError, RowDataPacket, OkPacket } from 'mysql2';
import multer from 'multer';

// Configuración de multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const obtenerNuevoFolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const nuevoFolio = await crearFolio();
    res.json({ folio: nuevoFolio });
  } catch (error) {
    res.status(500).json({ error: "Error al generar el folio" });
  }
};

export const obtenerPDF = async (req: Request, res: Response): Promise<void> => {
    const pdfId = parseInt(req.params.id, 10);

    if (isNaN(pdfId)) {
        res.status(400).json({ error: "Invalid PDF ID" });
        return;
    }

    const query = 'SELECT name, data FROM pdf_files WHERE id = ?';
    connectDB.query(query, [pdfId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error retrieving PDF from the database:', err);
            res.status(500).json({ error: "Error retrieving PDF from the database" });
            return;
        }
        if (results.length > 0) {
            const pdfName = results[0].name;
            const pdfData = results[0].data;

            res.setHeader('Content-Disposition', 'attachment; filename=' + pdfName);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfData);
        } else {
            res.status(404).json({ error: "No PDF found with the given ID" });
        }
    });
};

export const savePDF = async (req: Request, res: Response): Promise<void> => {
    upload.single('pdf')(req, res, async (err) => {
        if (err) {
            return res.status(500).send('Error uploading file.');
        }
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const pdfName = req.file.originalname;
        const pdfData = req.file.buffer;

        const query = 'INSERT INTO pdf_files (name, data) VALUES (?, ?)';
        connectDB.query(query, [pdfName, pdfData], (err: QueryError | null, results: OkPacket) => {
            if (err) {
                console.error('Error saving PDF to the database:', err);
                return res.status(500).send('Error saving PDF to the database.');
            }
            res.send('PDF saved to the database with ID: ' + results.insertId);
        });
    });
};
