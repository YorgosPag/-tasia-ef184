import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Welcome to TASIA
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your premier real estate index. Navigate properties with ease.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the sidebar on the left to navigate through the property listings. The "Ευρετήριο Ακινήτων" section contains all available properties. More features coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
