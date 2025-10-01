"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ImportOptionsSection } from "@/components/import-options-section"
import { ResultsSection } from "@/components/results-section"
import type { Flashcard } from "@/app/actions"

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ImportOptionsSection onFlashcardsGenerated={setFlashcards} />
      <ResultsSection flashcards={flashcards} />

      <footer className="border-t border-white/10 py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 FlashcardsLab. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
