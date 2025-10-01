"use client" // important thing //

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Link2, Upload, Type, Loader2 } from "lucide-react"
import { generateFlashcardsFromText, generateFlashcardsFromUrl, generateFlashcardsFromPdf } from "@/app/actions"
import type { Flashcard } from "@/app/actions"

interface ImportOptionsSectionProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void
}

export function ImportOptionsSection({ onFlashcardsGenerated }: ImportOptionsSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [textInput, setTextInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setError(null)
    setIsLoading(true)

    try {
      let flashcards: Flashcard[] = []

      if (activeTab === "text") {
        if (!textInput.trim()) {
          setError("Por favor, digite algum texto")
          setIsLoading(false)
          return
        }
        flashcards = await generateFlashcardsFromText(textInput)
      } else if (activeTab === "url") {
        if (!urlInput.trim()) {
          setError("Por favor, insira uma URL")
          setIsLoading(false)
          return
        }
        flashcards = await generateFlashcardsFromUrl(urlInput)
      } else if (activeTab === "pdf" || activeTab === "doc") {
        setError("Por favor, use o botão de upload de arquivo")
        setIsLoading(false)
        return
      }

      onFlashcardsGenerated(flashcards)

      // Scroll to results
      setTimeout(() => {
        document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar flashcards")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsLoading(true)

    try {
      if (file.type === "application/pdf") {
        // For PDF files, read as ArrayBuffer and convert to base64
        const arrayBuffer = await file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ""
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const base64 = btoa(binary)

        console.log("[v0] PDF file size:", file.size, "bytes")
        console.log("[v0] Base64 length:", base64.length)

        const flashcards = await generateFlashcardsFromPdf(base64)
        onFlashcardsGenerated(flashcards)

        setTimeout(() => {
          document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        // For text files, read as text
        const text = await file.text()
        const flashcards = await generateFlashcardsFromText(text)
        onFlashcardsGenerated(flashcards)

        setTimeout(() => {
          document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("[v0] Error processing file:", err)
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo")
      setIsLoading(false)
    }
  }

  return (
    <section id="como-funciona" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Comece em Segundos</h2>
          <p className="text-xl text-gray-400">Escolha como você quer importar seu conteúdo</p>
        </div>

        <Card className="bg-card border-white/10 p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary mb-8">
              <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                <Type className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Texto</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">PDF</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                <Link2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">URL</span>
              </TabsTrigger>
              <TabsTrigger value="doc" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Documento</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Digite ou cole seu texto</label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Ex: A fotossíntese é o processo pelo qual as plantas convertem luz solar em energia química..."
                  className="min-h-48 bg-secondary border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Envie um arquivo PDF</label>
                <label className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center bg-secondary hover:border-primary/50 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Clique para enviar ou arraste e solte</p>
                  <p className="text-sm text-gray-500">PDF até 50MB</p>
                </label>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cole a URL do conteúdo</label>
                <Input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/artigo"
                  className="bg-secondary border-white/10 text-white placeholder:text-gray-500 h-12"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Suporta artigos, páginas da Wikipedia, documentos do Google e mais
                </p>
              </div>
            </TabsContent>

            <TabsContent value="doc" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Envie Word, PowerPoint ou outros documentos
                </label>
                <label className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center bg-secondary hover:border-primary/50 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept=".docx,.pptx,.txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">Clique para enviar ou arraste e solte</p>
                  <p className="text-sm text-gray-500">DOCX, PPTX, TXT, MD até 50MB</p>
                </label>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-primary text-black hover:bg-primary/90 font-semibold py-6 text-lg mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Gerando Flashcards...
              </>
            ) : (
              "Gerar Flashcards com IA"
            )}
          </Button>
        </Card>
      </div>
    </section>
  )
}
