// app/more/[id]/page.tsx
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  const baseUrl =
    apiUrl === "http://localhost:3000"
      ? "http://localhost:3000"
      : "https://communal-info-web-tv.vercel.app";

  return {
    title: article?.title || "Chargement...",
    description: article?.description || "Chargement de l’article...",
    openGraph: {
      title: article?.title,
      description: article?.description,
      url: `${baseUrl}/more/${id}`,
      type: "article",
      images: article?.media?.length ? [{ url: article.media[0].url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article?.title,
      description: article?.description,
      images: article?.media?.length ? [article.media[0].url] : [],
    },
  };
}

export default async function RedirectPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const res = await fetch(`${apiUrl}/articles/id/${id}`, { cache: "no-store" });
  const { data: article } = await res.json();

  // Sécurité au cas où l’article n’existe pas
  if (!article) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
          flexDirection: "column",
        }}
      >
        <p>Article introuvable</p>
      </div>
    );
  }

  return (
    <html>
      <body
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
          color: "#333",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "5px solid #ccc",
            borderTopColor: "#0070f3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        ></div>
        <p>Redirection en cours…</p>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                window.location.href = "/${encodeURIComponent(article.title)}";
              }, 800);
            `,
          }}
        />
      </body>
    </html>
  );
}
