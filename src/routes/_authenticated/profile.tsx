import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, User, Mail, Phone, Calendar, Camera } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import imageCompression from "browser-image-compression";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState("Teacher");
  const [phone, setPhone] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  //   const [email, setEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("teachers")
        .select("full_name, mobile, institute_name, logo_url")
        .maybeSingle();

      if (data) {
        setName(data.full_name ?? "Teacher");
        setPhone(data.mobile ?? "");
        setInstituteName(data.institute_name ?? "");
        setLogoUrl(data.logo_url ?? "");
      }
    }

    load();
  }, []);
  async function uploadLogo(file: File) {
    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Maximum upload size is 5 MB");
        return;
      }
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.15,
        maxWidthOrHeight: 512,
        initialQuality: 0.6,
        useWebWorker: true,
      });

      console.log("Original:", (file.size / 1024 / 1024).toFixed(2), "MB");

      console.log("Compressed:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");

      const extension = compressedFile.name.split(".").pop();

      const fileName = `${user.id}/logo.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("institute-logos")
        .upload(fileName, compressedFile, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("institute-logos").getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      await supabase
        .from("teachers")
        .update({
          logo_url: publicUrl,
        })
        .eq("id", user.id);

      setLogoUrl(publicUrl);

      toast.success("Institute logo updated!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <Card className="overflow-hidden border-border">
        <div className="h-36 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700" />

        <CardContent className="-mt-14 pb-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-background bg-card shadow-xl">
                {logoUrl ? (
                  <img src={logoUrl} alt="Institute Logo" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl font-bold text-primary">
                    {instituteName.charAt(0)}
                  </div>
                )}
              </div>

              <label
                htmlFor="logo-upload"
                className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg hover:scale-105 transition"
              >
                {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
              </label>

              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    uploadLogo(e.target.files[0]);
                  }
                }}
              />
            </div>

            <h1 className="mt-4 text-3xl font-bold text-center">
              {instituteName || "Institute Name"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">Managed by {name}</p>

            <p className="mt-3 text-muted-foreground">{/* {email} */}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <User className="text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>

                  <p className="font-semibold">{name}</p>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="flex items-center gap-4 p-5">

                <Mail className="text-primary" />

                <div>

                  <p className="text-sm text-muted-foreground">
                    Email
                  </p>

                  <p>{email}</p>

                </div>

              </CardContent>
            </Card> */}

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Phone className="text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>

                  <p className="font-semibold">{phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Calendar className="text-primary" />

                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>

                  <p>2026</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex justify-end">
            <Button size="lg">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
