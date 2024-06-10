import express from 'express';
import multer from 'multer';
import fs from 'fs';
import connectDB from './database'; // Ajusta la ruta según tu estructura
import { QueryError, OkPacket, RowDataPacket } from 'mysql2';

const app = express();
const port = 3001;

// Configuración de multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('pdf'), (req, res) => {
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

app.get('/download/:id', (req, res) => {
    const pdfId = req.params.id;
    const query = 'SELECT name, data FROM pdf_files WHERE id = ?';
    connectDB.query(query, [pdfId], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error retrieving PDF from the database:', err);
            return res.status(500).send('Error retrieving PDF from the database.');
        }
        if (results.length > 0) {
            const pdfName = results[0].name;
            const pdfData = results[0].data;
            res.setHeader('Content-Disposition', 'attachment; filename=' + pdfName);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfData);
        } else {
            res.status(404).send('No PDF found with the given ID.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
