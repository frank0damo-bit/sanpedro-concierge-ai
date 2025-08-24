import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle } from 'lucide-react'

const authImageUrl = "https://images.unsplash.com/photo-1541599308631-7357604d1a49";

const Auth = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const benefits = [
    "Plan trips with our 24/7 AI Concierge",
    "Save and manage your itineraries",
    "Access exclusive local deals",
    "Enjoy seamless booking and support"
  ];

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Unlock Your Perfect Trip</h1>
            <p className="text-balance text-muted-foreground">
              Create an account to start planning your Belizean adventure.
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
      <div className="hidden bg-muted lg:flex items-center justify-center relative">
        <img
          src={authImageUrl}
          alt="A relaxing beach scene in San Pedro, Belize"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 p-12 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-4">Your adventure starts here.</h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Creating an account is the first step towards a perfectly curated, stress-free vacation.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 mt-1 text-accent-light" />
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Auth;
