"use client"

import { Layers, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-white">{t.brand}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "pt" ? "Português" : "English"}</span>
                <span className="sm:hidden">{language.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-white/10">
              <DropdownMenuItem
                onClick={() => setLanguage("pt")}
                className={`cursor-pointer ${language === "pt" ? "bg-primary/10 text-primary" : "text-gray-300"}`}
              >
                🇧🇷 Português (BR)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className={`cursor-pointer ${language === "en" ? "bg-primary/10 text-primary" : "text-gray-300"}`}
              >
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
