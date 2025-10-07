"use server"

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

const FLASHCARD_PROMPT = `Você é um assistente especializado em criar flashcards educacionais de alta qualidade.

Analise o conteúdo fornecido e crie flashcards para ajudar no estudo e memorização.

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

function parseFlashcardsResponse(response: string): Flashcard[] {
  const jsonMatch = response.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error("Formato de resposta inválido")
  }

  const flashcardsData = JSON.parse(jsonMatch[0])
  return flashcardsData.map((card: { question: string; answer: string }, index: number) => ({
    id: `${Date.now()}-${index}`,
    question: card.question,
    answer: card.answer,
  }))
}

export async function generateFlashcardsFromText(text: string): Promise<Flashcard[]> {
  try {
    const { text: response } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: `${FLASHCARD_PROMPT}

CONTEÚDO:
${text}`,
    })

    return parseFlashcardsResponse(response)
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw new Error("Erro ao gerar flashcards. Por favor, tente novamente.")
  }
}

export async function generateFlashcardsFromUrl(url: string): Promise<Flashcard[]> {
  try {
    const urlObj = new URL(url)
    if (!urlObj.protocol.startsWith("http")) {
      throw new Error("URL deve começar com http:// ou https://")
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FlashcardsBot/1.0)",
      },
    })

    if (!response.ok) {
      throw new Error("Não foi possível acessar a URL. Verifique se ela está acessível.")
    }

    const html = await response.text()

    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    if (!textContent || textContent.length < 100) {
      throw new Error("Não foi possível extrair conteúdo suficiente da URL")
    }

    const limitedContent = textContent.slice(0, 15000)
    return await generateFlashcardsFromText(limitedContent)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Invalid URL")) {
      throw new Error("URL inválida. Por favor, insira uma URL válida.")
    }
    console.error("Error generating flashcards from URL:", error)
    throw new Error(
      error instanceof Error ? error.message : "Erro ao processar URL. Verifique se a URL é válida e acessível.",
    )
  }
}

export async function generateFlashcardsFromPdf(base64Content: string): Promise<Flashcard[]> {
  try {
    const estimatedSizeInMB = (base64Content.length * 0.75) / (1024 * 1024)

    if (estimatedSizeInMB > 3) {
      throw new Error("Arquivo muito grande. Por favor, use um PDF menor que 2MB.")
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const result = (await Promise.race([
      model.generateContent([
        FLASHCARD_PROMPT,
        {
          inlineData: {
            data: base64Content,
            mimeType: "application/pdf",
          },
        },
      ]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout ao processar PDF. Tente um arquivo menor.")), 45000),
      ),
    ])) as any

    const response = result.response.text()
    return parseFlashcardsResponse(response)
  } catch (error) {
    console.error("Error generating flashcards from PDF:", error)

    if (error instanceof Error) {
      if (error.message.includes("muito grande") || error.message.includes("Timeout")) {
        throw error
      }
      if (
        error.message.includes("quota") ||
        error.message.includes("limit") ||
        error.message.includes("RESOURCE_EXHAUSTED")
      ) {
        throw new Error("Limite de uso da API atingido. Por favor, tente novamente mais tarde.")
      }
      if (error.message.includes("invalid") || error.message.includes("malformed")) {
        throw new Error("Arquivo PDF inválido ou corrompido. Tente outro arquivo.")
      }
    }

    throw new Error("Erro ao processar PDF. Por favor, tente novamente com um arquivo menor (máximo 2MB).")
  }
}
