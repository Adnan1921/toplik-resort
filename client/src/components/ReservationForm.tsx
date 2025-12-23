import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Home, Calendar, Users, Baby, User, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import resortBg from "@/assets/rezervisi/resort-hd.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  sendSubmissionNotification, 
  addSubmissionContact, 
  isBrevoConfigured 
} from "@/lib/brevo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  accommodation: z.string().min(1, "Molimo izaberite smještaj"),
  checkIn: z.string().min(1, "Molimo izaberite datum"),
  checkOut: z.string().min(1, "Molimo izaberite datum"),
  adults: z.string().min(1, "Molimo izaberite broj osoba"),
  children: z.string().min(1, "Molimo izaberite broj djece"),
  name: z.string().min(1, "Molimo unesite ime i prezime"),
  phone: z.string().min(1, "Molimo unesite broj telefona"),
  email: z.string().email("Molimo unesite validan email"),
  rentCar: z.enum(["interested", "not-interested"]),
  shuttleBus: z.enum(["interested", "not-interested"]),
  marketingConsent: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ReservationFormProps {
  /** Render mode: 
   * - 'full': homepage with background, tabs, and contact info
   * - 'form-only': just the complete form with all fields (for apartment page)
   * - 'simple': minimal form (if needed)
   */
  mode?: 'full' | 'form-only' | 'simple';
  /** Pre-selected accommodation (for apartment pages) */
  defaultAccommodation?: string;
  /** Apartment name to display (for apartment pages) */
  apartmentName?: string;
}

const ReservationForm = ({ 
  mode = 'full', 
  defaultAccommodation = '',
  apartmentName = ''
}: ReservationFormProps) => {
  const [activeTab, setActiveTab] = useState<"apartman" | "restoran">("apartman");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accommodation: defaultAccommodation,
      checkIn: "",
      checkOut: "",
      adults: "",
      children: "",
      name: "",
      phone: "",
      email: "",
      rentCar: "not-interested",
      shuttleBus: "not-interested",
      marketingConsent: true, // Pre-checked
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Build message from form data
      const accommodationDisplay = apartmentName || data.accommodation;
      const message = `
Rezervacija apartmana

Smještaj: ${accommodationDisplay}
Check-in: ${data.checkIn}
Check-out: ${data.checkOut}
Broj odraslih: ${data.adults}
Broj djece: ${data.children}

Rent a Car: ${data.rentCar === 'interested' ? 'Da' : 'Ne'}
Shuttle Bus: ${data.shuttleBus === 'interested' ? 'Da' : 'Ne'}
      `.trim();

      // Get email settings from CMS
      let notificationEmail = 'adnan.biber2@gmail.com';
      let senderEmail = 'noreply@toplik.ba';
      let brevoListId: number | undefined;

      if (isSupabaseConfigured()) {
        // Fetch email settings
        const { data: settings } = await supabase
          .from('site_content')
          .select('key, value')
          .in('key', ['notification_email', 'notification_sender', 'brevo_list_id']);

        if (settings) {
          settings.forEach(s => {
            if (s.key === 'notification_email' && s.value) notificationEmail = s.value;
            if (s.key === 'notification_sender' && s.value) senderEmail = s.value;
            if (s.key === 'brevo_list_id' && s.value) brevoListId = parseInt(s.value, 10) || undefined;
          });
        }

        // Save to database
        const { error } = await supabase
          .from('contact_submissions')
          .insert({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: message,
            submission_type: 'reservation',
            marketing_consent: data.marketingConsent,
          });

        if (error) throw error;
      }

      // Send email notification via Brevo
      if (isBrevoConfigured()) {
        // Send notification email to admin
        await sendSubmissionNotification(
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: message,
            submissionType: 'reservation',
            marketingConsent: data.marketingConsent,
            adminPanelUrl: `${window.location.origin}/admin/submissions`,
          },
          notificationEmail,
          senderEmail
        );

        // Add contact to Brevo
        console.log('Adding contact to Brevo:', { 
          email: data.email, 
          name: data.name, 
          listId: brevoListId, 
          consent: data.marketingConsent 
        });
        
        const contactResult = await addSubmissionContact(
          data.email,
          data.name,
          data.phone,
          brevoListId,
          data.marketingConsent
        );
        
        console.log('Brevo contact result:', contactResult);
        if (!contactResult.success) {
          console.error('Failed to add contact to Brevo:', contactResult.error);
        }
      }
      
      toast.success('Vaša rezervacija je uspješno poslana! Kontaktirat ćemo vas uskoro.');
      form.reset({
        accommodation: defaultAccommodation,
        checkIn: "",
        checkOut: "",
        adults: "",
        children: "",
        name: "",
        phone: "",
        email: "",
        rentCar: "not-interested",
        shuttleBus: "not-interested",
        marketingConsent: true,
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Došlo je do greške. Molimo pokušajte ponovo ili nas kontaktirajte telefonom.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => (
    <>
      {/* Accommodation - hidden if defaultAccommodation is set */}
      {!defaultAccommodation && (
        <FormField
          control={form.control}
          name="accommodation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
                {mode === 'full' && <Home size={16} />}
                Smeštaj
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}>
                    <SelectValue placeholder="Izaberi apartman" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bijeli-jasmin">Bijeli Jasmin</SelectItem>
                  <SelectItem value="plavi-lotos">Plavi Lotos</SelectItem>
                  <SelectItem value="zeleni-tulipan">Zeleni Tulipan</SelectItem>
                  <SelectItem value="crvena-magnolija">Crvena Magnolija</SelectItem>
                  <SelectItem value="crna-orhideja">Crna Orhideja</SelectItem>
                  <SelectItem value="vila-vranac">Vila Vranac</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Check-in and Check-out */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="checkIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
                {mode === 'full' && <Calendar size={16} />}
                Check-in
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkOut"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
                {mode === 'full' && <Calendar size={16} />}
                Check-out
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Adults and Children */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="adults"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
                {mode === 'full' && <Users size={16} />}
                Broj osoba
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="children"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
                {mode === 'full' && <Baby size={16} />}
                Djeca
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
              {mode === 'full' && <User size={16} />}
              Ime i Prezime
            </FormLabel>
            <FormControl>
              <Input
                className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}
                placeholder="Unesi ime i prezime"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Phone and Email */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
                {mode === 'full' && <Phone size={16} />}
                Broj telefona
              </FormLabel>
              <FormControl>
                <Input
                  className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}
                  placeholder="Unesi broj"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={mode === 'full' ? "flex items-center gap-2 text-sm text-gray-700 mb-2" : "font-martel text-sm text-primary"}>
                {mode === 'full' && <Mail size={16} />}
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className={mode === 'full' ? "bg-[#F8F5F0] border-gray-300" : "bg-white border-[#EFE5DB]"}
                  placeholder="Unesi email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Rent a Car and Shuttle Bus - shown in full and form-only modes */}
      {(mode === 'full' || mode === 'form-only') && (
        <>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="rentCar"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className={mode === 'full' ? "text-sm text-gray-700" : "font-martel text-sm text-primary"}>
                    Da li ste zainteresovani za rent a car?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="interested" id="rent-yes" />
                        <Label htmlFor="rent-yes" className="cursor-pointer text-sm">
                          Da
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-interested" id="rent-no" />
                        <Label htmlFor="rent-no" className="cursor-pointer text-sm">
                          Ne
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shuttleBus"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className={mode === 'full' ? "text-sm text-gray-700" : "font-martel text-sm text-primary"}>
                    Da li ste zainteresovani za shuttle bus?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="interested" id="shuttle-yes" />
                        <Label htmlFor="shuttle-yes" className="cursor-pointer text-sm">
                          Da
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-interested" id="shuttle-no" />
                        <Label htmlFor="shuttle-no" className="cursor-pointer text-sm">
                          Ne
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {/* Marketing Consent */}
      <FormField
        control={form.control}
        name="marketingConsent"
        render={({ field }) => (
          <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${mode === 'full' ? 'border-gray-300 bg-[#F8F5F0]' : 'border-[#EFE5DB] bg-white'}`}>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className={`cursor-pointer ${mode === 'full' ? 'text-sm text-gray-700 font-normal' : 'font-martel text-sm font-normal text-primary'}`}>
                Želim primati novosti i posebne ponude
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`w-full text-white font-semibold py-6 disabled:opacity-50 ${mode === 'full' ? 'bg-[#1E4528] hover:bg-[#1E4528]/90' : 'bg-primary hover:bg-primary/90 font-martel'}`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 animate-spin" size={20} />
            Slanje...
          </>
        ) : (
          <>
            Rezerviši
            <ArrowRight className="ml-2" size={20} />
          </>
        )}
      </Button>
    </>
  );

  // Form-only mode: complete form with all fields, no background or contact info (for apartment pages)
  if (mode === 'form-only') {
    return (
      <div className="bg-[#F8F5F0] rounded-lg p-8">
        <h3 className="font-clash font-normal text-[24px] lg:text-[32px] text-primary mb-2">
          Rezervacija
        </h3>
        <p className="font-martel text-sm text-[#616261] mb-6">
          Molimo ispunite donji obrazac. Za više informacija pozovite +38766055455.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderFormFields()}
          </form>
        </Form>
      </div>
    );
  }

  // Simple mode: minimal form (if needed)
  if (mode === 'simple') {
    return (
      <div className="bg-[#F8F5F0] rounded-lg p-8">
        <h3 className="font-clash font-normal text-[24px] lg:text-[32px] text-primary mb-2">
          Rezervacija
        </h3>
        <p className="font-martel text-sm text-[#616261] mb-6">
          Molimo ispunite donji obrazac. Za više informacija pozovite +38766055455.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderFormFields()}
          </form>
        </Form>
      </div>
    );
  }

  // Full mode: with background, tabs, and contact info (for homepage)
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${resortBg})` }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab("apartman")}
                className={`flex-1 py-4 text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeTab === "apartman"
                    ? "text-[#1E4528] border-b-2 border-[#1E4528]"
                    : "text-gray-500"
                }`}
              >
                APARTMAN
              </button>
              <button
                onClick={() => setActiveTab("restoran")}
                className={`flex-1 py-4 text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeTab === "restoran"
                    ? "text-[#1E4528] border-b-2 border-[#1E4528]"
                    : "text-gray-500"
                }`}
              >
                RESTORAN
              </button>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-serif mb-4 text-[#1E4528]">Rezervacija</h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Molimo ispunite donji obrazac. Nakon što ispunite obrazac, kliknite dugmad u nastavku
              kako biste završili rezervaciju. Za više informacija pozovite +38766055455. Djeca od 0-5
              godina besplatno / Od 6-12 godina plaćaju 15€ po noći.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderFormFields()}
              </form>
            </Form>
          </div>

          {/* Contact Information Section */}
          <div className="relative backdrop-blur-2xl bg-black/50 rounded-3xl border border-white/20 p-10 shadow-2xl overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10 text-white space-y-8">
              <h3 className="text-2xl font-serif mb-8">Kontakt informacije</h3>
              
              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-lg mb-8">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2875.8425841247243!2d18.386345876453635!3d43.81101937109399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4758c83a71f8e259%3A0xbce2557478218f21!2sToplik%20Village%20Resort!5e0!3m2!1sen!2sba!4v1732993027485!5m2!1sen!2sba"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
              
              {/* Address Card */}
              <div className="group space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#CAA564] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(202,165,100,0.5)] group-hover:scale-110">
                  <svg className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider opacity-80 mb-2">Adresa</h4>
                  <p className="text-lg leading-relaxed mb-3">
                    Vuka Karadžića 250, 71123 Istočno Novo<br />
                    Sarajevo, Bosna i Hercegovina
                  </p>
                  <a 
                    href="https://www.google.com/maps/place/Toplik+Village+Resort/@43.8110194,18.3863459,622m/data=!3m1!1e3!4m9!3m8!1s0x4758c83a71f8e259:0xbce2557478218f21!5m2!4m1!1i2!8m2!3d43.8110194!4d18.3889208!16s%2Fg%2F12mkzc7jp?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-sm font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105"
                  >
                    Navigacija
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#CAA564] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(202,165,100,0.5)] group-hover:scale-110">
                  <Phone className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider opacity-80 mb-2">Telefon</h4>
                  <p className="text-xl font-light mb-3">+387 (0) 57 32 14 55</p>
                  <a 
                    href="tel:+38757321455" 
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-sm font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105"
                  >
                    Pozovi
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="group space-y-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#CAA564] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(202,165,100,0.5)] group-hover:scale-110">
                  <Mail className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div>
                  <h4 className="text-sm uppercase tracking-wider opacity-80 mb-2">Email</h4>
                  <p className="text-lg mb-3">
                    villageresort@toplik.ba<br />
                    restoran@toplik.ba
                  </p>
                  <a 
                    href="mailto:villageresort@toplik.ba" 
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-sm font-medium hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105"
                  >
                    Pošalji email
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
