import { useState } from "react";
import  SocialIcon  from "./SocialIcons";
import { Article } from "@/types/article";

export default function ShareButtons({ article }: { article: Article }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/more/${article.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset après 2s
    } catch (err) {
      console.error("Erreur copie lien :", err);
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      {/* Copier le lien */}
      <button
        onClick={handleCopy}
        className="text-[#555] dark:text-gray-200 px-2 text-[14px] flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1"
      >
        {copied ? "Lien copié !" : "Partager"} <SocialIcon name="share" fill="#555"/>
      </button>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline bg-gray-100 dark:bg-gray-800 rounded-full p-1"
      >
        <SocialIcon name="facebook" fill="#555" />
      </a>

      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(article.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 dark:text-blue-300 hover:underline bg-gray-100 dark:bg-gray-800 rounded-full p-1"
      >
        <SocialIcon name="twitter" fill="#555" />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + "\n\n" + link)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#555] dark:text-green-400 hover:underline bg-gray-100 dark:bg-gray-800 rounded-full p-1"
      >
        <SocialIcon name="whatsapp" fill="#555" />
      </a>
    </div>
  );
}
