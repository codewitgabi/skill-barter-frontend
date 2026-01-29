"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiDelete } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function AccountActions() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();

  // Prevent hydration mismatch with Radix UI
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleExport = () => {
    // Handle export logic
    console.log("Exporting data...");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await apiDelete("/users/me");

      if (response.status === "success") {
        logout();
        toast.success("Account deleted successfully", {
          description: "Your account has been permanently deleted.",
        });
        router.push("/auth/signin");
      } else {
        const errorResponse = response as { error: { message: string } };
        toast.error("Failed to delete account", {
          description: errorResponse.error?.message || "Please try again.",
        });
        setIsDeleteOpen(false);
      }
    } catch {
      toast.error("Failed to delete account", {
        description: "An unexpected error occurred. Please try again.",
      });
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Actions</CardTitle>
        <CardDescription>Manage your account actions and data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Export Data</p>
            <p className="text-sm text-muted-foreground">
              Download a copy of your account data
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            Export
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-destructive">Delete Account</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
          {isMounted ? (
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers. You
                    will be logged out and redirected to the sign-in page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button variant="destructive" disabled>
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountActions;
