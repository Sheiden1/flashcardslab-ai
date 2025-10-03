"use client"

import { memo, useState } from "react"
import { Card } from "@/components/ui/card"
import type { Flashcard } from "@/app/actions"

interface FlashcardItemProps {
  flashcard: Flashcard
  index: number
}

export const FlashcardItem = memo(function FlashcardItem({ flashcard, index }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-64 cursor-pointer bg-card border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden group"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500 preserve-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-sm text-primary font-medium mb-4">PERGUNTA</div>
            <p className="text-lg text-white leading-relaxed">{flashcard.question}</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center bg-primary/5 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="text-sm text-primary font-medium mb-4">RESPOSTA</div>
            <p className="text-lg text-white leading-relaxed">{flashcard.answer}</p>
          </div>
        </div>
      </Card>
    </div>
  )
})
