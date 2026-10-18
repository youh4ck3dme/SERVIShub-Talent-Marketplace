import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin & operácie</h1>
        <p className="text-muted-foreground">
          Chránené middleware (`/admin/*`). Role check a moderácia prídu v MVP.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Profily na overenie",
            body: "Moderácia verifikácie a poistenia",
          },
          {
            title: "Transakcie",
            body: "Monitoring platieb a provízií",
          },
          {
            title: "Tickety",
            body: "Podpora a disputes",
          },
        ].map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle className="text-base">{card.title}</CardTitle>
              <CardDescription>{card.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
