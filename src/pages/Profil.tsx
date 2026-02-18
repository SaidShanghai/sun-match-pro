import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// Admin dashboard content (inline to avoid re-exporting)
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import ClientProfileContent from "@/components/client/ClientProfileContent";
import AuthPortal from "@/components/auth/AuthPortal";

const Profil = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  const loading = authLoading || adminLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not connected → show login/signup portal
  if (!user) {
    return <AuthPortal />;
  }

  // Admin → show full NOORIA dashboard
  if (isAdmin) {
    return <AdminDashboardContent />;
  }

  // Client → show client profile space
  return <ClientProfileContent />;
};

export default Profil;
