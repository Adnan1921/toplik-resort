import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, GripVertical, Upload, Copy, Loader2, Image as ImageIcon, Star } from "lucide-react";
import { uploadToR2, listR2Files, deleteFromR2 } from "@/lib/r2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Apartment {
  id: string;
  slug: string;
  type: string;
  name: string;
  description: string;
  check_in: string;
  check_out: string;
  breakfast: string;
  price: string | null;
  capacity: string | null;
  amenities: string[];
  is_published: boolean;
  display_order: number;
  featured_image_url: string | null;
}

const apartmentSchema = z.object({
  slug: z.string().min(1, "Slug je obavezan"),
  type: z.string().min(1, "Tip je obavezan"),
  name: z.string().min(1, "Naziv je obavezan"),
  description: z.string().min(1, "Opis je obavezan"),
  check_in: z.string().min(1, "Check-in je obavezan"),
  check_out: z.string().min(1, "Check-out je obavezan"),
  breakfast: z.string().min(1, "Doručak je obavezan"),
  price: z.string().optional(),
  capacity: z.string().optional(),
  is_published: z.boolean().default(true),
});

type ApartmentFormData = z.infer<typeof apartmentSchema>;

export default function Apartments() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [amenitiesInput, setAmenitiesInput] = useState("");
  
  // Image gallery state
  const [images, setImages] = useState<Array<{ key: string; url: string }>>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const form = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: {
      slug: "",
      type: "Apartman",
      name: "",
      description: "",
      check_in: "14:00h - 21:30h",
      check_out: "11:00h",
      breakfast: "08.00h - 10.00 h",
      price: "",
      capacity: "",
      is_published: true,
    },
  });

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const { data, error } = await supabase
        .from("apartments")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setApartments(data || []);
    } catch (error) {
      console.error("Error fetching apartments:", error);
      toast.error("Greška pri učitavanju apartmana");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ApartmentFormData) => {
    try {
      const amenitiesArray = amenitiesInput
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const apartmentData = {
        ...data,
        amenities: amenitiesArray,
        price: data.price || null,
        capacity: data.capacity || null,
      };

      if (editingApartment) {
        // Update existing apartment
        const { error } = await supabase
          .from("apartments")
          .update(apartmentData)
          .eq("id", editingApartment.id);

        if (error) throw error;
        toast.success("Apartman uspješno ažuriran!");
      } else {
        // Create new apartment
        const { error } = await supabase
          .from("apartments")
          .insert([{ ...apartmentData, display_order: apartments.length }]);

        if (error) throw error;
        toast.success("Apartman uspješno kreiran!");
      }

      setDialogOpen(false);
      setEditingApartment(null);
      form.reset();
      setAmenitiesInput("");
      setImages([]);
      setUploadProgress({});
      fetchApartments();
    } catch (error: any) {
      console.error("Error saving apartment:", error);
      toast.error(error.message || "Greška pri čuvanju apartmana");
    }
  };

  const loadImages = async (slug: string) => {
    setLoadingImages(true);
    try {
      const result = await listR2Files(slug);
      if (result.success && result.files) {
        setImages(result.files);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Greška pri učitavanju slika');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (!editingApartment) {
      toast.error('Prvo sačuvaj apartman prije nego što uploaduješ slike');
      event.target.value = '';
      return;
    }

    if (!editingApartment.slug) {
      toast.error('Apartman nema validan slug');
      event.target.value = '';
      return;
    }

    setUploadingImages(true);
    const newProgress: Record<string, number> = {};

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        newProgress[fileName] = 0;
        setUploadProgress({ ...newProgress });

        try {
          const result = await uploadToR2({
            file: file,
            folder: editingApartment.slug,
            compress: true,
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            onProgress: (progress) => {
              newProgress[fileName] = progress;
              setUploadProgress({ ...newProgress });
            }
          });

          if (result.success) {
            toast.success(`${fileName} uspješno uploadovan!`);
          } else {
            toast.error(`Greška pri uploadu ${fileName}: ${result.error}`);
          }
        } catch (fileError: any) {
          console.error(`Error uploading ${fileName}:`, fileError);
          toast.error(`Greška pri uploadu ${fileName}: ${fileError.message || 'Nepoznata greška'}`);
        }
      }

      // Reload images after upload
      await loadImages(editingApartment.slug);
      setUploadProgress({});
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(`Greška pri uploadu slika: ${error.message || 'Nepoznata greška'}`);
    } finally {
      setUploadingImages(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (imageKey: string) => {
    if (!editingApartment) return;
    if (!confirm('Da li ste sigurni da želite obrisati ovu sliku?')) return;

    try {
      const result = await deleteFromR2(imageKey);
      if (result.success) {
        toast.success('Slika uspješno obrisana!');
        await loadImages(editingApartment.slug);
      } else {
        toast.error(`Greška pri brisanju: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Greška pri brisanju slike');
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL kopiran u clipboard!');
  };

  const setFeaturedImage = async (imageUrl: string) => {
    if (!editingApartment) {
      toast.error('Molimo prvo sačuvajte apartman');
      return;
    }

    console.log('Setting featured image:', {
      apartmentId: editingApartment.id,
      imageUrl: imageUrl,
      apartmentSlug: editingApartment.slug
    });

    try {
      const { data, error } = await supabase
        .from('apartments')
        .update({ featured_image_url: imageUrl })
        .eq('id', editingApartment.id)
        .select();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Featured image updated successfully:', data);
      toast.success('Featured slika postavljena!');
      
      // Update local state
      setEditingApartment({
        ...editingApartment,
        featured_image_url: imageUrl,
      });
      
      // Refresh apartments list
      await fetchApartments();
    } catch (error: any) {
      console.error('Error setting featured image:', error);
      toast.error(`Greška: ${error.message || 'Nepoznata greška'}`);
    }
  };

  const handleEdit = (apartment: Apartment) => {
    setEditingApartment(apartment);
    form.reset({
      slug: apartment.slug,
      type: apartment.type,
      name: apartment.name,
      description: apartment.description,
      check_in: apartment.check_in,
      check_out: apartment.check_out,
      breakfast: apartment.breakfast,
      price: apartment.price || "",
      capacity: apartment.capacity || "",
      is_published: apartment.is_published,
    });
    setAmenitiesInput(apartment.amenities.join("\n"));
    
    // Load images when editing
    if (apartment.slug) {
      loadImages(apartment.slug);
    }
    
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Da li ste sigurni da želite obrisati ovaj apartman?")) return;

    try {
      const { error } = await supabase.from("apartments").delete().eq("id", id);

      if (error) throw error;
      toast.success("Apartman uspješno obrisan!");
      fetchApartments();
    } catch (error) {
      console.error("Error deleting apartment:", error);
      toast.error("Greška pri brisanju apartmana");
    }
  };

  const togglePublished = async (apartment: Apartment) => {
    try {
      const { error } = await supabase
        .from("apartments")
        .update({ is_published: !apartment.is_published })
        .eq("id", apartment.id);

      if (error) throw error;
      toast.success(`Apartman ${!apartment.is_published ? "objavljen" : "sakriven"}!`);
      fetchApartments();
    } catch (error) {
      console.error("Error toggling published:", error);
      toast.error("Greška pri promjeni statusa");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Apartmani</h1>
            <p className="text-gray-600 mt-2">
              Upravljajte apartmanima, vilama i suitama
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingApartment(null);
              form.reset();
              setAmenitiesInput("");
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Dodaj apartman
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Učitavanje...</p>
          </div>
        ) : apartments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-600">Nema apartmana</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {apartments.map((apartment) => (
              <div
                key={apartment.id}
                className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <GripVertical className="h-5 w-5 text-gray-400 mt-1" />
                    
                    {/* Featured Image Thumbnail */}
                    {apartment.featured_image_url && (
                      <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border-2 border-yellow-400">
                        <img
                          src={apartment.featured_image_url}
                          alt={apartment.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{apartment.name}</h3>
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                          {apartment.type}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded font-mono">
                          /{apartment.slug}
                        </span>
                        {apartment.featured_image_url && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {apartment.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {apartment.price && (
                          <div>
                            <strong>Cijena:</strong> {apartment.price}
                          </div>
                        )}
                        {apartment.capacity && (
                          <div>
                            <strong>Kapacitet:</strong> {apartment.capacity}
                          </div>
                        )}
                        <div>
                          <strong>Check-in:</strong> {apartment.check_in}
                        </div>
                        <div>
                          <strong>Check-out:</strong> {apartment.check_out}
                        </div>
                      </div>
                      {apartment.amenities.length > 0 && (
                        <div className="mt-3">
                          <strong className="text-sm text-gray-700">Sadržaji:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {apartment.amenities.map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`published-${apartment.id}`} className="text-sm">
                        {apartment.is_published ? "Objavljen" : "Sakriven"}
                      </Label>
                      <Switch
                        id={`published-${apartment.id}`}
                        checked={apartment.is_published}
                        onCheckedChange={() => togglePublished(apartment)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(apartment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(apartment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingApartment ? "Uredi apartman" : "Dodaj apartman"}
              </DialogTitle>
              <DialogDescription>
                Popunite informacije o apartmanu
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    {...form.register("slug")}
                    placeholder="plavi-lotos"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Tip</Label>
                  <select
                    id="type"
                    {...form.register("type")}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="Apartman">Apartman</option>
                    <option value="Vila">Vila</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Naziv</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Plavi Lotos"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  rows={4}
                  placeholder="Opis apartmana..."
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Cijena (opciono)</Label>
                  <Input
                    id="price"
                    {...form.register("price")}
                    placeholder="160,00 EUR sa uključenim doručkom"
                  />
                </div>

                <div>
                  <Label htmlFor="capacity">Kapacitet (opciono)</Label>
                  <Input
                    id="capacity"
                    {...form.register("capacity")}
                    placeholder="2 - 4 osobe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="check_in">Check-in</Label>
                  <Input
                    id="check_in"
                    {...form.register("check_in")}
                    placeholder="14:00h - 21:30h"
                  />
                </div>

                <div>
                  <Label htmlFor="check_out">Check-out</Label>
                  <Input
                    id="check_out"
                    {...form.register("check_out")}
                    placeholder="11:00h"
                  />
                </div>

                <div>
                  <Label htmlFor="breakfast">Doručak</Label>
                  <Input
                    id="breakfast"
                    {...form.register("breakfast")}
                    placeholder="08.00h - 10.00 h"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amenities">
                  Sadržaji (jedan po liniji)
                </Label>
                <Textarea
                  id="amenities"
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  rows={8}
                  placeholder="54 m²&#10;Klima + centralno grijanje&#10;Internet&#10;Mini bar&#10;Room Services&#10;Smart TV&#10;Jacuzzi&#10;Kamin&#10;Smart Home&#10;Recepcija 24/7&#10;Parking&#10;Rent a car"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Unesite svaki sadržaj u novi red
                </p>
              </div>

              {/* Image Gallery - Only show when editing existing apartment */}
              {editingApartment && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Label className="text-lg">Galerija Slika</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload slike za apartman {editingApartment.name}
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploadingImages}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImages ? 'Uploading...' : 'Upload Slike'}
                      </Button>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="mb-4 space-y-2">
                      {Object.entries(uploadProgress).map(([fileName, progress]) => (
                        <div key={fileName} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{fileName}</span>
                            <span className="text-gray-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Images Grid */}
                  {loadingImages ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      <span className="ml-2 text-gray-600">Učitavanje slika...</span>
                    </div>
                  ) : images.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Nema slika</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Kliknite "Upload Slike" da dodate slike
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((image) => {
                        const isFeatured = editingApartment?.featured_image_url === image.url;
                        return (
                          <div
                            key={image.key}
                            className={`relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 ${
                              isFeatured ? 'border-yellow-400' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={image.key}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Featured Badge */}
                            {isFeatured && (
                              <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                Featured
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setFeaturedImage(image.url)}
                                title="Postavi kao featured sliku"
                              >
                                <Star className={`h-4 w-4 ${isFeatured ? 'fill-current' : ''}`} />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => copyImageUrl(image.url)}
                                title="Kopiraj URL"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteImage(image.key)}
                                title="Obriši sliku"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={form.watch("is_published")}
                  onCheckedChange={(checked) => form.setValue("is_published", checked)}
                />
                <Label htmlFor="is_published">Objavljen</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingApartment(null);
                    form.reset();
                    setAmenitiesInput("");
                    setImages([]);
                    setUploadProgress({});
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Otkaži
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Sačuvaj
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

