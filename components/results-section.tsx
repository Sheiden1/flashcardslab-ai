"use client"

import { FlashcardGrid } from "@/components/flashcard-grid"
import type { Flashcard } from "@/app/actions"

interface ResultsSectionProps {
  flashcards: Flashcard[]
}

export function ResultsSection({ flashcards }: ResultsSectionProps) {
  if (flashcards.length === 0) {
    return null
  }

  return (
    <section id="resultados" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Seus Flashcards</h2>
          <p className="text-xl text-gray-400">Clique em qualquer card para revelar a resposta</p>
        </div>

        <FlashcardGrid flashcards={flashcards} />
      </div>
    </section>
  )
}
