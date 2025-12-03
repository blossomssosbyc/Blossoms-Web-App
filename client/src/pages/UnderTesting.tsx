import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnderTesting() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-yellow-500/50 bg-yellow-500/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
            <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            Under Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            This page is currently under testing process. Access is restricted at this time.
            Please check back later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
