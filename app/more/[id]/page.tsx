// app/[id]/page.tsx
import { redirect } from "next/navigation";
import axios from "axios";
import { Article } from "@/types/article";

const apiUrl = process.env.NEXT_PUBLIC_API;
let art : Article;
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: article } = await axios.get(`${apiUrl}/articles/${id}`);
    art = article?.data;
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${window.location.origin}/${id}`,
      images: article.media,
      type: "article",
    },
  };
}

export default async function RedirectPage({ params }: { params: { id: string } }) {
  // Redirige vers la vraie page interactive (client-side)
  redirect(`/[title]/page?title=${encodeURIComponent(art.title)}`);
}
