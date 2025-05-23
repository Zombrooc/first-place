'use client'

import { useState } from 'react';
import { CSVLink } from "react-csv";

import * as XLSX from 'xlsx/xlsx.mjs';

function App() {

  const [xlslFile, setXlslFile] = useState(null);
  const [csvContent, setCSVContent] = useState(null);

  const handleFileChanges = (file) => {
    setXlslFile(file[0])
  }

  const handleFileInput = async (event) => {
    event.preventDefault()

    const data = await xlslFile.arrayBuffer();
    const workbook = XLSX.read(data);

    const fileContent = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    let csvContent = [["classification", "category"]]

    fileContent.map(({ quantityForEachClassifiction, quantity, classification, nomenclature, category }, index) => {
      let csvLine = [];

      const splitedCategory = category.split('|')

      const categoryPrefix = splitedCategory[0]
      const splitedCategoryValue = splitedCategory[1].split('/')

      if (classification.includes('-')) {
        const splitedClassification = classification.split('-');

        const classificationStartPoint = splitedClassification[0].trim();
        const classificationEndPoint = splitedClassification[1].trim();

        for (let i = classificationStartPoint; i <= classificationEndPoint; i++) {
          splitedCategoryValue.forEach(categoryValue => {
            for (let x = 0; x < quantityForEachClassifiction; x++) {
              console.log('Classificação: ', `${i}º ${nomenclature}${categoryValue ? ` - ${categoryPrefix || ""}${categoryValue.trim()}` : ""}`)

              csvContent.push([`${i}º ${nomenclature}`, `${categoryValue ? ` - ${categoryPrefix || ""}${categoryValue.trim()}` : ""}`]);
            }

          })
        }
      }
      return csvLine
    })

    setCSVContent(csvContent)
  }

  return (

    <>
      <form onSubmit={handleFileInput}>

        <input type="file" accept=".xlsx" onChange={(e) => handleFileChanges(e.target.files)} />
        <button type="submit">Submit</button>
      </form>

      {csvContent && (
        <CSVLink
          data={csvContent}
          filename={"output.csv"}
          className="btn btn-primary"
          target="_blank"
        >
          Download me
        </CSVLink>
      )}
    </>
  );
}

export default App;



// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Upload, Download, FileText, X } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// export default function FileUploadPage() {
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [uploadedFiles, setUploadedFiles] = useState([])
//   const [isUploading, setIsUploading] = useState(false)
//   const { toast } = useToast()

//   const handleFileSelect = (event) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       setSelectedFile(file)
//       toast({
//         title: "File selected",
//         description: `${file.name} is ready to upload`,
//       })
//     }
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault()

//     if (!selectedFile) {
//       toast({
//         title: "No file selected",
//         description: "Please select a file before submitting",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsUploading(true)

//     // Simulate file upload process
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       setUploadedFiles((prev) => [...prev, selectedFile])
//       setSelectedFile(null)

//       // Reset the input
//       const fileInput = document.getElementById("file-upload")
//       if (fileInput) {
//         fileInput.value = ""
//       }

//       toast({
//         title: "Upload successful",
//         description: `${selectedFile.name} has been uploaded successfully`,
//       })
//     } catch (error) {
//       toast({
//         title: "Upload failed",
//         description: "There was an error uploading your file",
//         variant: "destructive",
//       })
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const handleDownload = (file) => {
//     const url = URL.createObjectURL(file)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)

//     toast({
//       title: "Download started",
//       description: `Downloading ${file.name}`,
//     })
//   }

//   const removeFile = (index) => {
//     setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
//     toast({
//       title: "File removed",
//       description: "File has been removed from the list",
//     })
//   }

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto space-y-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900">File Upload Manager</h1>
//           <p className="text-gray-600 mt-2">Upload, manage, and download your files</p>
//         </div>

//         {/* Upload Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Upload className="w-5 h-5" />
//               Upload File
//             </CardTitle>
//             <CardDescription>Select a file from your device to upload</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="file-upload">Choose File</Label>
//                 <Input
//                   id="file-upload"
//                   type="file"
//                   onChange={handleFileSelect}
//                   className="cursor-pointer"
//                   accept="*/*"
//                 />
//               </div>

//               {selectedFile && (
//                 <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   <div className="flex items-center gap-2">
//                     <FileText className="w-4 h-4 text-blue-600" />
//                     <span className="text-sm font-medium text-blue-900">{selectedFile.name}</span>
//                     <span className="text-xs text-blue-600">({formatFileSize(selectedFile.size)})</span>
//                   </div>
//                 </div>
//               )}

//               <Button type="submit" disabled={!selectedFile || isUploading} className="w-full">
//                 {isUploading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-4 h-4 mr-2" />
//                     Submit Upload
//                   </>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Uploaded Files Section */}
//         {uploadedFiles.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText className="w-5 h-5" />
//                 Uploaded Files ({uploadedFiles.length})
//               </CardTitle>
//               <CardDescription>Manage your uploaded files</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {uploadedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//                     <div className="flex items-center gap-3">
//                       <FileText className="w-5 h-5 text-gray-600" />
//                       <div>
//                         <p className="font-medium text-gray-900">{file.name}</p>
//                         <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm" onClick={() => handleDownload(file)}>
//                         <Download className="w-4 h-4 mr-1" />
//                         Download
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => removeFile(index)}
//                         className="text-red-600 hover:text-red-700"
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {uploadedFiles.length === 0 && (
//           <Card>
//             <CardContent className="text-center py-8">
//               <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500">No files uploaded yet</p>
//               <p className="text-sm text-gray-400">Upload a file to see it here</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }
