"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search } from "lucide-react";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <MessageCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
      <p className="text-muted-foreground max-w-[300px] mb-6">
        Connect with other skill barterers to start exchanging messages
      </p>
      <Button asChild>
        <Link href="/@me/browse-skills">
          <Search className="h-4 w-4 mr-2" />
          Browse Skills
        </Link>
      </Button>
    </div>
  );
}

export default EmptyState;
