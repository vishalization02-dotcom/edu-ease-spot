import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Mail,
  Phone,
  Calendar,
  User,
  Pencil,
} from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  email?: string;
};

export default function ProfileDialog({
  open,
  onOpenChange,
  userName,
  email,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-border bg-card p-0 overflow-hidden">

        <div className="h-40 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />

        <DialogHeader className="-mt-16 px-8 pb-8">

          <div className="relative mx-auto w-fit">

            <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
              <AvatarFallback className="bg-primary text-4xl font-bold">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <button
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105"
            >
              <Pencil size={16} />
            </button>

          </div>

          <DialogTitle className="mt-4 text-center text-3xl font-bold">
            {userName}
          </DialogTitle>

          <div className="mt-2 flex justify-center">
            <Badge className="rounded-full px-4 py-1">
              Teacher
            </Badge>
          </div>

          <p className="mt-2 text-center text-muted-foreground">
            {email}
          </p>

        </DialogHeader>

        <div className="grid gap-4 px-8 pb-8">

          <Card className="flex items-center gap-4 p-4">
            <User className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">
                Full Name
              </p>
              <p className="font-medium">{userName}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-4">
            <Mail className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">
                Email
              </p>
              <p>{email}</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-4">
            <Phone className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">
                Phone
              </p>
              <p>Not Added</p>
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-4">
            <Calendar className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">
                Joined
              </p>
              <p>2026</p>
            </div>
          </Card>

          <Button size="lg" className="mt-2 rounded-xl">
            Edit Profile
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}