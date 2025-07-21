import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, Terminal, Sparkles, Github } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <div className="flex items-center gap-2">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-8 h-8 rounded-lg"
            style={{ objectFit: 'cover' }}
          >
            <source src="/hetty-animation.mp4" type="video/mp4" />
          </video>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hetty
          </span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-purple-600 transition-colors">
            Features
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-purple-600 transition-colors">
            About
          </Link>
          <Link href="https://github.com" className="text-sm font-medium hover:text-purple-600 transition-colors">
            GitHub
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Visual Model Cleanup Tool
                </Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Meet{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Hetty
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl lg:text-2xl">
                  The visual companion to henry. Clean up your old models with an intuitive interface that makes model
                  management effortless.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  asChild
                >
                  <Link href="/signin">
                    <Eye className="w-4 h-4 mr-2" />
                    Connect to Looker
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Terminal className="w-4 h-4" />
                <span>Inspired by henry CLI • Built for visual workflows</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Why Choose Hetty?</h2>
                              <p className="text-slate-600 md:text-lg max-w-2xl mx-auto">
                  While henry handles cleanup from the command line, Hetty brings visual clarity to your model management
                  workflow.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-2 hover:border-purple-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Visual Interface</CardTitle>
                  <CardDescription>
                    See your models at a glance with an intuitive visual interface that makes cleanup decisions easy.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-pink-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Trash2 className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle>Smart Cleanup</CardTitle>
                  <CardDescription>
                    Identify and remove outdated models with intelligent suggestions and batch operations.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-slate-200 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <Terminal className="h-6 w-6 text-slate-600" />
                  </div>
                  <CardTitle>Henry Compatible</CardTitle>
                  <CardDescription>
                    Works seamlessly alongside henry CLI, sharing configurations and maintaining consistency.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="outline">About Hetty</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Visual Model Management Made Simple
                  </h2>
                  <p className="text-slate-600 md:text-lg">
                    Hetty was born from the need to bring visual clarity to model cleanup workflows. While henry excels
                    at command-line operations, Hetty provides the visual interface that makes complex model management
                    tasks accessible to everyone.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Perfect for:</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Data scientists managing multiple model versions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Teams needing visual model oversight
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Organizations with complex model lifecycles
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-slate-400" />
                    <span className="font-mono text-sm text-slate-600">henry cleanup --dry-run</span>
                  </div>
                  <div className="text-center text-slate-400 text-sm">+</div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-purple-500" />
                    <span className="font-mono text-sm text-slate-600">Hetty visualize</span>
                  </div>
                  <div className="text-center text-slate-400 text-sm">=</div>
                  <div className="text-center">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Perfect Model Management
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 text-center text-white">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Clean Up Your Models?
              </h2>
              <p className="mx-auto max-w-[600px] md:text-lg opacity-90">
                Join the growing community of developers who trust Hetty for visual model management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signin">
                    <Eye className="w-4 h-4 mr-2" />
                    Connect to Looker
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Star on GitHub
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-slate-500">© 2024 Hetty. Built with ❤️ for the model management community.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-500">
            Documentation
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-500">
            GitHub
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-slate-500">
            Issues
          </Link>
        </nav>
      </footer>
    </div>
  )
}
