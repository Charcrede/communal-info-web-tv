// app/[id]/page.tsx
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;

  // ✅ Utilise fetch (plus sûr côté serveur)
  const res = await fetch(`${apiUrl}/articles/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  // ✅ URL de base pour le partage
  const baseUrl =
    apiUrl === "http://localhost:3000"
      ? "http://localhost:3000"
      : "https://communal-info-web-tv.vercel.app";

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${baseUrl}/${id}`,
      type: "article",
      images: article.media?.length
        ? [{ url: article.media[0].url }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.media?.length
        ? [article.media[0].url]
        : [],
    },
  };
}

export default async function RedirectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await fetch(`${apiUrl}/articles/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  redirect(`/[title]/page?title=${encodeURIComponent(article.title)}`);
}
