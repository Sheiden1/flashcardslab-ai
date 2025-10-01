"use client" // important thing

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Brain } from "lucide-react"

const sampleQuiz = {
  question: "Qual é o processo pelo qual as plantas convertem luz solar em energia?",
  options: ["Respiração", "Fotossíntese", "Transpiração", "Germinação"],
  correctAnswer: 1,
}

export function QuizSection() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setShowResult(true)
  }

  const resetQuiz = () => {
    setSelectedAnswer(null)
    setShowResult(false)
  }

  return (
    <section id="quiz" className="py-24 px-4 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Quiz Inteligente</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Teste Seu Conhecimento</h2>
          <p className="text-xl text-gray-400">Quizzes adaptativos que evoluem com você</p>
        </div>

        <Card className="bg-card border-white/10 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Questão 1 de 10</span>
              <span className="text-sm text-primary font-medium">Biologia</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-6">{sampleQuiz.question}</h3>
          </div>

          <div className="space-y-3 mb-8">
            {sampleQuiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === sampleQuiz.correctAnswer
              const showCorrect = showResult && isCorrect
              const showIncorrect = showResult && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-500/10"
                      : showIncorrect
                        ? "border-red-500 bg-red-500/10"
                        : isSelected
                          ? "border-primary bg-primary/10"
                          : "border-white/10 bg-secondary hover:border-primary/50"
                  } ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">{option}</span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  selectedAnswer === sampleQuiz.correctAnswer ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <p className="text-white font-medium mb-2">
                  {selectedAnswer === sampleQuiz.correctAnswer ? "Correto! 🎉" : "Incorreto"}
                </p>
                <p className="text-gray-400 text-sm">
                  A fotossíntese é o processo pelo qual as plantas convertem energia luminosa em energia química.
                </p>
              </div>
              <Button onClick={resetQuiz} className="w-full bg-primary text-black hover:bg-primary/90">
                Próxima Questão
              </Button>
            </div>
          )}
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-gray-400">Quizzes Criados</div>
          </Card>
          <Card className="bg-card border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-gray-400">Taxa de Retenção</div>
          </Card>
          <Card className="bg-card border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">2x</div>
            <div className="text-gray-400">Mais Rápido</div>
          </Card>
        </div>
      </div>
    </section>
  )
}
