"use client";
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '@/types/article';
import { getFileTypeByUrl } from '@/lib/utils';

interface ImageGalleryProps {
  images: MediaItem[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function ImageGallery({ images, isOpen, onClose, initialIndex = 0 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const imgUrl = process.env.NEXT_PUBLIC_IMAGE_API

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!isOpen || images.length === 0) return null;

  const currentMedia = images[currentIndex];

  return (
    <div className="fixed -top-8 bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
        <div className="text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-3 rounded-full hover:bg-white/10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-3 rounded-full hover:bg-white/10"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center h-full p-4 pt-16 pb-24">
        {currentMedia.type === 'video' ? (
          <video
            controls
            className="max-w-full max-h-full object-contain"
            autoPlay
          >
            <source src={`${imgUrl}${currentMedia.url}`} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        ) : (
          <img
            src={`${imgUrl}${currentMedia.url}`}
            alt={currentMedia.url.split(".")[0] || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-center gap-2 overflow-x-auto max-w-full">
            {images.map((media, index) => (
              <button
                key={media.url.split(".")[0]}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent hover:border-gray-400'
                  }`}
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <video
                          src={`${imgUrl}${media.url}`}
                          className="w-full h-full object-cover"
                          muted
                        />
                  </div>
                ) : (
                  <img
                    src={`${imgUrl}${media.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}