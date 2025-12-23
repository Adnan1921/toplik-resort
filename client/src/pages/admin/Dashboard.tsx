import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  FileText, 
  Settings, 
  ArrowRight,
  Mail,
  MailOpen,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hr } from 'date-fns/locale';
import type { ContactSubmission } from '@/lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    unreadSubmissions: 0,
    totalInstructions: 0,
    totalContent: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch submission counts
        const { count: totalSubmissions } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true });

        const { count: unreadSubmissions } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);

        // Fetch instruction count
        const { count: totalInstructions } = await supabase
          .from('reservation_instructions')
          .select('*', { count: 'exact', head: true });

        // Fetch content count
        const { count: totalContent } = await supabase
          .from('site_content')
          .select('*', { count: 'exact', head: true });

        // Fetch recent submissions
        const { data: recent } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalSubmissions: totalSubmissions || 0,
          unreadSubmissions: unreadSubmissions || 0,
          totalInstructions: totalInstructions || 0,
          totalContent: totalContent || 0,
        });
        setRecentSubmissions(recent || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Kontakt Poruke',
      value: stats.totalSubmissions,
      description: `${stats.unreadSubmissions} nepročitanih`,
      icon: MessageSquare,
      href: '/admin/submissions',
      color: 'bg-blue-500',
    },
    {
      title: 'Upute za Rezervaciju',
      value: stats.totalInstructions,
      description: 'Aktivnih uputa',
      icon: FileText,
      href: '/admin/instructions',
      color: 'bg-green-500',
    },
    {
      title: 'Sadržaj Stranice',
      value: stats.totalContent,
      description: 'Stavki sadržaja',
      icon: Settings,
      href: '/admin/content',
      color: 'bg-purple-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome message */}
        <div>
          <h1 className="text-2xl font-clash font-semibold text-gray-900">
            Dobrodošli nazad
          </h1>
          <p className="text-gray-500 mt-1">
            Pregled administracije Toplik Village Resort
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.href} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? '...' : stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                <Link href={stat.href}>
                  <Button variant="link" className="px-0 mt-2 text-[#1E4528]">
                    Pogledaj sve <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nedavne Poruke</CardTitle>
            <CardDescription>
              Posljednjih 5 kontakt poruka
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Učitavanje...</div>
            ) : recentSubmissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nema poruka za prikaz
              </div>
            ) : (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${submission.is_read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                      {submission.is_read ? (
                        <MailOpen className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">
                          {submission.name}
                        </p>
                        {!submission.is_read && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                            Novo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {submission.email}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                        {submission.message}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(submission.created_at), {
                        addSuffix: true,
                        locale: hr,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/admin/submissions">
              <Button variant="outline" className="w-full mt-4">
                Pogledaj sve poruke
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;












