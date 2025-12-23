import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Lock } from 'lucide-react';
import toplikLogo from '@/assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const { signIn, loading, error, isConfigured } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (!result.error) {
      setLocation('/admin');
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E4528] to-[#0f2614] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={toplikLogo} alt="Toplik" className="w-16 h-16 mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <CardDescription>Supabase konfiguracija nije pronađena</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Molimo postavite VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY environment varijable.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E4528] to-[#0f2614] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src={toplikLogo} alt="Toplik" className="w-16 h-16 mx-auto mb-4" />
          <CardTitle className="text-2xl font-clash">Admin Panel</CardTitle>
          <CardDescription>Toplik Village Resort</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@toplik.ba"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#1E4528] hover:bg-[#2a5c38]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Prijava...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Prijavi se
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;












