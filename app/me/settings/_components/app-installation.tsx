"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import { PWAInstallCard } from "@/components/pwa-install-button";

function AppInstallation() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          <CardTitle>App Installation</CardTitle>
        </div>
        <CardDescription>
          Install Skill Barter as an app on your device for the best experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PWAInstallCard />
      </CardContent>
    </Card>
  );
}

export default AppInstallation;
