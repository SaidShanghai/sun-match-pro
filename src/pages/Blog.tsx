import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  cover_image_url: string | null;
  published_at: string | null;
  author_name: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  guide: "Guide",
  actualite: "Actualité",
  conseil: "Conseil",
  temoignage: "Témoignage",
};

const CATEGORY_COLORS: Record<string, string> = {
  guide: "bg-primary/10 text-primary",
  actualite: "bg-blue-500/10 text-blue-600",
  conseil: "bg-amber-500/10 text-amber-600",
  temoignage: "bg-green-500/10 text-green-600",
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, cover_image_url, published_at, author_name")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filtered = filter ? posts.filter((p) => p.category === filter) : posts;
  const categories = [...new Set(posts.map((p) => p.category))];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Guides & Actualités <span className="text-primary">Solaire</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur l'énergie solaire au Maroc : guides pratiques, aides financières et actualités du secteur.
            </p>
          </motion.div>

          {/* Filters */}
          {categories.length > 1 && (
            <div className="flex justify-center gap-2 mb-10 flex-wrap">
              <button
                onClick={() => setFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !filter ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Tous
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>
          )}

          {/* Posts grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">Aucun article publié pour le moment.</p>
              <p className="text-sm mt-1">Revenez bientôt !</p>
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
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary/30" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || "bg-muted text-muted-foreground"}`}>
                          {CATEGORY_LABELS[post.category] || post.category}
                        </span>
                        {post.published_at && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
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
                        Lire l'article <ArrowRight className="w-3.5 h-3.5" />
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
