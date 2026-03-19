import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading user...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="mt-3 text-sm text-muted-foreground">Welcome back!</p>

        <div className="mt-6 space-y-3 text-sm">
          <p>
            <span className="font-medium">Name: </span>
            {user.displayName || "--"}
          </p>
          <p>
            <span className="font-medium">Email: </span>
            {user.email || "--"}
          </p>
          <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            back
          </button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
