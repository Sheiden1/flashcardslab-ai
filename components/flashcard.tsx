"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface FlashcardProps {
  question: string
  answer: string
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="perspective-1000 h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <Card
          className="absolute inset-0 backface-hidden bg-card border-border p-6 flex items-center justify-center hover:scale-105 transition-transform"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center">
            <p className="text-sm text-primary font-medium mb-2">PERGUNTA</p>
            <p className="text-foreground text-lg font-medium">{question}</p>
          </div>
        </Card>

        {/* Back of card */}
        <Card
          className="absolute inset-0 backface-hidden bg-primary border-primary p-6 flex items-center justify-center hover:scale-105 transition-transform"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center">
            <p className="text-sm text-primary-foreground/80 font-medium mb-2">RESPOSTA</p>
            <p className="text-primary-foreground text-lg font-medium">{answer}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
