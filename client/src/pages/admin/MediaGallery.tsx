import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Loader2,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadToR2, deleteFromR2, listR2Files, isR2Configured, getR2Url } from '@/lib/r2';

const APARTMENT_FOLDERS = [
  { value: 'vila-vranac', label: 'Vila Vranac' },
  { value: 'bijeli-jasmin', label: 'Bijeli Jasmin' },
  { value: 'plavi-lotos', label: 'Plavi Lotos' },
  { value: 'zeleni-tulipan', label: 'Zeleni Tulipan' },
  { value: 'crvena-magnolija', label: 'Crvena Magnolija' },
  { value: 'crna-orhideja', label: 'Crna Orhideja' },
  { value: 'restoran', label: 'Restoran' },
  { value: 'resort', label: 'Resort - Opšte' },
  { value: 'other', label: 'Ostalo' },
];

interface ImageFile {
  key: string;
  url: string;
  size: number;
  lastModified: Date;
}

const MediaGallery = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('vila-vranac');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFolder) {
      loadImages(selectedFolder);
    }
  }, [selectedFolder]);

  const loadImages = async (folder: string) => {
    setLoading(true);
    try {
      const result = await listR2Files(folder);
      if (result.success && result.files) {
        setImages(result.files);
      } else {
        toast.error(result.error || 'Greška pri učitavanju slika');
      }
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Greška pri učitavanju slika');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Molimo odaberite slike');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      try {
        const result = await uploadToR2({
          file,
          folder: selectedFolder,
          compress: true,
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          onProgress: (progress) => {
            const totalProgress = ((i + progress / 100) / selectedFiles.length) * 100;
            setUploadProgress(Math.round(totalProgress));
          },
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to upload ${file.name}:`, result.error);
        }
      } catch (error) {
        failCount++;
        console.error(`Error uploading ${file.name}:`, error);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setUploadDialogOpen(false);
    setSelectedFiles(null);

    if (successCount > 0) {
      toast.success(`${successCount} slika uspješno uploadovano!`);
      loadImages(selectedFolder);
    }
    
    if (failCount > 0) {
      toast.error(`${failCount} slika nije uspjelo`);
    }
  };

  const handleDelete = async () => {
    if (!deleteKey) return;

    try {
      const result = await deleteFromR2(deleteKey);
      if (result.success) {
        toast.success('Slika obrisana');
        setImages(prev => prev.filter(img => img.key !== deleteKey));
      } else {
        toast.error(result.error || 'Greška pri brisanju');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Greška pri brisanju');
    } finally {
      setDeleteKey(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL kopiran!');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isR2Configured()) {
    return (
      <AdminLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            R2 nije konfigurisan. Dodajte R2 kredencijale u .env fajl.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  const folderLabel = APARTMENT_FOLDERS.find(f => f.value === selectedFolder)?.label || selectedFolder;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-clash font-semibold text-gray-900">
              Galerija Slika
            </h1>
            <p className="text-gray-500 mt-1">
              {images.length} slika u {folderLabel}
            </p>
          </div>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-[#1E4528] hover:bg-[#2a5c38]"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Slike
          </Button>
        </div>

        {/* Folder selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Odaberi Apartman / Kategoriju
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APARTMENT_FOLDERS.map((folder) => (
                  <SelectItem key={folder.value} value={folder.value}>
                    {folder.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Images grid */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mb-4 text-gray-300" />
                <p>Nema slika u ovom folderu</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Prvu Sliku
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image) => (
                  <div
                    key={image.key}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-[#1E4528] transition-colors"
                  >
                    <img
                      src={image.url}
                      alt={image.key}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setPreviewImage(image.url)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => copyUrl(image.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => setDeleteKey(image.key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate">{image.key.split('/').pop()}</p>
                      <p className="text-gray-300">{formatFileSize(image.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Slike</DialogTitle>
              <DialogDescription>
                Upload slike u folder: {folderLabel}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folder">Folder</Label>
                <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APARTMENT_FOLDERS.map((folder) => (
                      <SelectItem key={folder.value} value={folder.value}>
                        {folder.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Odaberi Slike</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  disabled={uploading}
                />
                {selectedFiles && (
                  <p className="text-sm text-gray-500">
                    {selectedFiles.length} slika odabrano
                  </p>
                )}
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploadovanje...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Slike će biti automatski kompresovane do 1MB i 1920px širine.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={uploading}
                  className="flex-1"
                >
                  Odustani
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFiles}
                  className="flex-1 bg-[#1E4528] hover:bg-[#2a5c38]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploadovanje...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteKey} onOpenChange={(open) => !open && setDeleteKey(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
              <AlertDialogDescription>
                Ova akcija će trajno obrisati sliku. Ovo se ne može poništiti.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Odustani</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
              >
                Obriši
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Image preview */}
        <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
          <DialogContent className="max-w-4xl">
            <img
              src={previewImage || ''}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MediaGallery;



