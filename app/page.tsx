"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ImportOptionsSection } from "@/components/import-options-section"
import { ResultsSection } from "@/components/results-section"
import { useLanguage } from "@/lib/language-context"
import type { Flashcard } from "@/app/actions"

export default function Home() {
  const { t } = useLanguage()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [storedContent, setStoredContent] = useState<{ type: string; data: string } | null>(null)

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ImportOptionsSection onFlashcardsGenerated={setFlashcards} onContentStored={setStoredContent} />
      <ResultsSection flashcards={flashcards} storedContent={storedContent} onFlashcardsGenerated={setFlashcards} />

      <footer className="border-t border-white/10 py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  )
}
