import express from "express";
import multer from "multer";
import cors from 'cors'
const app = express();
import pdfParser from "pdf-parser"
import fs from "fs"
app.use(cors())

const upload = multer({ dest: './uploads/' });

app.post('/upload', upload.array('files', 12), (req, res) => {
  console.log(req.files);
  const textData = [];

  req.files.forEach((file) => {
    const pdfBuffer = fs.readFileSync(file.path);
    pdfParser(pdfBuffer).then((data) => {
      const text = data.text;
      textData.push({ filename: file.originalname, text: text });
    });
  });
  res.json({ message: 'Files uploaded successfully!' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});