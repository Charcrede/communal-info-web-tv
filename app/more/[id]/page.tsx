// app/more/[id]/page.tsx
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log("generateMetadata id:", id);

  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  if (!article) {
    return {
      title: "Article introuvable",
      description: "Cet article n'existe pas.",
    };
  }

  const baseUrl =
    apiUrl === "http://localhost:3000"
      ? "http://localhost:3000"
      : "https://communal-info-web-tv.vercel.app";

  const ogImage =
    article.media?.length && article.media[0].url
      ? article.media[0].url
      : `${baseUrl}/logo.png`;

  return {
    title: article.title,
    description: article.description || "",
    openGraph: {
      title: article.title,
      description: article.description || "",
      url: `${baseUrl}/more/${id}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || "",
      images: [ogImage],
    },
  };
}

export default async function RedirectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log("RedirectPage id:", id);

  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  if (!article) {
    // Redirige vers la page d'accueil si article introuvable
    redirect("/");
  }

  const baseUrl =
    apiUrl === "http://localhost:3000"
      ? "http://localhost:3001"
      : "https://communal-info-web-tv.vercel.app";

  // Redirection vers URL avec le titre encodé
  redirect(`${baseUrl}/${encodeURIComponent(article.title)}`);
}
