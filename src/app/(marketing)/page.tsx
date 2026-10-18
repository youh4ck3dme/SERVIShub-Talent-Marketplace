import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MarketingHomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-primary text-primary-foreground">
              Marketplace lokálnych služieb
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Overení remeselníci. Rýchla rezervácia. Bezpečné platby.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              ServisHub SK spája zákazníkov s lokálnymi profesionálmi —
              upratovanie, opravy, inštalácie a údržba. S verifikáciou, poistením
              a CRM pre remeselníkov.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/hladat">Nájsť službu</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Stať sa profesionálom</Link>
              </Button>
            </div>
          </div>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Prihlásenie na waitlist</CardTitle>
              <CardDescription>
                Spúšťame najprv v Bratislave. Nechaj email a dáme vedieť.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  name="email"
                  placeholder="vas@email.sk"
                  required
                  className="flex-1"
                  aria-label="Email"
                />
                <Button type="submit" variant="secondary">
                  Chcem vedieť
                </Button>
              </form>
              <p className="mt-3 text-xs text-muted-foreground">
                Scaffold placeholder — napojenie na lead capture príde v MVP.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="border-t border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3">
            {[
              {
                title: "Pre zákazníkov",
                body: "Vyhľadávanie podľa lokality, online rezervácia a sledovanie objednávky.",
              },
              {
                title: "Pre profesionálov",
                body: "Kalendár, leady, cenník, reporting a predplatné s prioritným zobrazením.",
              },
              {
                title: "Dôvera & bezpečnosť",
                body: "Verifikácia, recenzie, escrow/depozit a riešenie sporov.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ServisHub SK · Scaffold
      </footer>
    </div>
  );
}
