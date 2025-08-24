import { Button } from "@/components/ui/button";
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import authImageUrl from "@/assets/secret-beach-belize.png";

const Auth = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <Link to="/" className="absolute top-4 left-4 z-20">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="flex items-center gap-2 mb-4">
               <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">C</span>
                </div>
              <span className="text-2xl font-bold">Caribe Concierge</span>
            </Link>
            <h1 className="text-3xl font-bold">Unlock Your Perfect Trip</h1>
            <p className="text-balance text-muted-foreground mt-2">
              Sign in or create an account to start planning.
            </p>
          </div>
          
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(210 100% 25%)',
                    brandAccent: 'hsl(175 85% 45%)'
                  }
                }
              }
            }}
            providers={['google']}
            socialLayout="horizontal"
          />

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <img
          src={authImageUrl}
          alt="A relaxing beach scene in San Pedro, Belize"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Auth;
