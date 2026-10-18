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

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Prihlásenie</CardTitle>
            <CardDescription>
              Email, SMS alebo OAuth — napojenie na Supabase Auth príde v MVP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              Prihlásiť sa (placeholder)
            </Button>
            <p className="text-sm text-muted-foreground">
              Nemáte účet?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Registrácia
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
