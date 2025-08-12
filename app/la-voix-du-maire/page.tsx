"use client";
import { useEffect, useState } from "react";
import { ArrowDown, Clock, Loader2 } from "lucide-react";
import { Article } from "@/types/article";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import axios from "axios";
import { getToken } from "@/lib/utils";

export default function LaVoixDuMairePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set());
  const apiUrl = process.env.NEXT_PUBLIC_API;

  const fetchArticles = async (pageNum: number = 1) => {
    setLoading(true);
    let respArts: Article[] = [];
    const response = await axios.get(`${apiUrl}/articles/?rubric=maire`).then((resp) => {
      setLoading(false)
      respArts = resp?.data?.data
      if (resp?.data?.pages === 1 || resp?.data?.current === 1) {
        setArticles(respArts);
        setHasMore(resp?.data?.current_page < resp?.data?.last_page);
      } else {
        setArticles(prev => [...prev, ...respArts]);
      }
    });

    setHasMore(pageNum < 3);
    setLoading(false);
  };

  const fetchMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchArticles(nextPage);
  };


  useEffect(() => {
    fetchArticles();
  }, []);

  const toggleArticleExpansion = (articleId: number) => {
    setExpandedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="lg:text-5xl text-3xl font-bold text-[#074020] dark:text-[#4ade80] mb-4 tracking-wide">
              LA VOIX DU MAIRE
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#074020] to-[#940806] mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Messages et actualités directement du bureau du maire
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {loading && articles.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#074020] dark:text-[#4ade80]" />
              </div>
            ) : (
              <div className="space-y-8">
                {articles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={index}
                    showFullContent={expandedArticles.has(article.id)}
                    onToggleContent={() => toggleArticleExpansion(article.id)}
                  />
                ))}

                {(loading) && articles.length > 0 && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#074020] dark:text-[#4ade80]" />
                  </div>
                )}

                {!hasMore && articles.length > 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm">
                      <Clock className="w-4 h-4" />
                      <span>Vous avez vu tous les articles</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <button onClick={()=>{fetchMore()}} className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm">
                      <ArrowDown className="w-4 h-4" />
                      <span>Voir plus d'articles</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Sidebar currentCategory="la-voix-du-maire" toExclude={'maire'}/>
        </div>
      </div>
    </div>
  );
}