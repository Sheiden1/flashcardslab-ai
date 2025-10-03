"use client"

import { Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">{t.badge}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-balance">
          {t.headline} <span className="text-primary">{t.headlineHighlight}</span> {t.headlineSuffix}
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto text-pretty leading-relaxed">
          {t.subtitle}
        </p>
      </div>
    </section>
  )
}
