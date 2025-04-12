import Link from "next/link"
import { ArrowRight, Image as ImageIcon } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="drwpp-hero">
        <div className="container px-6 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl uppercase tracking-widest mb-8 font-normal">
            Créez en toute simplicité
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            Créez, Visualisez et Personnalisez vos produits préférés
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/products/canvas" className="drwpp-btn drwpp-btn-primary">
              Créer mon canvas <ArrowRight className="ml-2 h-4 w-4 inline" />
            </Link>
            <Link href="#how-it-works" className="drwpp-btn drwpp-btn-outline">
              En savoir plus
            </Link>
          </div>

          <div className="relative w-full max-w-5xl mx-auto overflow-hidden mt-16 shadow-xl rounded-lg">
            <img 
              src="/images/editor-preview.jpg" 
              alt="DRWPP Editor Preview" 
              className="w-full h-auto rounded-lg" 
            />
          </div>
        </div>
      </section>

      {/* Products Section - Temporairement masqué */}
      {/* <section id="products" className="drwpp-section bg-white py-20">
        <div className="container px-6 max-w-6xl mx-auto">
          <h2 className="drwpp-section-title mb-16">
            CRÉEZ VOTRE CANVAS PERSONNALISÉ
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl border border-blue-100">
              <div className="aspect-w-16 aspect-h-9 bg-blue-50 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon size={100} className="text-blue-300" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-3">Canvas Personnalisé</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Créez votre propre œuvre d'art sur toile avec notre éditeur de canvas. Choisissez parmi différents formats et tailles pour créer un tableau unique qui vous ressemble.
                </p>
                <div className="flex justify-center">
                  <Link href="/products/canvas" className="inline-flex items-center justify-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-lg font-medium transition-colors">
                    Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-gray-500">
              <p>D'autres produits personnalisables seront bientôt disponibles.</p>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* About Section */}
      <section className="drwpp-section bg-secondary">
        <div className="container px-6 max-w-5xl mx-auto">
          <h2 className="drwpp-section-title">
            STUDIO
          </h2>
          <p className="text-center max-w-3xl mx-auto text-lg leading-relaxed mb-16">
            Drwpp Studio est la solution tout-en-un pour la personnalisation et la production de Wall Art. 
            Que vous soyez une marque émergente, une entreprise ou un particulier, notre plateforme vous permet 
            de créer et de visualiser vos produits en quelques clics.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border border-foreground flex items-center justify-center mb-8">
                <span className="text-xl font-light">01</span>
              </div>
              <h3 className="uppercase tracking-widest text-lg mb-4 font-normal">Importez</h3>
              <p className="text-center font-light">Téléchargez votre design ou votre image préférée</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border border-foreground flex items-center justify-center mb-8">
                <span className="text-xl font-light">02</span>
              </div>
              <h3 className="uppercase tracking-widest text-lg mb-4 font-normal">Personnalisez</h3>
              <p className="text-center font-light">Ajustez, redimensionnez et positionnez votre design</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border border-foreground flex items-center justify-center mb-8">
                <span className="text-xl font-light">03</span>
              </div>
              <h3 className="uppercase tracking-widest text-lg mb-4 font-normal">Prévisualisez</h3>
              <p className="text-center font-light">Visualisez votre création dans différents environnements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="drwpp-section bg-secondary">
        <div className="container px-6 max-w-6xl mx-auto">
          <h2 className="drwpp-section-title">
            GALERIE
          </h2>
          <p className="text-center max-w-3xl mx-auto text-lg leading-relaxed mb-12">
            Découvrez des exemples de créations réalisées avec notre plateforme
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="overflow-hidden shadow-lg rounded-lg transition-transform duration-300 hover:scale-[1.02] aspect-square">
              <img 
                src="/images/wall-art-1.jpg" 
                alt="Wall Art Abstrait" 
                className="w-full h-full object-cover rounded-lg" 
              />
            </div>
            <div className="overflow-hidden shadow-lg rounded-lg transition-transform duration-300 hover:scale-[1.02] aspect-square">
              <img 
                src="/images/wall-art-2.jpg" 
                alt="Wall Art Géométrique" 
                className="w-full h-full object-cover rounded-lg" 
              />
            </div>
            <div className="overflow-hidden shadow-lg rounded-lg transition-transform duration-300 hover:scale-[1.02] aspect-square">
              <img 
                src="/images/wall-art-3.jpg" 
                alt="Wall Art Minimaliste" 
                className="w-full h-full object-cover rounded-lg" 
              />
            </div>
            <div className="overflow-hidden shadow-lg rounded-lg transition-transform duration-300 hover:scale-[1.02] aspect-square">
              <img 
                src="/images/wall-art-4.jpg" 
                alt="Wall Art Typographique" 
                className="w-full h-full object-cover rounded-lg" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="drwpp-section">
        <div className="container px-6 max-w-4xl mx-auto text-center">
          <h2 className="drwpp-section-title">
            CRÉEZ, VISUALISEZ ET COMMANDEZ
          </h2>
          <p className="max-w-2xl mx-auto mb-10 font-light">
            Commencez à personnaliser votre Wall Art aujourd'hui et transformez vos espaces avec des créations uniques.
          </p>
          <Link href="/editor" className="drwpp-btn drwpp-btn-primary">
            VISITEZ L'ÉDITEUR
          </Link>
        </div>
      </section>
      
      {/* Footer - Design noir */}
      <footer className="mt-24 bg-black text-white py-16">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="flex flex-col space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-2xl font-light tracking-wider mb-6 md:mb-0">DRWPP</h2>
              
              <div className="flex space-x-8">
                <Link href="/" className="text-xs tracking-widest text-neutral-300 hover:text-white transition-colors">ACCUEIL</Link>
                <Link href="/editor" className="text-xs tracking-widest text-neutral-300 hover:text-white transition-colors">ÉDITEUR</Link>
                <Link href="/preview" className="text-xs tracking-widest text-neutral-300 hover:text-white transition-colors">PREVIEW</Link>
                <Link href="#" className="text-xs tracking-widest text-neutral-300 hover:text-white transition-colors">CONTACT</Link>
              </div>
            </div>
            
            <div className="border-t border-neutral-800 pt-10 flex flex-col md:flex-row justify-between items-center">
              <div className="md:w-1/3"></div> {/* Espace vide à gauche */}
              <p className="text-xs text-neutral-400 mb-4 md:mb-0 md:w-1/3 text-center">
                © {new Date().getFullYear()} DRWPP. Tous droits réservés.
              </p>
              
              <div className="flex space-x-6 md:w-1/3 justify-end">
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

