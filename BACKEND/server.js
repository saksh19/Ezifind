import express from "express"
import multer from "multer";
const app = express();

const upload = multer({ dest: './uploads/' });

app.post('/upload', upload.array('files', 12), (req, res) => {
  console.log(req.files);
  // req.files is an array of uploaded files
  // You can process the files here, e.g., save them to a database or file system
  res.json({ message: 'Files uploaded successfully!' });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});