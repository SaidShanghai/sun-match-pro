import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import JsonLd from "@/components/seo/JsonLd";
import { buildArticleSchema } from "@/config/seoSchemas";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calendar, ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  cover_image_url: string | null;
  published_at: string | null;
  meta_description: string | null;
}

const CATEGORY_BADGE: Record<string, { label: string; className: string }> = {
  guide: { label: "Guide", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  actualite: { label: "Actualité", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, content, category, cover_image_url, published_at, meta_description")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (data) setPost(data as Post);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  // Set document title and meta description for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | NOORIA`;
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (metaDesc) {
        metaDesc.content = post.meta_description || (post.content?.substring(0, 155) + "…") || "";
      }
    }
    return () => {
      document.title = "NOORIA – Énergie Solaire au Maroc";
    };
  }, [post]);

  if (loading) {
    return (
      <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-3xl space-y-6">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
      </main>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <BookOpen className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-lg text-muted-foreground">Article introuvable</p>
          <Button asChild variant="outline">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour au blog
            </Link>
          </Button>
      </div>
    );
  }

  const badge = CATEGORY_BADGE[post.category];

  const articleSchema = buildArticleSchema(post);

  return (
    <>
      <JsonLd schema={articleSchema} />
      <main className="flex-1 pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Cover image */}
            {post.cover_image_url ? (
              <div className="rounded-2xl overflow-hidden mb-8 max-h-[400px]">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover max-h-[400px]"
                />
              </div>
            ) : (
              <div className="rounded-2xl mb-8 h-[300px] bg-gradient-to-br from-primary/30 to-amber-400/30 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/30" />
              </div>
            )}

            {/* Category + date */}
            <div className="flex items-center gap-3 mb-4">
              {badge && (
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                  {badge.label}
                </span>
              )}
              {post.published_at && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.published_at)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            {/* Meta description as subtitle */}
            {post.meta_description && (
              <p className="text-lg text-muted-foreground italic mb-6">{post.meta_description}</p>
            )}

            {/* Divider */}
            <hr className="border-border mb-8" />

            {/* Markdown content */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-li:my-1 prose-ul:my-4 prose-ol:my-4 prose-blockquote:my-6 prose-blockquote:border-primary/40 prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-strong:text-foreground prose-hr:my-8 prose-table:border-collapse prose-table:w-full prose-th:bg-muted prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-border prose-td:px-4 prose-td:py-2.5 prose-td:border prose-td:border-border prose-tr:even:bg-muted/40">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary to-amber-500 p-8 md:p-10 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Prêt à passer au solaire ?
              </h2>
              <p className="text-white/90 mb-6 max-w-lg mx-auto">
                Calculez gratuitement la rentabilité de votre projet avec SunGPT.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <Link to="/">Lancer mon diagnostic →</Link>
              </Button>
            </div>
          </motion.div>
        </article>
      </main>
    </>
  );
}
