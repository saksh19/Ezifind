const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse'); // Import pdf-parse
const app = express();
const port = 3000;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const fileType = req.file.mimetype;

  // Ensure the uploaded file is a PDF
  if (fileType !== 'application/pdf') {
    return res.status(400).send('Only PDF files are allowed');
  }

  const fileName = req.body.fileName;
  const filequery = req.body.filequery;
  const fileBuffer = req.file.buffer;

  console.log('Received file:', {
    fileName: fileName,
    fileType: fileType,
    fileBuffer: req.file.buffer,
    filequery: filequery
  });

  // Process the file
  fileprocess(fileBuffer)
    .then((pdfData) => {
      res.send({
        message: 'File uploaded and processed successfully',
        pdfData: pdfData,
      });
    })
    .catch((err) => {
      res.status(500).send('Error processing file');
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function fileprocess(fileBuffer) {
  try {
    const pdfData = await pdfParse(fileBuffer);
    console.log('Parsed PDF data:', pdfData.text);
    
    // Chunking the parsed text
    const textChunks = chunkText(pdfData.text);
    console.log(textChunks.length, 'text chunks');
    
    return textChunks; // Return the chunks to be sent in the response
  } catch (err) {
    console.error('Error parsing PDF:', err);
    throw err; // Propagate the error so that the caller can handle it
  }
}

function chunkText(text, chunkSize = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
