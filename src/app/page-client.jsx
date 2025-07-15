"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Download, FileText, X, AlertCircleIcon, Sparkles, Zap, CheckCircle, Loader2 } from "lucide-react"

import { toast } from "sonner"

import { CSVLink } from "react-csv"

import { formatFileSize } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ClassificationClientPage() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState([])

  const form = useForm({
    defaultValues: {
      file: "",
      isBelt: false,
    },
  })

  const selectedFile = form.watch("file")

  useEffect(() => {
    if (selectedFile) {
      toast("Arquivo escolhido", {
        description: `${selectedFile.name} está pronto para interpretação`,
      })
    }
  }, [selectedFile])

  const handleSubmit = async ({ isBelt, file: selectedFile }) => {
    setIsUploading(true)
    setErrors([])

    const fd = new FormData()
    fd.append("isBelt", String(isBelt))
    fd.append("file", selectedFile)

    try {
      const response = await fetch("/api/classification", {
        method: "POST",
        body: fd,
      })

      const result = await response.json()

      if (result.error && result.error.length > 0) {
        toast.warning("Erro!", {
          description: "Houve um erro ao tentar fazer upload",
        })

        setErrors(result.error)
        setIsUploading(false)
        return
      }

      if (result.fileList) {
        setUploadedFiles((prev) => [...prev, ...result.fileList])

        const fileInput = document.getElementById("file-upload")
        if (fileInput) {
          fileInput.value = ""
        }

        form.reset()

        toast.success("Arquivo processado com sucesso", {
          description: `${selectedFile.name} foi processado com sucesso`,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Erro ao processar arquivo")
      setErrors(["Erro interno do servidor. Tente novamente."])
    }

    setIsUploading(false)
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    toast("Arquivo removido", {
      description: "Classificação removida.",
    })
  }

  return (
    <div className="futuristic-bg">
      {/* Animated background orbs */}
      <div className="animated-orb orb-1"></div>
      <div className="animated-orb orb-2"></div>
      <div className="animated-orb orb-3"></div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16 fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-sm font-semibold mb-6 scale-in">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="gradient-text-secondary">Powered by AI Technology</span>
            </div>

            <h1 className="heading-xl gradient-text text-shadow mb-6">First Place</h1>

            <p className="heading-lg text-white/80 max-w-3xl mx-auto leading-relaxed text-shadow">
              Sistema Avançado de Classificação de Premiações Esportivas
            </p>

            <div className="flex items-center justify-center gap-12 mt-12 slide-up">
              <div className="flex items-center gap-3 text-white/70">
                <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold">Processamento Instantâneo</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <div className="p-2 rounded-full bg-gradient-to-r from-green-400 to-teal-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold">100% Seguro</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="glass-strong rounded-3xl border-0 hover-lift pulse-glow">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-4 text-3xl font-bold">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 neon-glow">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <span className="gradient-text">Upload de Arquivo</span>
                </CardTitle>
                <CardDescription className="text-white/70 text-lg mt-4">
                  Selecione um arquivo Excel para processar automaticamente suas classificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {errors.length > 0 && (
                  <Alert className="glass-card border-red-500/40 bg-red-500/20 scale-in">
                    <AlertCircleIcon className="text-red-400" />
                    <AlertTitle className="text-red-300 font-bold text-lg">Erro no processamento do arquivo</AlertTitle>
                    <AlertDescription className="text-red-200 mt-2">
                      <p className="mb-4">Verifique as informações e tente novamente:</p>
                      <ul className="space-y-2">
                        {errors.map((error, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-bold text-xl">Arquivo Excel (.xlsx)</FormLabel>
                            <FormControl>
                              <div className="file-upload-area rounded-2xl p-6">
                                <Input
                                  id="file-upload"
                                  type="file"
                                  onChange={(e) => field.onChange(e.target.files[0])}
                                  className="glass-card border-white/30 text-white text-lg file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white file:border-0 file:rounded-xl file:px-6 file:py-3 file:mr-6 file:font-semibold hover:border-white/50 transition-all duration-300"
                                  accept=".xlsx"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {selectedFile && (
                        <div className="glass-card rounded-2xl p-6 border border-green-500/40 bg-green-500/20 hover-lift scale-in">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 neon-glow">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-white text-lg">{selectedFile.name}</p>
                              <p className="text-green-300 font-medium">{formatFileSize(selectedFile.size)}</p>
                            </div>
                            <div className="px-4 py-2 rounded-full status-success text-white text-sm font-bold">
                              Pronto para processar
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="isBelt"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-4 glass-card rounded-2xl p-6">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-white/40 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 w-6 h-6"
                            />
                          </FormControl>
                          <FormLabel className="text-white font-bold text-lg cursor-pointer">Faixa Sublimada</FormLabel>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={!selectedFile || isUploading}
                      className="w-full h-16 text-xl font-bold btn-gradient rounded-2xl shimmer transition-all duration-300 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          Processando arquivo...
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mr-3" />
                          Processar Classificação
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="glass-strong rounded-3xl border-0 hover-lift">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-4 text-3xl font-bold">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-600 neon-glow">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <span className="gradient-text-secondary">Arquivos Processados ({uploadedFiles.length})</span>
                </CardTitle>
                <CardDescription className="text-white/70 text-lg mt-4">
                  Gerencie e baixe suas classificações processadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {uploadedFiles.map(({ csvContent, fileName, fileSize, validationFile }, index) => (
                      <div
                        key={index}
                        className="glass-card rounded-2xl p-6 border border-white/20 hover-lift group scale-in"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 group-hover:scale-110 transition-transform duration-300 neon-glow">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-lg">{fileName}</p>
                              <p className="text-white/60 font-medium">{formatFileSize(fileSize)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {csvContent && csvContent.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="glass-card border-green-500/40 text-green-300 hover:bg-green-500/30 hover:border-green-500/60 transition-all duration-300 bg-transparent font-semibold"
                              >
                                <CSVLink data={csvContent} filename={`${fileName}`} className="flex items-center gap-2">
                                  <Download className="w-4 h-4" />
                                  CSV
                                </CSVLink>
                              </Button>
                            )}

                            {validationFile && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="glass-card border-blue-500/40 text-blue-300 hover:bg-blue-500/30 hover:border-blue-500/60 transition-all duration-300 bg-transparent font-semibold"
                              >
                                <a
                                  href={
                                    typeof validationFile === "string"
                                      ? URL.createObjectURL(
                                          new Blob([Uint8Array.from(atob(validationFile), (c) => c.charCodeAt(0))], {
                                            type: "application/pdf",
                                          }),
                                        )
                                      : URL.createObjectURL(validationFile)
                                  }
                                  download={`${fileName}`}
                                  className="flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  PDF
                                </a>
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="glass-card border-red-500/40 text-red-300 hover:bg-red-500/30 hover:border-red-500/60 transition-all duration-300 bg-transparent"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 scale-in">
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center neon-glow">
                      <FileText className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4 text-shadow">Nenhuma classificação processada</h3>
                    <p className="text-white/70 text-xl mb-8">Envie seu primeiro arquivo Excel para começar</p>
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card text-lg">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <span className="text-white/90 font-semibold">Processamento Automático</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 fade-in">
            <p className="text-white/50 text-lg font-medium">© 2024 First Place - Sistema de Classificação Esportiva</p>
          </div>
        </div>
      </div>
    </div>
  )
}
