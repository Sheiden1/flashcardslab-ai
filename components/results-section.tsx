"use client"

import { memo, useState } from "react"
import { FlashcardGrid } from "@/components/flashcard-grid"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { Flashcard } from "@/app/actions"
import { generateFlashcardsFromText, generateFlashcardsFromUrl, generateFlashcardsFromPdf } from "@/app/actions"
import { useLanguage } from "@/lib/language-context"

interface ResultsSectionProps {
  flashcards: Flashcard[]
  storedContent: { type: string; data: string } | null
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void
}

export const ResultsSection = memo(function ResultsSection({
  flashcards,
  storedContent,
  onFlashcardsGenerated,
}: ResultsSectionProps) {
  const { t } = useLanguage()
  const [isGeneratingMore, setIsGeneratingMore] = useState(false)

  if (flashcards.length === 0) {
    return null
  }

  const handleGenerateMore = async () => {
    if (!storedContent) return

    setIsGeneratingMore(true)
    try {
      let newFlashcards: Flashcard[] = []

      if (storedContent.type === "text") {
        newFlashcards = await generateFlashcardsFromText(storedContent.data)
      } else if (storedContent.type === "url") {
        newFlashcards = await generateFlashcardsFromUrl(storedContent.data)
      } else if (storedContent.type === "pdf") {
        newFlashcards = await generateFlashcardsFromPdf(storedContent.data)
      }

      onFlashcardsGenerated([...flashcards, ...newFlashcards])
    } catch (error) {
      console.error("[v0] Error generating more flashcards:", error)
    } finally {
      setIsGeneratingMore(false)
    }
  }

  return (
    <section id="resultados" className="py-24 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{t.resultsTitle}</h2>
          <p className="text-xl text-gray-400 text-pretty mb-6">{t.resultsSubtitle}</p>

          {storedContent && (
            <Button
              onClick={handleGenerateMore}
              disabled={isGeneratingMore}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            >
              {isGeneratingMore ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t.generatingMore}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t.generateMore}
                </>
              )}
            </Button>
          )}
        </div>

        <FlashcardGrid flashcards={flashcards} />
      </div>
    </section>
  )
})
