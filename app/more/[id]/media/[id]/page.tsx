// app/more/[id]/page.tsx
import { notFound } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;

  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  if (!article) return { title: "Article introuvable" };

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

export default async function ArticlePreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  if (!article) return notFound();

  // Juste un petit HTML côté serveur pour que WhatsApp récupère les meta
  return (
    <html>
      <head>
        <title>{article.title}</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${apiUrl}/more/${id}`} />
        {article.media?.length && (
          <meta property="og:image" content={article.media[0].url} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        {article.media?.length && (
          <meta name="twitter:image" content={article.media[0].url} />
        )}
      </head>
      <body>
        <p>Redirection en cours…</p>
        <script>
          {`window.location.href = "/${encodeURIComponent(article.title)}";`}
        </script>
      </body>
    </html>
  );
}
