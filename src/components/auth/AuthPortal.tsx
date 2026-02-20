import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sun, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AuthPortal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/profil",
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Connexion Google échouée", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin + "/profil",
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Connexion Apple échouée", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      if (forgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setResetSent(true);
        toast({ title: "Email envoyé", description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe." });
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/profil" },
        });
        if (error) throw error;
        toast({ title: "Vérifiez votre email", description: "Un lien de confirmation vous a été envoyé." });
      }
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Une erreur est survenue", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-2">
              <Sun className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {forgotPassword ? "Mot de passe oublié" : isLogin ? "Connexion" : "Créer mon compte"}
            </CardTitle>
            <CardDescription>
              {forgotPassword
                ? "Entrez votre email pour recevoir un lien de réinitialisation"
                : isLogin
                  ? "Accédez à votre espace NOORIA"
                  : "Rejoignez NOORIA et gérez vos projets solaires"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!forgotPassword && (
              <>
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-3"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center gap-3 bg-foreground text-background hover:bg-foreground/80 hover:text-background border-foreground"
                    onClick={handleAppleSignIn}
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.04 1.21-2.02 3.62.03 2.88 2.51 3.84 2.54 3.85l-.07.15zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continuer avec Apple
                  </Button>
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">ou</span>
                  </div>
                </div>
              </>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="vous@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              {!forgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading || (forgotPassword && resetSent)}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                {forgotPassword ? (resetSent ? "Email envoyé ✓" : "Envoyer le lien") : isLogin ? "Se connecter" : "Créer mon compte"}
              </Button>
            </form>
            <div className="mt-6 text-center space-y-2">
              {isLogin && !forgotPassword && (
                <button onClick={() => setForgotPassword(true)} className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full">
                  Mot de passe oublié ?
                </button>
              )}
              {forgotPassword ? (
                <button onClick={() => { setForgotPassword(false); setResetSent(false); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ← Retour à la connexion
                </button>
              ) : (
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {isLogin ? "Pas encore de compte ? Créer mon compte" : "Déjà un compte ? Se connecter"}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPortal;
