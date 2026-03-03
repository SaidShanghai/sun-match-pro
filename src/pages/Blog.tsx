import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  cover_image_url: string | null;
  published_at: string | null;
}

const TABS = [
  { value: null, label: "Tous" },
  { value: "guide", label: "Guides" },
  { value: "actualite", label: "Actualités" },
];

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

function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, cover_image_url, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filtered = filter ? posts.filter((p) => p.category === filter) : posts;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Blog NOORIA
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog NOORIA</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guides solaires et actualités pour les Marocains
            </p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setFilter(tab.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === tab.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">Aucun article disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    {post.cover_image_url ? (
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/30 to-amber-400/30 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary/40" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        {CATEGORY_BADGE[post.category] && (
                          <span
                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${CATEGORY_BADGE[post.category].className}`}
                          >
                            {CATEGORY_BADGE[post.category].label}
                          </span>
                        )}
                        {post.published_at && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lire la suite <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
