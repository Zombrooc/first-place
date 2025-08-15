"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, FileText, X, AlertCircleIcon } from "lucide-react";

import { toast } from "sonner";

import { CSVLink } from "react-csv";

import { formatFileSize } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ClassificationClientPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [errors, setErrors] = useState([]);

  const form = useForm({
    defaultValues: {
      file: "",
      isBelt: false,
    },
  });

  const selectedFile = form.watch("file");

  useEffect(() => {
    if (selectedFile) {
      toast("Arquivo escolhido", {
        description: `${selectedFile.name} está pronto para interpretação`,
      });
    }
  }, [selectedFile]);

  const handleSubmit = async ({ isBelt, file: selectedFile }) => {
    setIsUploading(true);

    const fd = new FormData();
    fd.append("isBelt", String(isBelt));
    fd.append("file", selectedFile); // único file

    const { fileList, error } = await fetch("/api/classification", {
      method: "POST",
      body: fd,
    }).then((res) => res.json());

    if (error.length > 0) {
      toast.warning("Erro!", {
        description: "Houve um erro ao tentar fazer upload",
      });

      setErrors(error);
      setLoading(false);
      return;
    }

    setUploadedFiles((prev) => [...prev, ...fileList]);

    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.value = "";
    }

    form.reset();

    toast.success("Arquivo processado com sucesso", {
      description: `${selectedFile.name} foi processado com sucesso`,
    });

    setIsUploading(false);
    return;
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    toast("Arquivo removido", {
      description: "Classificação removida.",
    });
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
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>
                  Não foi possível processar o arquivo selecionado.
                </AlertTitle>
                <AlertDescription>
                  <p>
                    Por favor, verifique as informações do arquivo e tente
                    novamente.
                  </p>

                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    {errors.map((error, i) => {
                      return <li key={i}>{error}</li>;
                    })}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
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
                            onChange={(e) => field.onChange(e.target.files[0])}
                            className="cursor-pointer"
                            accept=".xlsx"
                          />
                        </FormControl>
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
                          <FormLabel
                            className="text-sm font-normal"
                            htmlFor="isBelt"
                          >
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
                          <Button variant="outline" size="sm" asChild>
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
                              href={
                                typeof validationFile === "string"
                                  ? URL.createObjectURL(
                                      new Blob(
                                        [
                                          Uint8Array.from(
                                            atob(validationFile),
                                            (c) => c.charCodeAt(0)
                                          ),
                                        ],
                                        { type: "application/pdf" }
                                      )
                                    )
                                  : URL.createObjectURL(validationFile)
                              }
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
