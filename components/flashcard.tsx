"use client"

import { memo, useState } from "react"
import { Card } from "@/components/ui/card"

interface FlashcardProps {
  question: string
  answer: string
  index?: number
}

export const Flashcard = memo(function Flashcard({ question, answer, index = 0 }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="h-64 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <Card
          className="absolute inset-0 bg-card border-white/10 p-6 flex items-center justify-center hover:border-primary/50 transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center">
            <p className="text-sm text-primary font-medium mb-3">PERGUNTA</p>
            <p className="text-foreground text-lg leading-relaxed">{question}</p>
          </div>
        </Card>

        {/* Back of card */}
        <Card
          className="absolute inset-0 bg-primary/5 border-primary/30 p-6 flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            <p className="text-sm text-primary font-medium mb-3">RESPOSTA</p>
            <p className="text-foreground text-lg leading-relaxed">{answer}</p>
          </div>
        </Card>
      </div>
    </div>
  )
})
