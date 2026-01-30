import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, ArrowLeft } from "lucide-react";

function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-none">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <UserX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The user you&apos;re looking for doesn&apos;t exist or may have been removed.
              </p>
              <Button asChild>
                <Link href="/me/browse-skills" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Skills
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfileNotFound;
