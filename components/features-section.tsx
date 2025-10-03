"use client"

import { FileText, Link2, Type } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: FileText,
      title: t.featurePdf,
      description: t.featurePdfDesc,
    },
    {
      icon: Link2,
      title: t.featureUrl,
      description: t.featureUrlDesc,
    },
    {
      icon: Type,
      title: t.featureText,
      description: t.featureTextDesc,
    },
  ]

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-white/10 rounded-lg p-5 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
