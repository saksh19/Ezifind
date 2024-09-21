import { useEffect, useState } from 'react'

import './App.css'
import * as pdfjsLib from 'pdfjs-dist';



function App() {
  const [pdfTexts, setPdfTexts] = useState("")


  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = () => {
    setUploading(true);
  const formData = new FormData();

  // Convert FileList to an array
  const filesArray = Array.from(files); // Use Array.from to convert to an array

  filesArray.forEach((file) => {
    formData.append('files', file);
  });

    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUploading(false);
      })
      .catch((error) => {
        console.error(error);
        setUploading(false);
      });
  };


 useEffect( () => {
    const readPDFs = async () => {
      const pdfPaths = Array.from({ length: 500 }, (_, i) => `/path/to/pdf/${i + 1}.pdf`);
      const texts = [];

      for (const path of pdfPaths) {
        const pdf = await pdfjsLib.getDocument(path).promise;
        const numPages = pdf.numPages;

        let text = '';
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          text += `Page ${pageNum}: ${pageText}\n`;
        }

        texts.push(text);
      }

      setPdfTexts(texts);

      console.log( pdfTexts);
      
    };

    readPDFs();
  })

  return (
    <>
      


<aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-20 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
   <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-slate-300">
      <ul class="space-y-2 mt-6 font-medium">
         <li>
         <i class="ze fa-solid fa-bars">
         </i>
         </li>
         <li>
         <i className="ze fa-solid fa-plus py-4 bg-red-300 px-4 rounded-2xl"></i>
      
         </li>
         <li >
         <i class="ze fa-solid fa-users py-10 " ></i>
         </li>

      </ul>
   </div>
</aside>

<div class="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
  <div class="md:flex">
    <div class="w-full p-3">
      <div
        class="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
      >
        <div class="absolute flex flex-col items-center">
          <img
            alt="File Icon"
            class="mb-3"
            src="https://img.icons8.com/dusk/64/000000/file.png"
          />
          <span class="block text-gray-500 font-semibold"
            >Drag &amp; drop your files here</span
          >
          <span class="block text-gray-400 font-normal mt-1"
            >or click to upload</span
          >
        </div>

        <input
          name=""
          class="h-full w-full opacity-0 cursor-pointer"
          type="file"
          
        />
      </div>
    </div>
  </div>
</div>

<div>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Files</button>
      {uploading ? <p>Uploading...</p> : <p>Ready to upload</p>}
    </div>


   
    </>
  )
}

export default App
