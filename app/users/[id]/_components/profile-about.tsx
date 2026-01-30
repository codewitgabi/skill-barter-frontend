import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileAboutProps {
  bio: string;
}

function ProfileAbout({ bio }: ProfileAboutProps) {
  if (!bio) return null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {bio}
        </p>
      </CardContent>
    </Card>
  );
}

export default ProfileAbout;
