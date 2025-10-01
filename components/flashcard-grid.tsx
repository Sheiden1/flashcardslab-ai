"use client"  // important thing //

import { Flashcard } from "./flashcard"

interface FlashcardData {
  id: string
  question: string
  answer: string
}

interface FlashcardGridProps {
  flashcards: FlashcardData[]
}

export function FlashcardGrid({ flashcards }: FlashcardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((card) => (
        <Flashcard key={card.id} question={card.question} answer={card.answer} />
      ))}
    </div>
  )
}
