import { Sparkles } from "lucide-react"  // important thing //

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">Built with Gemini AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-balance">
          Crie <span className="text-primary">flashcards inteligentes</span> em segundos
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto text-pretty leading-relaxed">
          Transforme qualquer conteúdo em flashcards personalizados com IA de última geração
        </p>
      </div>
    </section>
  )
}
