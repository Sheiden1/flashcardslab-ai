"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Link2, Type, Loader2, ExternalLink } from "lucide-react"
import { generateFlashcardsFromText, generateFlashcardsFromUrl, generateFlashcardsFromPdf } from "@/app/actions"
import type { Flashcard } from "@/app/actions"
import { useLanguage } from "@/lib/language-context"

interface ImportOptionsSectionProps {
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void
  onContentStored: (content: { type: string; data: string }) => void
}

const MAX_FILE_SIZE_MB = 2
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export function ImportOptionsSection({ onFlashcardsGenerated, onContentStored }: ImportOptionsSectionProps) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [textInput, setTextInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")

  const scrollToResults = useCallback(() => {
    setTimeout(() => {
      document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  const handleGenerate = async () => {
    setError(null)
    setIsLoading(true)

    try {
      let flashcards: Flashcard[] = []

      if (activeTab === "text") {
        if (!textInput.trim()) {
          setError(t.errorText)
          setIsLoading(false)
          return
        }
        flashcards = await generateFlashcardsFromText(textInput)
        onContentStored({ type: "text", data: textInput })
      } else if (activeTab === "url") {
        if (!urlInput.trim()) {
          setError(t.errorUrl)
          setIsLoading(false)
          return
        }
        flashcards = await generateFlashcardsFromUrl(urlInput)
        onContentStored({ type: "url", data: urlInput })
      } else if (activeTab === "pdf") {
        setError(t.errorFile)
        setIsLoading(false)
        return
      }

      onFlashcardsGenerated(flashcards)
      scrollToResults()
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
    setUploadProgress("")

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(t.errorFileSize)
      event.target.value = ""
      return
    }

    setIsLoading(true)

    try {
      if (file.type === "application/pdf") {
        setUploadProgress(t.processing || "Processando arquivo...")

        const reader = new FileReader()

        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            try {
              const arrayBuffer = reader.result as ArrayBuffer
              const bytes = new Uint8Array(arrayBuffer)
              const chunks: string[] = []
              const chunkSize = 8192

              for (let i = 0; i < bytes.byteLength; i += chunkSize) {
                const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.byteLength))
                chunks.push(String.fromCharCode(...Array.from(chunk)))
              }

              const binary = chunks.join("")
              const base64 = btoa(binary)
              resolve(base64)
            } catch (err) {
              reject(new Error("Erro ao processar PDF. Tente um arquivo menor."))
            }
          }

          reader.onerror = () => reject(new Error("Erro ao ler o arquivo"))
        })

        reader.readAsArrayBuffer(file)
        const base64 = await base64Promise

        setUploadProgress(t.generating || "Gerando flashcards...")

        const flashcards = await generateFlashcardsFromPdf(base64)
        onFlashcardsGenerated(flashcards)
        onContentStored({ type: "pdf", data: base64 })
        scrollToResults()
      } else if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const text = await file.text()
        const flashcards = await generateFlashcardsFromText(text)
        onFlashcardsGenerated(flashcards)
        onContentStored({ type: "text", data: text })
        scrollToResults()
      } else {
        setError(t.errorFileType)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo.")
    } finally {
      setIsLoading(false)
      setUploadProgress("")
      event.target.value = ""
    }
  }

  return (
    <section id="como-funciona" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{t.startTitle}</h2>
          <p className="text-xl text-gray-400 text-pretty">{t.startSubtitle}</p>
        </div>

        <Card className="bg-card border-white/10 p-6 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary mb-8">
              <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                <Type className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t.tabText}</span>
              </TabsTrigger>
              <TabsTrigger value="pdf" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t.tabPdf}</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="data-[state=active]:bg-primary data-[state=active]:text-black">
                <Link2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t.tabUrl}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.textLabel}</label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t.textPlaceholder}
                  className="min-h-48 bg-secondary border-white/10 text-white placeholder:text-gray-500 resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.pdfLabel}</label>
                <label className="border-2 border-dashed border-white/10 rounded-lg p-8 md:p-12 text-center bg-secondary hover:border-primary/50 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">{t.pdfUploadText}</p>
                  <p className="text-sm text-gray-500">{t.pdfUploadHint}</p>
                </label>

                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-gray-400 mb-3">{t.compressHint}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary bg-transparent"
                    onClick={() => window.open("https://www.ilovepdf.com/compress_pdf", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.compressButton}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t.urlLabel}</label>
                <Input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={t.urlPlaceholder}
                  className="bg-secondary border-white/10 text-white placeholder:text-gray-500 h-12"
                />
                <p className="text-sm text-gray-500 mt-2">{t.urlHint}</p>
              </div>
            </TabsContent>
          </Tabs>

          {uploadProgress && (
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-primary text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadProgress}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-primary text-black hover:bg-primary/90 font-semibold py-6 text-lg mt-6 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t.generating}
              </>
            ) : (
              t.generateButton
            )}
          </Button>
        </Card>
      </div>
    </section>
  )
}
