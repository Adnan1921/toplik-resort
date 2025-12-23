import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Plus, 
  Pencil, 
  Trash2, 
  Settings,
  Loader2,
  Search,
  Save,
  Type,
  Code,
  FileJson
} from 'lucide-react';
import type { SiteContent } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';

const contentTypeIcons = {
  text: Type,
  html: Code,
  json: FileJson,
};

const SiteContentPage = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [isNewContent, setIsNewContent] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formType, setFormType] = useState<'text' | 'html' | 'json'>('text');
  const [formDescription, setFormDescription] = useState('');

  // Inline editing state
  const [inlineEditing, setInlineEditing] = useState<string | null>(null);
  const [inlineValue, setInlineValue] = useState('');

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('key', { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Greška pri učitavanju sadržaja');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const openCreateDialog = () => {
    setIsNewContent(true);
    setEditingContent(null);
    setFormKey('');
    setFormValue('');
    setFormType('text');
    setFormDescription('');
  };

  const openEditDialog = (content: SiteContent) => {
    setIsNewContent(false);
    setEditingContent(content);
    setFormKey(content.key);
    setFormValue(content.value);
    setFormType(content.content_type);
    setFormDescription(content.description || '');
  };

  const closeDialog = () => {
    setEditingContent(null);
    setIsNewContent(false);
    setFormKey('');
    setFormValue('');
    setFormType('text');
    setFormDescription('');
  };

  const saveContent = async () => {
    if (!formKey.trim() || !formValue.trim()) {
      toast.error('Molimo popunite sva obavezna polja');
      return;
    }

    // Validate key format (lowercase, underscores, no spaces)
    const keyRegex = /^[a-z][a-z0-9_]*$/;
    if (!keyRegex.test(formKey.trim())) {
      toast.error('Ključ mora početi slovom i sadržavati samo mala slova, brojeve i podvlake');
      return;
    }

    setSaving(true);
    try {
      if (isNewContent) {
        const { data, error } = await supabase
          .from('site_content')
          .insert({
            key: formKey.trim(),
            value: formValue.trim(),
            content_type: formType,
            description: formDescription.trim() || null,
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            toast.error('Ključ već postoji');
            return;
          }
          throw error;
        }
        setContents(prev => [...prev, data].sort((a, b) => a.key.localeCompare(b.key)));
        toast.success('Sadržaj kreiran');
      } else if (editingContent) {
        const { data, error } = await supabase
          .from('site_content')
          .update({
            key: formKey.trim(),
            value: formValue.trim(),
            content_type: formType,
            description: formDescription.trim() || null,
          })
          .eq('id', editingContent.id)
          .select()
          .single();

        if (error) throw error;
        setContents(prev => 
          prev.map(c => c.id === editingContent.id ? data : c)
            .sort((a, b) => a.key.localeCompare(b.key))
        );
        toast.success('Sadržaj ažuriran');
      }
      closeDialog();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Greška pri spremanju');
    } finally {
      setSaving(false);
    }
  };

  const deleteContent = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      setContents(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
      toast.success('Sadržaj obrisan');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Greška pri brisanju');
    }
  };

  const startInlineEdit = (content: SiteContent) => {
    setInlineEditing(content.id);
    setInlineValue(content.value);
  };

  const saveInlineEdit = async (content: SiteContent) => {
    if (inlineValue === content.value) {
      setInlineEditing(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('site_content')
        .update({ value: inlineValue })
        .eq('id', content.id);

      if (error) throw error;
      
      setContents(prev => 
        prev.map(c => c.id === content.id ? { ...c, value: inlineValue } : c)
      );
      setInlineEditing(null);
      toast.success('Sadržaj ažuriran');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Greška pri ažuriranju');
    }
  };

  const cancelInlineEdit = () => {
    setInlineEditing(null);
    setInlineValue('');
  };

  const filteredContents = contents.filter(c =>
    c.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group contents by prefix
  const groupedContents = filteredContents.reduce((acc, content) => {
    const prefix = content.key.split('_')[0];
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(content);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-clash font-semibold text-gray-900">
              Sadržaj Stranice
            </h1>
            <p className="text-gray-500 mt-1">
              {contents.length} stavki sadržaja
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pretraži..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={openCreateDialog} className="bg-[#1E4528] hover:bg-[#2a5c38]">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Novo</span>
            </Button>
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : contents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Settings className="h-12 w-12 mb-4 text-gray-300" />
              <p>Nema sadržaja za prikaz</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={openCreateDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj prvi sadržaj
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedContents).map(([prefix, items]) => (
              <Card key={prefix}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium capitalize">
                    {prefix.replace(/_/g, ' ')}
                  </CardTitle>
                  <CardDescription>
                    {items.length} stavk{items.length === 1 ? 'a' : 'i'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100">
                    {items.map((content) => {
                      const TypeIcon = contentTypeIcons[content.content_type];
                      const isEditing = inlineEditing === content.id;

                      return (
                        <div key={content.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded bg-gray-100 flex-shrink-0">
                              <TypeIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">
                                  {content.key}
                                </code>
                                <span className="text-xs text-gray-400">
                                  {content.content_type}
                                </span>
                              </div>
                              {content.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {content.description}
                                </p>
                              )}
                              
                              {/* Value display/edit */}
                              <div className="mt-2">
                                {isEditing ? (
                                  <div className="space-y-2">
                                    {content.content_type === 'text' ? (
                                      <Input
                                        value={inlineValue}
                                        onChange={(e) => setInlineValue(e.target.value)}
                                        autoFocus
                                      />
                                    ) : (
                                      <Textarea
                                        value={inlineValue}
                                        onChange={(e) => setInlineValue(e.target.value)}
                                        rows={4}
                                        className="font-mono text-sm"
                                        autoFocus
                                      />
                                    )}
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => saveInlineEdit(content)}
                                      >
                                        <Save className="h-3 w-3 mr-1" />
                                        Spremi
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelInlineEdit}
                                      >
                                        Odustani
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div 
                                    className="p-2 bg-gray-50 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => startInlineEdit(content)}
                                  >
                                    <p className={`whitespace-pre-wrap break-words ${
                                      content.content_type !== 'text' ? 'font-mono text-xs' : ''
                                    }`}>
                                      {content.value.length > 200 
                                        ? content.value.slice(0, 200) + '...' 
                                        : content.value}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-gray-400 mt-2">
                                Ažurirano {format(new Date(content.updated_at), 'dd.MM.yyyy. u HH:mm', { locale: hr })}
                              </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(content)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setDeleteId(content.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit dialog */}
        <Dialog open={isNewContent || !!editingContent} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {isNewContent ? 'Novi Sadržaj' : 'Uredi Sadržaj'}
              </DialogTitle>
              <DialogDescription>
                {isNewContent 
                  ? 'Dodajte novu stavku sadržaja' 
                  : 'Uredite postojeću stavku sadržaja'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">Ključ *</Label>
                <Input
                  id="key"
                  placeholder="npr. hero_title"
                  value={formKey}
                  onChange={(e) => setFormKey(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                  disabled={!isNewContent}
                />
                <p className="text-xs text-gray-500">
                  Jedinstveni identifikator (mala slova, podvlake)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tip sadržaja</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as 'text' | 'html' | 'json')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Tekst</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Vrijednost *</Label>
                {formType === 'text' ? (
                  <Input
                    id="value"
                    placeholder="Unesite vrijednost..."
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                  />
                ) : (
                  <Textarea
                    id="value"
                    placeholder={formType === 'json' ? '{"key": "value"}' : '<p>HTML sadržaj</p>'}
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Opis (opcionalno)</Label>
                <Input
                  id="description"
                  placeholder="Kratki opis za admina..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Odustani
              </Button>
              <Button 
                onClick={saveContent} 
                disabled={saving}
                className="bg-[#1E4528] hover:bg-[#2a5c38]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Spremanje...
                  </>
                ) : (
                  isNewContent ? 'Kreiraj' : 'Spremi'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
              <AlertDialogDescription>
                Ova akcija će trajno obrisati sadržaj. Ovo se ne može poništiti.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Odustani</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={deleteContent}
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

export default SiteContentPage;












