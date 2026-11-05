import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function PageNotFoundError() {
  return (
    <main className="not-found-page-container">
      <Card className="not-found-card">
        <CardContent className="not-found-card-content">
          <div className="not-found-header">
            <AlertCircle className="not-found-icon" />
            <h1 className="not-found-title">404 Page Not Found</h1>
          </div>

          <p className="not-found-description">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
