"use client";
import { useState } from 'react';
import { Clock, User, Eye, EyeOff, Calendar, Play, Image as ImageIcon } from 'lucide-react';
import { Media } from '@/types/article';
import ImageGallery from './ImageGallery';
import { extractYouTubeId, getFileTypeByUrl } from '@/lib/utils';
import SocialIcon from './SocialIcons';

interface MediaCardProps {
    media: Media;
    index: number;
    showFullContent: boolean;
    onToggleContent: () => void;
}

export default function MediaCard({ media, index, showFullContent, onToggleContent }: MediaCardProps) {
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // le feedback disparaît après 2s
    };


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
    const mainImage = media;


    return (
        <>
            <article className="group">
                <div className="px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
                    {/* Meta information */}
                    <div className="m-2 my-4 flex flex-wrap items-center gap-4 mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                            <User className="w-4 h-4" />
                            <span className="font-medium">
                                {media?.creator?.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(media.created_at)}</span>
                        </div>

                    </div>
                    {/* description */}
                    <p className="lg:text-xl mx-2 text-base my-4 leading-tight transition-colors duration-300">
                        {media?.description}
                    </p>
                    {/* Image header */}
                    {mainImage && (
                        <div className="relative rounded-lg overflow-hidden w-full h-64">
                            <div
                                className="relative cursor-pointer"
                            >
                                {mainImage.type === 'image' ? (
                                    <img
                                        onClick={() => openGallery(0)}
                                        src={mainImage.url}
                                        alt={media.title}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : mainImage.type === 'video' && !mainImage.youtubeUrl ? (
                                    <video
                                        onClick={() => openGallery(0)}
                                        src={mainImage.url}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                        muted
                                        autoPlay
                                        loop
                                        controls={false}
                                    />
                                ) : mainImage.youtubeUrl ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${extractYouTubeId(mainImage.youtubeUrl)}`}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                                        title={media.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : null}

                            </div>

                        </div>
                    )}

                    <div className="flex gap-2 my-4">
                        {/* Bouton pour copier le lien */}
                        <button
                            onClick={handleCopy}
                            className="text-[#555] px-2 text-[14px] flex items-center gap-2 bg-gray-100 rounded-full p-1"
                        >
                            {copied ? "Lien copié" : "Copier le lien"}{" "}
                            <SocialIcon name="share" fill="#555" />
                        </button>

                        {/* Bouton pour partager sur Facebook */}
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${media.youtubeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline bg-gray-100 rounded-full p-1"
                        >
                            <SocialIcon name="facebook" fill="#555" />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?url=${media.youtubeUrl}&text=${encodeURIComponent(media.description)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline bg-gray-100 rounded-full p-1"
                        >
                            <SocialIcon name="twitter" fill='#555' />
                        </a>
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                media.description + "`\n " + media.youtubeUrl
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:underline bg-gray-100 rounded-full p-1"
                        >
                            <SocialIcon name="whatsapp" fill='#555' />
                        </a>
                    </div>

                </div>
            </article>

            {/* Image Gallery */}
            <ImageGallery
                images={[media]}
                isOpen={galleryOpen}
                onClose={() => setGalleryOpen(false)}
                initialIndex={selectedImageIndex}
            />
        </>
    );
}