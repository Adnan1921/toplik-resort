import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Mail, 
  MailOpen, 
  Phone, 
  Clock, 
  Search,
  Trash2,
  Eye,
  CheckCheck,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { hr } from 'date-fns/locale';
import type { ContactSubmission } from '@/lib/supabase';
import { toast } from 'sonner';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Greška pri učitavanju poruka');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: isRead })
        .eq('id', id);

      if (error) throw error;
      
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, is_read: isRead } : s)
      );
      
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(prev => prev ? { ...prev, is_read: isRead } : null);
      }
      
      toast.success(isRead ? 'Označeno kao pročitano' : 'Označeno kao nepročitano');
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Greška pri ažuriranju');
    }
  };

  const saveNotes = async () => {
    if (!selectedSubmission) return;
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ notes })
        .eq('id', selectedSubmission.id);

      if (error) throw error;
      
      setSubmissions(prev =>
        prev.map(s => s.id === selectedSubmission.id ? { ...s, notes } : s)
      );
      setSelectedSubmission(prev => prev ? { ...prev, notes } : null);
      
      toast.success('Bilješke spremljene');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Greška pri spremanju bilješki');
    }
  };

  const deleteSubmission = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      setSubmissions(prev => prev.filter(s => s.id !== deleteId));
      setDeleteId(null);
      
      if (selectedSubmission?.id === deleteId) {
        setSelectedSubmission(null);
      }
      
      toast.success('Poruka obrisana');
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Greška pri brisanju');
    }
  };

  const openSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setNotes(submission.notes || '');
    if (!submission.is_read) {
      markAsRead(submission.id, true);
    }
  };

  const filteredSubmissions = submissions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = submissions.filter(s => !s.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-clash font-semibold text-gray-900">
              Kontakt Poruke
            </h1>
            <p className="text-gray-500 mt-1">
              {submissions.length} ukupno • {unreadCount} nepročitanih
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pretraži poruke..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Submissions list */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <MessageSquare className="h-12 w-12 mb-4 text-gray-300" />
                <p>Nema poruka za prikaz</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !submission.is_read ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => openSubmission(submission)}
                  >
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      submission.is_read ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      {submission.is_read ? (
                        <MailOpen className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Mail className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-medium truncate ${
                          !submission.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {submission.name}
                        </p>
                        {!submission.is_read && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Novo
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {submission.submission_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{submission.email}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {submission.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(submission.created_at), {
                          addSuffix: true,
                          locale: hr,
                        })}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(submission.id, !submission.is_read);
                          }}
                        >
                          {submission.is_read ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <CheckCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(submission.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* View submission dialog */}
        <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedSubmission && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Detalji Poruke
                  </DialogTitle>
                  <DialogDescription>
                    Primljeno {format(new Date(selectedSubmission.created_at), 'dd.MM.yyyy. u HH:mm', { locale: hr })}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Ime</p>
                      <p className="font-medium">{selectedSubmission.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a 
                        href={`mailto:${selectedSubmission.email}`}
                        className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Mail className="h-4 w-4" />
                        {selectedSubmission.email}
                      </a>
                    </div>
                    {selectedSubmission.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Telefon</p>
                        <a 
                          href={`tel:${selectedSubmission.phone}`}
                          className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          {selectedSubmission.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Tip</p>
                      <Badge variant="outline">{selectedSubmission.submission_type}</Badge>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Poruka</p>
                    <div className="p-4 bg-white border rounded-lg whitespace-pre-wrap">
                      {selectedSubmission.message}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Bilješke (interno)</p>
                    <Textarea
                      placeholder="Dodajte bilješku o ovoj poruci..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={saveNotes}
                    >
                      Spremi bilješke
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => markAsRead(selectedSubmission.id, !selectedSubmission.is_read)}
                    >
                      {selectedSubmission.is_read ? (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Označi kao nepročitano
                        </>
                      ) : (
                        <>
                          <CheckCheck className="h-4 w-4 mr-2" />
                          Označi kao pročitano
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDeleteId(selectedSubmission.id);
                        setSelectedSubmission(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Obriši
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
              <AlertDialogDescription>
                Ova akcija će trajno obrisati poruku. Ovo se ne može poništiti.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Odustani</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={deleteSubmission}
              >
                Obriši
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default ContactSubmissions;












