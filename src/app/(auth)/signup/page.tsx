import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Registrácia</CardTitle>
            <CardDescription>
              Zákazník alebo profesionál — onboarding flow príde v MVP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Meno a priezvisko</Label>
              <Input id="fullName" placeholder="Ján Novák" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="vas@email.sk" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" disabled>
              Vytvoriť účet (placeholder)
            </Button>
            <p className="text-sm text-muted-foreground">
              Už máte účet?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Prihlásenie
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
