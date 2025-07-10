"use client";

import { Fragment, useState, useTransition } from "react";
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
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { CSVLink } from "react-csv";
import blobStream from "blob-stream";

import * as XLSX from "xlsx/xlsx.mjs";
import { expandCategory, expandClassification } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export default function ClassificationClientPage() {
  // const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [ isPending, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      file: "",
      isBelt: false,
    },
  });

  const selectedFile = form.watch("file");

  const handleFileSelect = ({ event }) => {
    const file = event.target.files?.[0];
    if (file) {
      // setSelectedFile(file);
      toast("Arquivo escolhido", {
        description: `${file.name} está pronto para interpretação`,
      });
    }
  };

  const handleSubmit = async ({ isBelt, file: selectedFile }) => {
    // event.preventDefault();

    if (!selectedFile) {
      toast.warning("Nenhum arquivo selecionado", {
        description: "Por favor, escolha um arquivo antes de gerar o CSV",
      });
      return;
    }

    setIsUploading(true);

    try {
      const data = await selectedFile.arrayBuffer();

      const [fileName, fileExtension] = selectedFile.name.split(".");

      const workbook = XLSX.read(data);

      let fileList = [];
      const validationText = [
        ["Produto", "Classificação", "Categoria", "Quantidade"],
      ];

      if (isBelt) {
        workbook.SheetNames.forEach((sheet, i) => {
          const fileContent = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[i]]
          );

          const csvContent = [["Classificação", "Categoria"]];

          let unorganizedCSV = [];
          let beltColors = [];

          fileContent.map(
            ({
              Quantidade: quantityForEachClassification,
              Classificação: classification,
              Categoria: category = "",
              Nomeclatura: nomenclature = "",
              Cor: color,
            }) => {
              const expandedClassifications = expandClassification(
                classification,
                nomenclature
              );

              beltColors.push(color);

              const expandedCategories = expandCategory(category) || [];

              const classificationQuantity =
                expandedCategories.length === 0
                  ? expandedClassifications.length
                  : expandedCategories.length * expandedClassifications.length;

              validationText.push([
                `${color.charAt(0).toUpperCase() + color.slice(1)}`,
                `${classification.replace("_", "-")}${
                  nomenclature ? " " : ""
                }${nomenclature}`,
                `${category}`,
                `${classificationQuantity}`,
              ]);

              for (let x = 0; x < quantityForEachClassification; x++) {
                if (expandedCategories.length === 0) {
                  expandedClassifications.forEach((classificationValue) => {
                    unorganizedCSV.push({
                      classification: `${classificationValue}${
                        nomenclature ? " " : ""
                      }${nomenclature}`,
                      category: "",
                      color,
                    });
                  });
                } else {
                  expandedCategories.forEach((categoryValue) => {
                    expandedClassifications.forEach((classificationValue) => {
                      unorganizedCSV.push({
                        classification: `${classificationValue}${
                          nomenclature ? " " : ""
                        }${nomenclature}`,
                        category: `${categoryValue}`,
                        color,
                      });
                    });
                  });
                }
              }
            }
          );

          beltColors.map((color) => {
            const csvContent = [["Classificação", "Categoria"]];
            const filteredCSV = unorganizedCSV.filter(
              ({ color: sColor }) => sColor === color
            );

            filteredCSV.map(({ classification, category }) =>
              csvContent.push([classification, category])
            );

            fileList.push({
              fileName: `${fileName.replace(".", "")} - ${color}.csv`,
              csvContent,
              fileSize: new Blob([csvContent]).size,
            });
            console.log("Filtered CSV: ", filteredCSV);
          });
        });
      }

      if (!isBelt) {
        workbook.SheetNames.forEach((sheet, i) => {
          const fileContent = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[i]]
          );

          const csvContent = [["Classificação", "Categoria"]];

          fileContent.map(
            ({
              Quantidade: quantityForEachClassification,
              Classificação: classification,
              Categoria: category = "",
              Nomeclatura: nomenclature = "",
              Produto: productType,
            }) => {
              console.log({ category, classification, nomenclature });
              const expandedClassifications = expandClassification(
                classification,
                nomenclature
              );

              const expandedCategories = expandCategory(category) || [];
              console.log("Expanded Categories:", expandedCategories);

              const classificationQuantity =
                expandedCategories.length === 0
                  ? expandedClassifications.length
                  : expandedCategories.length * expandedClassifications.length;

              validationText.push([
                `${productType.charAt(0).toUpperCase() + productType.slice(1)}`,
                `${classification.replace("_", "-")}${
                  nomenclature ? " " : ""
                }${nomenclature}`,
                `${category}`,
                `${classificationQuantity}`,
              ]);

              for (let x = 0; x < quantityForEachClassification; x++) {
                if (expandedCategories.length === 0) {
                  expandedClassifications.forEach((classificationValue) => {
                    csvContent.push([
                      `${classificationValue}${
                        nomenclature ? " " : ""
                      }${nomenclature}`,
                      "",
                    ]);
                  });
                } else {
                  expandedCategories.forEach((categoryValue) => {
                    expandedClassifications.forEach((classificationValue) => {
                      csvContent.push([
                        `${classificationValue}${
                          nomenclature ? " " : ""
                        }${nomenclature}`,
                        `${categoryValue}`,
                      ]);
                    });
                  });
                }
              }
            }
          );

          fileList.push({
            fileName: `${fileName.replace(".", "")} - ${sheet}.csv`,
            csvContent: csvContent,
            fileSize: new Blob([fileContent]).size,
          });
        });
      }
      // workbook.SheetNames.forEach((sheet, i) => {
      //   const fileContent = XLSX.utils.sheet_to_json(
      //     workbook.Sheets[workbook.SheetNames[i]]
      //   );

      //   const csvContent = [["Classificação", "Categoria"]];

      //   fileContent.map(
      //     ({
      //       Quantidade: quantityForEachClassification,
      //       Classificação: classification,
      //       Categoria: category = "",
      //       Nomeclatura: nomenclature = "",
      //       Produto: productType,
      //     }) => {
      //       console.log({ category, classification, nomenclature });
      //       const expandedClassifications = expandClassification(
      //         classification,
      //         nomenclature
      //       );

      //       const expandedCategories = expandCategory(category) || [];

      //       const classificationQuantity =
      //         expandedCategories.length === 0
      //           ? expandedClassifications.length
      //           : expandedCategories.length * expandedClassifications.length;

      //       validationText.push([
      //         `${productType.charAt(0).toUpperCase() + productType.slice(1)}`,
      //         `${classification.replace("_", "-")}${
      //           nomenclature ? " " : ""
      //         }${nomenclature}`,
      //         `${category}`,
      //         `${classificationQuantity}`,
      //       ]);

      //       for (let x = 0; x < quantityForEachClassification; x++) {
      //         if (expandedCategories.length === 0) {
      //           expandedClassifications.forEach((classificationValue) => {
      //             csvContent.push([
      //               `${classificationValue}${
      //                 nomenclature ? " " : ""
      //               }${nomenclature}`,
      //               "",
      //             ]);
      //           });
      //         } else {
      //           expandedCategories.forEach((categoryValue) => {
      //             expandedClassifications.forEach((classificationValue) => {
      //               csvContent.push([
      //                 `${classificationValue}${
      //                   nomenclature ? " " : ""
      //                 }${nomenclature}`,
      //                 `${categoryValue}`,
      //               ]);
      //             });
      //           });
      //         }
      //       }
      //     }
      //   );

      //   fileList.push({
      //     fileName: `${fileName.replace(".", "")} - ${sheet}.csv`,
      //     csvContent: csvContent,
      //     fileSize: new Blob([fileContent]).size,
      //   });
      // });

      const doc = new PDFDocument();

      const stream = doc.pipe(blobStream());

      console.log(validationText);

      doc.table({
        data: validationText,
        defaultStyle: {
          margin: 0.5,
          fontSize: 12,
          font: "Helvetica",
          borderColor: "gray",
        },
      });

      doc.end();

      stream.on("finish", function () {
        const blob = stream.toBlob("application/pdf");

        let validationFileURL = stream.toBlobURL("application/pdf");

        setUploadedFiles((prev) => {
          return [
            ...prev,
            ...fileList,
            {
              fileName: `${fileName.replace(".", "")} - Conferência.pdf`,
              fileSize: blob.size,
              validationFile: validationFileURL,
            },
          ];
        });
      });

      toast("Envio bem-sucedido", {
        description: `${selectedFile.name} foi processado com sucesso`,
      });

      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        fileInput.value = "";
      }
      form.reset();
    } catch (error) {
      console.log(error);
      toast.warning("Erro!", {
        description: "Houve um erro ao tentar fazer upload",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="max-h-screen  py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gerador de Classificações
          </h1>
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="file-upload">
                          Escolha um arquivo{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="file-upload"
                            type="file"
                            // onChange={handleFileSelect}
                            // {...field}
                            onChange={(e) => field.onChange(e.target.files[0])}
                            className="cursor-pointer"
                            accept=".xlsx"
                          />
                        </FormControl>
                        {/* <FormDescription /> */}
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
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
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="isBelt"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Faixa Sublimada
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                </div>

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
            </Form>

            {/* <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Escolha um arquivo</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                  accept=".xlsx"
                />
              </div> */}

            {/* {selectedFile && (
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
              )} */}

            {/* <Button
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
              </Button> */}
            {/* </form> */}
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
                {uploadedFiles.map(
                  (
                    { csvContent, fileName, fileSize, validationFile },
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {fileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {csvContent && csvContent.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => handleDownload(file)}
                            asChild
                          >
                            <CSVLink
                              data={csvContent}
                              filename={`${fileName}`}
                              className="flex items-center"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Baixar
                            </CSVLink>
                          </Button>
                        )}
                        {validationFile && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={validationFile}
                              download={`${fileName}`}
                              className="flex items-center"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Baixar
                            </a>
                          </Button>
                        )}
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
                  )
                )}
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
