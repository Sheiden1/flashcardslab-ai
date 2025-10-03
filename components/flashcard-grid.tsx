"use client"

import { memo } from "react"
import { Flashcard } from "./flashcard"

interface FlashcardData {
  id: string
  question: string
  answer: string
}

interface FlashcardGridProps {
  flashcards: FlashcardData[]
}

export const FlashcardGrid = memo(function FlashcardGrid({ flashcards }: FlashcardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((card, index) => (
        <Flashcard key={card.id} question={card.question} answer={card.answer} index={index} />
      ))}
    </div>
  )
})
