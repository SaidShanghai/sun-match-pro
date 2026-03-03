import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff, Calendar, ExternalLink } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  author_name: string;
}

const CATEGORIES = [
  { value: "guide", label: "Guide" },
  { value: "actualite", label: "Actualité" },
  { value: "conseil", label: "Conseil" },
  { value: "temoignage", label: "Témoignage" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("guide");
  const [coverUrl, setCoverUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [authorName, setAuthorName] = useState("NOORIA");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("guide");
    setCoverUrl("");
    setIsPublished(false);
    setAuthorName("NOORIA");
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    setShowDialog(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setCategory(post.category);
    setCoverUrl(post.cover_image_url || "");
    setIsPublished(post.is_published);
    setAuthorName(post.author_name);
    setShowDialog(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editing) setSlug(slugify(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      category,
      cover_image_url: coverUrl.trim() || null,
      is_published: isPublished,
      published_at: isPublished ? (editing?.published_at || new Date().toISOString()) : null,
      author_name: authorName.trim() || "NOORIA",
    };

    try {
      if (editing) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Article modifié" });
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        toast({ title: "Article créé" });
      }
      setShowDialog(false);
      resetForm();
      await fetchPosts();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    setDeleting(id);
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Article supprimé" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Articles du blog</h2>
          <p className="text-sm text-muted-foreground">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Nouvel article
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun article. Cliquez sur "Nouvel article" pour commencer.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{post.title}</h3>
                      {post.is_published ? (
                        <Badge className="bg-green-500/10 text-green-600 gap-1">
                          <Eye className="w-3 h-3" /> Publié
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff className="w-3 h-3" /> Brouillon
                        </Badge>
                      )}
                      <Badge variant="outline">{CATEGORIES.find((c) => c.value === post.category)?.label || post.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{post.excerpt || "Pas d'extrait"}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      <span>/blog/{post.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {post.is_published && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)} disabled={deleting === post.id}>
                      {deleting === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="mon-article" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Auteur</Label>
                <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL image de couverture</Label>
              <Input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label>Extrait</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Résumé court de l'article..." />
            </div>

            <div className="space-y-2">
              <Label>Contenu (HTML) *</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} required placeholder="<p>Votre contenu ici...</p>" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <Label>Publier immédiatement</Label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
              <Button type="submit" disabled={saving || !title.trim() || !content.trim()}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editing ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
