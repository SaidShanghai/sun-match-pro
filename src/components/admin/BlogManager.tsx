import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Edit, Trash2, Loader2, Eye, EyeOff, Calendar,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  cover_image_url: string | null;
  meta_description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  author_name: string;
}

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

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("guide");
  const [coverUrl, setCoverUrl] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

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
    setTitle(""); setSlug(""); setExcerpt(""); setContent("");
    setCategory("guide"); setCoverUrl(""); setMetaDescription("");
    setIsPublished(false); setEditing(null);
  };

  const openNew = () => { resetForm(); setShowDialog(true); };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setCategory(post.category);
    setCoverUrl(post.cover_image_url || "");
    setMetaDescription(post.meta_description || "");
    setIsPublished(post.is_published);
    setShowDialog(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editing) setSlug(slugify(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Record<string, any> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      category,
      cover_image_url: coverUrl.trim() || null,
      meta_description: metaDescription.trim() || null,
      is_published: isPublished,
      published_at: isPublished
        ? (editing?.published_at || new Date().toISOString())
        : null,
      author_name: "NOORIA",
    };

    try {
      if (editing) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload as any);
        if (error) throw error;
      }
      toast({ title: "Article enregistré ✓" });
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
          <h2 className="text-xl font-semibold">Gestion des articles</h2>
          <p className="text-sm text-muted-foreground">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
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
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de publication</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {post.category === "guide" ? "Guide" : "Actualité"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.is_published ? (
                      <Badge className="bg-green-500/10 text-green-600 gap-1">
                        <Eye className="w-3 h-3" /> Publié
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <EyeOff className="w-3 h-3" /> Brouillon
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("fr-FR")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => openEdit(post)}>
                        <Edit className="w-4 h-4 mr-1" /> Modifier
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" disabled={deleting === post.id}>
                            {deleting === post.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <><Trash2 className="w-4 h-4 mr-1" /> Supprimer</>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. L'article « {post.title} » sera définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
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

            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="actualite">Actualité</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Extrait</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Résumé court de l'article..." />
            </div>

            <div className="space-y-2">
              <Label>Meta description <span className="text-xs text-muted-foreground">({metaDescription.length}/160)</span></Label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
                rows={2}
                placeholder="Description SEO (max 160 caractères)..."
                maxLength={160}
              />
            </div>

            <div className="space-y-2">
              <Label>URL image de couverture</Label>
              <Input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label>Contenu en Markdown *</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} required placeholder="## Mon titre&#10;&#10;Votre contenu ici..." />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <Label>Publier l'article</Label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Annuler</Button>
              <Button type="submit" disabled={saving || !title.trim() || !content.trim()}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
