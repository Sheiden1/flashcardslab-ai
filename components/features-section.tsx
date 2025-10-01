import { FileText, Link2, Upload, Type } from "lucide-react"  // important thing //

const features = [
  {
    icon: FileText,
    title: "PDF",
    description: "Envie PDFs e extraia conceitos automaticamente",
  },
  {
    icon: Link2,
    title: "URL",
    description: "Cole links de artigos ou páginas web",
  },
  {
    icon: Upload,
    title: "Documentos",
    description: "Word, PowerPoint e outros formatos",
  },
  {
    icon: Type,
    title: "Texto",
    description: "Digite ou cole qualquer texto",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
