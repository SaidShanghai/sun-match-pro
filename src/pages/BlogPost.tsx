import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Calendar, ArrowLeft, User, BookOpen } from "lucide-react";
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
  author_name: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      if (data) setPost(data as Post);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <BookOpen className="w-12 h-12 text-muted-foreground/40" />
          <p className="text-lg text-muted-foreground">Article introuvable</p>
          <Link to="/blog" className="text-primary font-medium hover:underline">
            ← Retour au blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4" /> Retour au blog
            </Link>

            {post.cover_image_url && (
              <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
                <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {post.author_name}
              </span>
              {post.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

            {/* Render content as HTML or plain text */}
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
