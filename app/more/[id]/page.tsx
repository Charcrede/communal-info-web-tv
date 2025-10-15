// app/more/[id]/page.tsx
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log("generateMetadata id:", id);

  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

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
      url: `${baseUrl}/more/${id}`,
      type: "article",
      images: article.media?.length ? [{ url: article.media[0].url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: article.media?.length ? [article.media[0].url] : [],
    },
  };
}

export default async function RedirectPage({ params }: { params: { id: string } }) {
  const baseUrl =
    apiUrl === "http://localhost:3000"
      ? "http://localhost:3001"
      : "https://communal-info-web-tv.vercel.app";

  const { id } = params;
  console.log("RedirectPage id:", id);

  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  // Redirection vers une URL propre avec le titre
  redirect(`${baseUrl}/${encodeURIComponent(article.title)}`);
}
