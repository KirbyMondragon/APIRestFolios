
import connectDB from '../database';
import fs from 'fs';
import { QueryError, OkPacket } from 'mysql2';

export function savePDF(filePath: string) {
    const pdfData = fs.readFileSync(filePath);
    const pdfName = filePath.split('/').pop() || 'default.pdf';

    const query = 'INSERT INTO pdf_files (name, data) VALUES (?, ?)';
    connectDB.query(query, [pdfName, pdfData], (err: QueryError | null, results: OkPacket) => {
        if (err) {
            console.error('Error saving PDF to the database:', err);
            return;
        }
        console.log('PDF saved to the database with ID:', results.insertId);
    });
}

// Ejemplo de uso
savePDF("C:\Users\ia\Downloads\Your paragraph text.pdf");


