import { fileURLToPath } from 'url';
import path from 'path';

import * as XLSX from 'xlsx/xlsx.mjs';
import express from 'express';
import multer from 'multer';
import helmet from 'helmet';
import cors from 'cors';

// Definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({
  // Destination folder for uploaded files
  dest: path.join(__dirname, 'uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB

});

// Default route
app.post('/get-csv-file', upload.single("file"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: 'Nenhum arquivo enviado para o servidor'
    })
  }

  const file = req.file.buffer;

  const data = file;
  const workbook = XLSX.read(data);

  const fileContent = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const jsonResponse = fileContent.map(({ quantityForEachClassifiction, quantity, classification, nomenclature, category }, index) => {
    const splitedCategory = category.split('|')

    const categoryPrefix = splitedCategory[0]
    const splitedCategoryValue = splitedCategory[1].split('/')

    let newClass = []

    if (classification.includes('-')) {
      const splitedClassification = classification.split('-');

      const classificationStartPoint = splitedClassification[0].trim();
      const classificationEndPoint = splitedClassification[1].trim();

      for (let i = classificationStartPoint; i <= classificationEndPoint; i++) {
        splitedCategoryValue.forEach(categoryValue => {
          for (let x = 0; x < quantityForEachClassifiction; x++) {
            console.log('Classificação: ', `${i}º ${nomenclature}${categoryValue ? `- ${categoryPrefix || ""} ${categoryValue}` : ""}`)

            newClass.push({
              classification: `${i}º ${nomenclature}`.trim(),
              category: `${categoryValue ? ` - ${categoryPrefix || ""} ${categoryValue}` : ""}`.trim()
            });

            return `${i}º ${nomenclature}${categoryValue ? ` - ${categoryPrefix || ""} ${categoryValue}` : ""}`;
          }

        })
      }
    }

    return newClass

  });

  const csvData = jsonResponse.flat().map(row => ({
    classification: row.classification,
    category: row.category
  }));

  const worksheet = XLSX.utils.json_to_sheet(csvData);
  const workbook_second = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook_second, worksheet, "Sheet1");

  const filePath = path.join(__dirname, 'uploads', 'output.csv');
  XLSX.writeFile(workbook_second, filePath);

  const csvFile = filePath;

  return res.json({
    res: csvFile
  })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});