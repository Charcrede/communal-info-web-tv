"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: 'Communal Admin - Système d\'administration',
//   description: 'Interface d\'administration pour la gestion de contenu communal',
// };

const navItems = [
  { name: "La Voix du Maire", path: "/la-voix-du-maire" },
  { name: "La Voix du Conseil Communal", path: "/conseil" },
  { name: "La Voix du Conseiller Local", path: "/conseiller" },
  { name: "Publi-Reportage", path: "/publi-reportage" },
  { name: "Médias", path: "/medias" }
];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <html lang="fr">
      <body className="antialiased min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans transition-colors duration-300">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl py-3' 
            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg py-4'
        }`}>
          <div className="max-w-9xl mx-auto px-6 flex justify-between items-center">
            
            <Link 
              className="hover:scale-105 transition-all duration-300 flex items-center gap-3 group" 
              href={'/'}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300  bg-white flex items-center justify-center">
                  <img src="logo.png" alt="logo" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#074020]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className={`font-bold text-gray-800 dark:text-white group-hover:text-[#074020] dark:group-hover:text-[#4ade80] transition-all duration-300 ${
                  scrolled ? 'lg:text-2xl text-xl' : 'lg:text-3xl text-2xl'
                }`}>
                  COMMUNAL INFO
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">WEB TV</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              <button 
                className="lg:hidden relative z-10 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    size={24} 
                    className={`absolute inset-0 transition-all duration-300 text-gray-700 dark:text-gray-300 ${
                      menuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                    }`} 
                  />
                  <X 
                    size={24} 
                    className={`absolute inset-0 transition-all duration-300 text-gray-700 dark:text-gray-300 ${
                      menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                    }`} 
                  />
                </div>
              </button>
            </div>
          
            <nav className="hidden lg:block">
              <ul className="flex items-center space-x-2">
                {navItems.map(({ name, path }) => (
                  <li key={path} className="relative group">
                    <Link 
                      href={path} 
                      className={`relative px-4 py-2 text-sm font-semibold uppercase transition-all duration-300 rounded-xl overflow-hidden ${
                        pathname === path 
                          ? 'text-white bg-gradient-to-r from-[#074020] to-[#074020]/80 shadow-lg' 
                          : 'text-gray-700 dark:text-gray-300 hover:text-[#074020] dark:hover:text-[#4ade80] hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="relative z-10">{name}</span>
                      {pathname !== path && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#074020]/10 to-[#940806]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-500 overflow-hidden ${
            menuOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-2xl">
              <nav className="p-6">
                <ul className="space-y-2">
                  {navItems.map(({ name, path }, index) => (
                    <li 
                      key={path} 
                      className={`transform transition-all duration-500 ${
                        menuOpen 
                          ? 'translate-x-0 opacity-100' 
                          : 'translate-x-full opacity-0'
                      }`}
                      style={{
                        transitionDelay: menuOpen ? `${index * 100}ms` : '0ms'
                      }}
                    >
                      <Link 
                        href={path}
                        onClick={handleLinkClick}
                        className={`block px-4 py-3 text-lg font-semibold uppercase transition-all duration-300 rounded-xl ${
                          pathname === path 
                            ? 'text-white bg-gradient-to-r from-[#074020] to-[#074020]/80 shadow-lg transform scale-105' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-[#074020] dark:hover:text-[#4ade80] hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-2'
                        }`}
                      >
                        {name}
                        {pathname === path && (
                          <div className="inline-block ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <div className="h-20"></div>

        <main className="relative">
          <div className="animate-fade-in">
            {children}
          </div>
          
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#074020] via-[#940806] to-[#074020] z-40"></div>
        </main>

        <footer className="mt-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <img src="logo.png" alt="logo" />
              </div>
              <span className="text-xl font-bold">COMMUNAL INFO WEB TV</span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre source d'information communale de confiance
            </p>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-[#074020] to-[#940806] mx-auto rounded-full"></div>
          </div>
        </footer>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}