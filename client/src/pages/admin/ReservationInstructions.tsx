import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  GripVertical,
  FileText,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import type { ReservationInstruction } from '@/lib/supabase';
import { toast } from 'sonner';

const ReservationInstructions = () => {
  const [instructions, setInstructions] = useState<ReservationInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<ReservationInstruction | null>(null);
  const [isNewInstruction, setIsNewInstruction] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchInstructions = async () => {
    try {
      const { data, error } = await supabase
        .from('reservation_instructions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setInstructions(data || []);
    } catch (error) {
      console.error('Error fetching instructions:', error);
      toast.error('Greška pri učitavanju uputa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructions();
  }, []);

  const openCreateDialog = () => {
    setIsNewInstruction(true);
    setEditingInstruction(null);
    setFormTitle('');
    setFormContent('');
    setFormIsActive(true);
  };

  const openEditDialog = (instruction: ReservationInstruction) => {
    setIsNewInstruction(false);
    setEditingInstruction(instruction);
    setFormTitle(instruction.title);
    setFormContent(instruction.content);
    setFormIsActive(instruction.is_active);
  };

  const closeDialog = () => {
    setEditingInstruction(null);
    setIsNewInstruction(false);
    setFormTitle('');
    setFormContent('');
    setFormIsActive(true);
  };

  const saveInstruction = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error('Molimo popunite sva polja');
      return;
    }

    setSaving(true);
    try {
      if (isNewInstruction) {
        // Get max sort order
        const maxOrder = instructions.length > 0 
          ? Math.max(...instructions.map(i => i.sort_order)) + 1 
          : 0;

        const { data, error } = await supabase
          .from('reservation_instructions')
          .insert({
            title: formTitle.trim(),
            content: formContent.trim(),
            is_active: formIsActive,
            sort_order: maxOrder,
          })
          .select()
          .single();

        if (error) throw error;
        setInstructions(prev => [...prev, data]);
        toast.success('Uputa kreirana');
      } else if (editingInstruction) {
        const { data, error } = await supabase
          .from('reservation_instructions')
          .update({
            title: formTitle.trim(),
            content: formContent.trim(),
            is_active: formIsActive,
          })
          .eq('id', editingInstruction.id)
          .select()
          .single();

        if (error) throw error;
        setInstructions(prev => 
          prev.map(i => i.id === editingInstruction.id ? data : i)
        );
        toast.success('Uputa ažurirana');
      }
      closeDialog();
    } catch (error) {
      console.error('Error saving instruction:', error);
      toast.error('Greška pri spremanju');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (instruction: ReservationInstruction) => {
    try {
      const { error } = await supabase
        .from('reservation_instructions')
        .update({ is_active: !instruction.is_active })
        .eq('id', instruction.id);

      if (error) throw error;
      
      setInstructions(prev => 
        prev.map(i => i.id === instruction.id ? { ...i, is_active: !i.is_active } : i)
      );
      toast.success(instruction.is_active ? 'Uputa deaktivirana' : 'Uputa aktivirana');
    } catch (error) {
      console.error('Error toggling instruction:', error);
      toast.error('Greška pri ažuriranju');
    }
  };

  const deleteInstruction = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('reservation_instructions')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      setInstructions(prev => prev.filter(i => i.id !== deleteId));
      setDeleteId(null);
      toast.success('Uputa obrisana');
    } catch (error) {
      console.error('Error deleting instruction:', error);
      toast.error('Greška pri brisanju');
    }
  };

  const moveInstruction = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= instructions.length) return;

    const newInstructions = [...instructions];
    const temp = newInstructions[index];
    newInstructions[index] = newInstructions[newIndex];
    newInstructions[newIndex] = temp;

    // Update sort orders
    const updates = newInstructions.map((inst, idx) => ({
      id: inst.id,
      sort_order: idx,
    }));

    setInstructions(newInstructions.map((inst, idx) => ({ ...inst, sort_order: idx })));

    try {
      for (const update of updates) {
        await supabase
          .from('reservation_instructions')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Greška pri promjeni redoslijeda');
      fetchInstructions(); // Refresh on error
    }
  };

  const activeCount = instructions.filter(i => i.is_active).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-clash font-semibold text-gray-900">
              Upute za Rezervaciju
            </h1>
            <p className="text-gray-500 mt-1">
              {instructions.length} ukupno • {activeCount} aktivnih
            </p>
          </div>
          <Button onClick={openCreateDialog} className="bg-[#1E4528] hover:bg-[#2a5c38]">
            <Plus className="h-4 w-4 mr-2" />
            Nova Uputa
          </Button>
        </div>

        {/* Instructions list */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : instructions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mb-4 text-gray-300" />
                <p>Nema uputa za prikaz</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={openCreateDialog}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj prvu uputu
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {instructions.map((instruction, index) => (
                  <div
                    key={instruction.id}
                    className={`flex items-start gap-4 p-4 ${
                      !instruction.is_active ? 'bg-gray-50 opacity-60' : ''
                    }`}
                  >
                    {/* Drag handle / order controls */}
                    <div className="flex flex-col gap-1 pt-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === 0}
                        onClick={() => moveInstruction(index, 'up')}
                      >
                        <GripVertical className="h-4 w-4 rotate-90" />
                      </Button>
                      <span className="text-xs text-gray-400 text-center">{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === instructions.length - 1}
                        onClick={() => moveInstruction(index, 'down')}
                      >
                        <GripVertical className="h-4 w-4 rotate-90" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-gray-900">{instruction.title}</h3>
                        {!instruction.is_active && (
                          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                            Neaktivno
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {instruction.content}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(instruction)}
                        title={instruction.is_active ? 'Deaktiviraj' : 'Aktiviraj'}
                      >
                        {instruction.is_active ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(instruction)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(instruction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit dialog */}
        <Dialog open={isNewInstruction || !!editingInstruction} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {isNewInstruction ? 'Nova Uputa' : 'Uredi Uputu'}
              </DialogTitle>
              <DialogDescription>
                {isNewInstruction 
                  ? 'Dodajte novu uputu za rezervaciju' 
                  : 'Uredite postojeću uputu za rezervaciju'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Naslov</Label>
                <Input
                  id="title"
                  placeholder="npr. Check-in"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Sadržaj</Label>
                <Textarea
                  id="content"
                  placeholder="Opišite uputu..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is-active">Aktivno</Label>
                  <p className="text-sm text-gray-500">Prikaži na stranici</p>
                </div>
                <Switch
                  id="is-active"
                  checked={formIsActive}
                  onCheckedChange={setFormIsActive}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Odustani
              </Button>
              <Button 
                onClick={saveInstruction} 
                disabled={saving}
                className="bg-[#1E4528] hover:bg-[#2a5c38]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Spremanje...
                  </>
                ) : (
                  isNewInstruction ? 'Kreiraj' : 'Spremi'
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
                Ova akcija će trajno obrisati uputu. Ovo se ne može poništiti.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Odustani</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={deleteInstruction}
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

export default ReservationInstructions;












