"use client";
import { useState } from 'react';
import { Clock, User, Eye, EyeOff, Calendar, Play, Image as ImageIcon } from 'lucide-react';
import { Article } from '@/types/article';
import ImageGallery from './ImageGallery';
import { getFileTypeByUrl } from '@/lib/utils';
import SocialIcon from './SocialIcons';

interface ArticleCardProps {
  article: Article;
  index: number;
  showFullContent: boolean;
  onToggleContent: () => void;
}

export default function ArticleCard({ article, index, showFullContent, onToggleContent }: ArticleCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imgUrl = process.env.NEXT_PUBLIC_IMAGE_API

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours > 0) return `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
      if (diffMin > 0) return `il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
      return "à l'instant";
    }

    if (diffDays === 1) {
      return `Hier à ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    }

    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openGallery = (imageIndex: number = 0) => {
    console.log(mainImage?.url)
    setSelectedImageIndex(imageIndex);
    setGalleryOpen(true);
  };
  const mainImage = article.media.length > 0 ? article.media[0] : null;

  const hasMultipleImages = article.media.length > 1;

  return (
    <>
      <article className="group">
        <div className="px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
          {/* Title */}
          <h2 className="lg:text-3xl text-2xl m-4 font-bold text-[#074020] dark:text-[#ff6b6b] mb-6 leading-tight group-hover:text-[#940806] dark:group-hover:text-[#4ade80] transition-colors duration-300">
            {article?.title}
          </h2>
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
              <User className="w-4 h-4" />
              <span className="font-medium">
                {article?.creator?.name}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            {article.rubric && (
              <div className="flex items-center gap-2 bg-[#074020]/10 dark:bg-[#074020]/20 text-[#074020] dark:text-[#074020] px-3 py-1 rounded-full">
                <span className="font-medium">{article.rubric.name}</span>
              </div>
            )}
          </div>
          {/* Image header */}
          {mainImage && (
            <div className="relative overflow-hidden w-full h-64">
              <div
                className="relative cursor-pointer"
                onClick={() => openGallery(0)}
              >
                {mainImage.type === 'image' ? (
                  <img
                    src={`${mainImage.url}`}
                    alt={article.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : mainImage.type === 'video' ? (
                  <video
                    src={`${mainImage.url}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                    muted
                    autoPlay
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {hasMultipleImages && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <ImageIcon size={14} />
                    {article.media.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {article.media.slice(1, 4).map((media, idx) => (
                    <button
                      key={media.url.split(".")[0]}
                      onClick={() => openGallery(idx + 1)}
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/80 hover:border-white transition-all hover:scale-110"
                    >
                      {media.type === 'image' ? (
                        <img
                          src={`${media.url}`}
                          alt={`Preview ${idx + 2}`}
                          className="w-full h-full object-cover"
                        />
                      ) : media.type === 'video' ? (
                        <video
                          onClick={() => { console.log(mainImage.url) }}
                          src={`${media.url}`}
                          className="w-full h-full object-cover"
                          muted
                          autoPlay
                          loop
                        />
                      ) : null}
                    </button>
                  ))}

                  {article.media.length > 4 && (
                    <button
                      onClick={() => openGallery(4)}
                      className="w-12 h-12 rounded-lg bg-black/70 text-white flex items-center justify-center text-xs font-bold border-2 border-white/80 hover:border-white transition-all hover:scale-110"
                    >
                      +{article.media.length - 4}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555] px-2 hover:underline text-[14px] flex items-center gap-2 bg-gray-100 rounded-full p-1"
            >
              Partager <SocialIcon name="share" fill='#555'/>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline bg-gray-100 rounded-full p-1"
            >
              <SocialIcon name="facebook" fill='#555'/>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                window.location.origin + "/more/" + article.id
              )}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline bg-gray-100 rounded-full p-1"
            >
              <SocialIcon name="twitter" fill='#555'/>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                article.title + " " + window.location.origin + "/more/" + article.id
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:underline bg-gray-100 rounded-full p-1"
            >
              <SocialIcon name="whatsapp" fill='#555'/>
            </a>
          </div>

          {/* Content */}
          <div className="py-4">

            {/* Content */}
            <div className='mb-4'>
              <p className='italic font-semibold text-gray-600'>{article.head}</p>
            </div>
            <div className="relative">
              <p className={`text-gray-700 no-select no-copy dark:text-gray-300 leading-relaxed text-lg transition-all duration-500 ${showFullContent
                ? 'max-h-none'
                : 'max-h-24 overflow-hidden'
                }`}>
                {article.content}
              </p>

              {/* Gradient overlay for truncated text */}
              {!showFullContent && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
              )}
            </div>

            {/* Read more/less button */}
            <div className="mt-6">
              <button
                onClick={onToggleContent}
                className="inline-flex items-center gap-2 text-[#074020] dark:text-[#4ade80] hover:text-[#940806] dark:hover:text-[#ff6b6b] font-semibold transition-colors duration-300 group/btn"
              >
                {showFullContent ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Voir moins
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Lire la suite
                  </>
                )}
                <div className="w-0 group-hover/btn:w-6 h-0.5 bg-current transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Image Gallery */}
      <ImageGallery
        images={article.media}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}