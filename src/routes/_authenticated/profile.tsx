import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [name, setName] = useState("Teacher");
  const [phone, setPhone] = useState("");
  const [instituteName, setInstituteName] = useState("");
//   const [email, setEmail] = useState("");

 useEffect(() => {
  async function load() {
    const { data } = await supabase
      .from("teachers")
      .select("full_name, mobile, institute_name")
      .maybeSingle();

    if (data) {
  setName(data.full_name ?? "Teacher");
  setPhone(data.mobile ?? "");
  setInstituteName(data.institute_name ?? "");
}
  }

  load();
}, []);

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

            <Avatar className="h-28 w-28 border-4 border-background shadow-xl">

                <AvatarFallback className="bg-primary text-5xl font-bold">

                  {name.charAt(0)}

                </AvatarFallback>

              </Avatar>

              <Button
                size="icon"
                className="absolute bottom-2 right-2 rounded-full"
              >
                <Camera size={18} />
              </Button>

            </div>

           <h1 className="mt-4 text-3xl font-bold text-center">
  {instituteName || "Institute Name"}
</h1>

<p className="mt-1 text-sm text-muted-foreground">
  Managed by {name}
</p>

            <p className="mt-3 text-muted-foreground">
              {/* {email} */}
            </p>

          </div>

         <div className="mt-6 grid gap-4 md:grid-cols-2">

            <Card>
              <CardContent className="flex items-center gap-4 p-4">

                <User className="text-primary" />

                <div>

                  <p className="text-sm text-muted-foreground">
                    Full Name
                  </p>

                  <p className="font-semibold">
                    {name}
                  </p>

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
      <p className="text-sm text-muted-foreground">
        Mobile Number
      </p>

      <p className="font-semibold">
        {phone}
      </p>
    </div>

  </CardContent>
</Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">

                <Calendar className="text-primary" />

                <div>

                  <p className="text-sm text-muted-foreground">
                    Joined
                  </p>

                  <p>2026</p>

                </div>

              </CardContent>
            </Card>

          </div>

          <div className="mt-8 flex justify-end">

            <Button size="lg">
              Edit Profile
            </Button>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}