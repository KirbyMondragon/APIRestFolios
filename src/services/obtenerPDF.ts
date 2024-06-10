import connectDB from '../database';
import fs from 'fs';
import { QueryError, RowDataPacket } from 'mysql2';

function getPDF(id: number, outputPath: string) {
    const query = 'SELECT name, data FROM pdf_files WHERE id = ?';
    connectDB.query(query, [id], (err: QueryError | null, results: RowDataPacket[]) => {
        if (err) {
            console.error('Error retrieving PDF from the database:', err);
            return;
        }
        if (results.length > 0) {
            const pdfName = results[0].name;
            const pdfData = results[0].data;

            fs.writeFileSync(outputPath + pdfName, pdfData);
            console.log('PDF retrieved and saved to:', outputPath + pdfName);
        } else {
            console.log('No PDF found with the given ID');
        }
    });
}

// Ejemplo de uso
getPDF(1, 'path/to/save/');
