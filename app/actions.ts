"use server" // serv

import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { GoogleGenerativeAI } from "@google/generative-ai"

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyApwBnK6P1cfudGg6nnrudr_cYdIIPereo",
})

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyApwBnK6P1cfudGg6nnrudr_cYdIIPereo",
)

export interface Flashcard {
  id: string
  question: string
  answer: string
}

export async function generateFlashcardsFromText(text: string): Promise<Flashcard[]> {
  try {
    console.log("[v0] Generating flashcards from text...")

    const { text: response } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: `Você é um assistente especializado em criar flashcards educacionais de alta qualidade.

Analise o seguinte texto e crie flashcards para ajudar no estudo e memorização do conteúdo:

${text}

INSTRUÇÕES:
- Crie entre 6 a 12 flashcards dependendo da quantidade de conteúdo
- Cada flashcard deve ter uma pergunta clara e uma resposta concisa
- Foque nos conceitos mais importantes e relevantes
- As perguntas devem ser diretas e específicas
- As respostas devem ser informativas mas não muito longas
- Retorne APENAS um JSON válido no formato abaixo, sem texto adicional

FORMATO DE RESPOSTA (JSON):
[
  {
    "question": "Pergunta aqui?",
    "answer": "Resposta aqui."
  }
]`,
    })

    console.log("[v0] Received response from Gemini")

    // Parse the JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("[v0] Invalid response format:", response)
      throw new Error("Formato de resposta inválido")
    }

    const flashcardsData = JSON.parse(jsonMatch[0])
    console.log("[v0] Successfully parsed flashcards:", flashcardsData.length)

    // Add IDs to flashcards
    return flashcardsData.map((card: { question: string; answer: string }, index: number) => ({
      id: `${Date.now()}-${index}`,
      question: card.question,
      answer: card.answer,
    }))
  } catch (error) {
    console.error("[v0] Error generating flashcards:", error)
    throw new Error("Erro ao gerar flashcards. Por favor, tente novamente.")
  }
}

export async function generateFlashcardsFromUrl(url: string): Promise<Flashcard[]> {
  try {
    console.log("[v0] Fetching content from URL:", url)

    // First, fetch the content from the URL
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Não foi possível acessar a URL")
    }

    const html = await response.text()

    // Extract text content (basic extraction)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 10000) // Limit to first 10k characters

    if (!textContent || textContent.length < 100) {
      throw new Error("Não foi possível extrair conteúdo suficiente da URL")
    }

    console.log("[v0] Extracted text content, length:", textContent.length)

    // Generate flashcards from the extracted text
    return await generateFlashcardsFromText(textContent)
  } catch (error) {
    console.error("[v0] Error generating flashcards from URL:", error)
    throw new Error("Erro ao processar URL. Verifique se a URL é válida e acessível.")
  }
}

export async function generateFlashcardsFromPdf(base64Content: string): Promise<Flashcard[]> {
  try {
    console.log("[v0] Processing PDF with Gemini, base64 length:", base64Content.length)

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `Você é um assistente especializado em criar flashcards educacionais de alta qualidade.

Analise o documento PDF fornecido e crie flashcards para ajudar no estudo e memorização do conteúdo.

INSTRUÇÕES:
- Crie entre 6 a 12 flashcards dependendo da quantidade de conteúdo
- Cada flashcard deve ter uma pergunta clara e uma resposta concisa
- Foque nos conceitos mais importantes e relevantes
- As perguntas devem ser diretas e específicas
- As respostas devem ser informativas mas não muito longas
- Retorne APENAS um JSON válido no formato abaixo, sem texto adicional

FORMATO DE RESPOSTA (JSON):
[
  {
    "question": "Pergunta aqui?",
    "answer": "Resposta aqui."
  }
]`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Content,
          mimeType: "application/pdf",
        },
      },
    ])

    const response = result.response.text()
    console.log("[v0] Received response from Gemini for PDF")

    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("[v0] Invalid response format:", response.slice(0, 500))
      throw new Error("Formato de resposta inválido")
    }

    const flashcardsData = JSON.parse(jsonMatch[0])
    console.log("[v0] Successfully parsed flashcards from PDF:", flashcardsData.length)

    return flashcardsData.map((card: { question: string; answer: string }, index: number) => ({
      id: `${Date.now()}-${index}`,
      question: card.question,
      answer: card.answer,
    }))
  } catch (error) {
    console.error("[v0] Error generating flashcards from PDF:", error)
    throw new Error("Erro ao processar PDF. Por favor, tente novamente.")
  }
}
