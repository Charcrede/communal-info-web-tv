"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Tag } from 'lucide-react';
import { Article, Rubric } from '@/types/article';
import axios from 'axios';
import { formatDate, getFileTypeByUrl } from '@/lib/utils';

interface SidebarProps {
  currentCategory?: string;
  toExclude: string;
}

export default function Sidebar({ currentCategory, toExclude }: SidebarProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Rubric[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API;
  const imgUrl = process.env.NEXT_PUBLIC_IMAGE_API

  const fetchArticles = async () => {
    let respArts: Article[] = [];
    const response = await axios.get(`${apiUrl}/articles/?exclude_rubric=${toExclude}&per_page=4`).then((resp) => {
      respArts = resp?.data?.data?.data
      setRelatedArticles(respArts);
    });

  };
  // Mock data for demonstration
  useEffect(() => {
    const mockCategories: Rubric[] = [
      { id: 1, name: "La Voix du Maire", slug: "la-voix-du-maire", description: "Actualités du maire" },
      { id: 2, name: "Conseil Communal", slug: "la-voix-du-conseil", description: "Décisions du conseil" },
      { id: 3, name: "Conseiller Local", slug: "la-voix-du-conseiller-local", description: "Initiatives locales" },
      { id: 4, name: "Publi-Reportage", slug: "publi-reportage", description: "Reportages spéciaux" },
    ];

    fetchArticles()
    setCategories(mockCategories);
  }, [currentCategory]);

  return (
    <aside className="lg:w-80 w-full space-y-8">
            {/* Related Articles */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#940806] dark:text-[#ff6b6b]" />
          Autres actualités
        </h3>
        <div className="space-y-4">
          {relatedArticles.map((article, index) => (
            <div key={`${article.id}-${index}`} className="group cursor-pointer">
              <div className="flex gap-3">
                {article.media && (() => {
                  const firstMedia = article.media[0];
                  const ext = firstMedia.type;

                  return firstMedia ? (
                    <div className="flex-shrink-0">
                      {ext == "video" ? (
                        <video
                          src={`${firstMedia.url}`}
                          className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          muted
                          loop
                        />
                      ) : (
                        <img
                          src={`${firstMedia.url}`}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  ) : null;
                })()}

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-2 group-hover:text-[#074020] dark:group-hover:text-[#4ade80] transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                  <div className="text-xs text-[#074020] dark:text-[#4ade80] font-medium mt-1">
                    {article.rubric.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#074020] dark:text-[#4ade80]" />
          Rubriques
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className={`block p-3 rounded-xl transition-all duration-300 group ${currentCategory === category.slug
                  ? 'bg-gradient-to-r from-[#074020] to-[#074020]/80 text-white shadow-lg'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              <div className="font-semibold text-sm uppercase tracking-wide">
                {category.name}
              </div>
              {category.description && (
                <div className="text-xs opacity-80 mt-1">
                  {category.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>



      {/* Newsletter Signup */}
      {/* <div className="bg-gradient-to-br from-[#074020] to-[#940806] rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Restez informé</h3>
        <p className="text-sm opacity-90 mb-4">
          Recevez les dernières actualités de votre commune directement dans votre boîte mail.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Votre email"
            className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="w-full bg-white text-[#074020] font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
            S'abonner
          </button>
        </div>
      </div> */}
    </aside>
  );
}