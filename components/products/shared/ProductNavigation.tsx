"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Image as ImageIcon, Home } from "lucide-react"

export default function ProductNavigation() {
  const pathname = usePathname()
  
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl flex items-center">
              <Home className="mr-2 h-5 w-5" />
              DRWPP STUDIO
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/products/canvas" 
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname?.includes('/products/canvas') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ImageIcon className="mr-2 h-5 w-5" />
              Éditeur de Canvas
            </Link>
            
            <Link 
              href="#" 
              className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={(e) => {
                e.preventDefault()
                alert('Fonctionnalité à venir dans une prochaine version')
              }}
            >
              Panier
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
