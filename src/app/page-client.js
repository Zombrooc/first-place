"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, X } from "lucide-react";

import { toast } from "sonner";

import { CSVLink } from "react-csv";

import * as XLSX from "xlsx/xlsx.mjs";
import { expandCategory, expandClassification } from "@/lib/utils";
// import { addNewClassificationToDB } from "./_actions/classificationActions";

// export default function ClassificationClientPage({ classificationStatus, classifications }) {
export default function ClassificationClientPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [csvContent, setCSVContent] = useState(null);

  // useEffect(() => {
  //   const fetchClassifications = async () => {
  //     const { success, classifications } = await getClassificationsFromDB();

  //     console.log('Classifications from DB: ', classifications)

  //     if (success && classifications) {
  //       setUploadedFiles(classifications);
  //     } else {
  //       toast.error("Erro ao carregar classificações", {
  //         description: "Não foi possível carregar as classificações salvas.",
  //       });
  //     }
  //   }

  //   fetchClassifications();
  // }, [])

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast("Arquivo escolhido", {
        description: `${file.name} está pronto para interpretação`,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.warning("Nenhum arquivo selecionado", {
        description: "Por favor, escolha um arquivo antes de gerar o CSV",
      });
      return;
    }

    setIsUploading(true);

    // Simulate file upload process
    try {
      const csvContent = await new Promise(async (resolve) => {
        const data = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(data);

        const fileContent = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );

        const csvContent = [["classification", "category"]];

        // fileContent.map(({ quantityForEachClassifiction, quantity, classification, nomenclature, category }, index) => {
        //   let csvLine = [];

        //   const splitedCategory = category.includes('|') ?? category.split('|')

        //   const categoryPrefix = splitedCategory[0]
        //   const splitedCategoryValue = splitedCategory[1].split('/')

        //   if (classification.includes('-')) {
        //     const splitedClassification = classification.split('-');

        //     const classificationStartPoint = splitedClassification[0].trim();
        //     const classificationEndPoint = splitedClassification[1].trim();

        //     for (let i = classificationStartPoint; i <= classificationEndPoint; i++) {
        //       splitedCategoryValue.forEach(categoryValue => {
        //         for (let x = 0; x < quantityForEachClassifiction; x++) {
        //           console.log('Classificação: ', `${i}º ${nomenclature}${categoryValue ? ` - ${categoryPrefix || ""}${categoryValue.trim()}` : ""}`)

        //           csvContent.push([`${i}º ${nomenclature}`, `${categoryValue ? `${categoryPrefix || ""}${categoryValue.trim()}` : ""}`]);
        //         }

        //       })
        //     }
        //   }
        //   return csvLine
        // })

        fileContent.map(
          ({
            quantityForEachClassification,
            classification,
            category,
            nomenclature = "",
          }) => {
            const expandedClassifications =
              expandClassification(classification);

            const expandedCategories = expandCategory(category);

            // expandedClassifications.forEach(classificationValue => {
            //   expandedCategories.forEach(categoryValue => {
            //     for (let x = 0; x < quantityForEachClassification; x++) {
            //       console.log(`${classificationValue} ${nomenclature}`, `${categoryValue}`)
            //       csvContent.push([`${classificationValue} ${nomenclature}`, `${categoryValue}`])
            //     }
            //   })
            // })
            for (let x = 0; x < quantityForEachClassification; x++) {
              expandedCategories.forEach((categoryValue) => {
                expandedClassifications.forEach((classificationValue) => {
                  // console.log(
                  //   `${classificationValue} ${nomenclature}`,
                  //   `${categoryValue}`
                  // );
                  csvContent.push([
                    `${classificationValue} ${nomenclature}`,
                    `${categoryValue}`,
                  ]);
                });
              });
            }
          }
        );

        // setCSVContent(csvContent);

        resolve(csvContent);
      });

      setUploadedFiles((prev) => [
        ...prev,
        {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          csvContent,
        },
      ]);

      // const { success } = await addNewClassificationToDB({ selectedFile, csvContent });

      if (success) {
        toast("Envio bem-sucedido", {
          description: `${selectedFile.name} foi processado com sucesso `,
        });
      }

      setSelectedFile(null);

      // Reset the input
      const fileInput = document.getElementById(
        "file-upload"
      );
      if (fileInput) {
        fileInput.value = "";
      }


    } catch (error) {
      console.log(error);
      toast.warning("Erro!", {
        description: "Houve um erro ao tentar fazer upload",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // const handleDownload = (file) => {
  //   const url = URL.createObjectURL(file);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = file.name;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);

  //   toast("Download iniciado", {
  //     description: `Baixando ${file.name}`,
  //   });
  // };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    toast("Arquivo removido", {
      description: "Classificação removida.",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="max-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerador de Classificações
          </h1>
          {/* <p className="text-gray-600 mt-2">
            Upload, manage, and download your files
          </p> */}
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Envie sua classificação
            </CardTitle>
            <CardDescription>Selecione um arquivo para enviar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Escolha um arquivo</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                  accept=".xlsx"
                />
              </div>

              {selectedFile && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-blue-600">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar classificação
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Uploaded Files Section */}

        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Classificações enviadas ({uploadedFiles.length})
              </CardTitle>
              <CardDescription>
                Gerenciar classificações anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map(({ csvContent, fileName, fileSize }, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{fileName}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(fileSize)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => handleDownload(file)}
                        asChild
                      >
                        <CSVLink data={csvContent} filename={`${fileName.split('.')[0]}.csv`} className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          Baixar
                        </CSVLink>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {uploadedFiles.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Nenhuma classificação enviada ainda
              </p>
              <p className="text-sm text-gray-400">
                Envie uma classificação para começar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
