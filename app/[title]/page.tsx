"use client";
import { useEffect, useState } from "react";
import { ArrowDown, Clock, Loader2 } from "lucide-react";
import { Article } from "@/types/article";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
    
export default function ArticlePage({ params }: { params: { title: string } }) {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set());
    const apiUrl = process.env.NEXT_PUBLIC_API;
  
  const title = decodeURIComponent(params.title);

  const fetchArticles = async (pageNum: number = 1) => {
    setLoading(true);
    let respArts: Article 
    const response = await axios.get(`${apiUrl}/articles/${title}`).then((resp) => {
      setLoading(false)
      console.log(resp?.data?.data)
      respArts = resp?.data?.data
        setArticle(respArts || null);
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
    <>
    <div className=" mt-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {loading && article === null ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#074020] dark:text-[#4ade80]" />
              </div>
            ) : (
              <div className="space-y-8">
                {article && (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={0}
                    showFullContent={expandedArticles.has(article.id)}
                    onToggleContent={() => toggleArticleExpansion(article.id)}
                  />
                )}
              </div>
            )}
          </div>

          <Sidebar currentCategory="la-voix-du-maire" toExclude={'la-voix-du-maire'}/>
        </div>
      </div>
    </div>
    </>
  );
}