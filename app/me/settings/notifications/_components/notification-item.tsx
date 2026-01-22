import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { NotificationSettings } from "./types";

interface NotificationItemProps {
  icon: React.ElementType;
  label: string;
  description: string;
  category: keyof NotificationSettings;
  settingKey: string;
  value: boolean;
  onUpdate: (category: keyof NotificationSettings, settingKey: string, value: boolean) => void;
}

function NotificationItem({
  icon: Icon,
  label,
  description,
  category,
  settingKey,
  value,
  onUpdate,
}: NotificationItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 rounded-lg bg-accent">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <Label htmlFor={`${category}-${settingKey}`} className="font-medium cursor-pointer">
            {label}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <Switch
        id={`${category}-${settingKey}`}
        checked={value}
        onCheckedChange={(checked) => onUpdate(category, settingKey, checked)}
      />
    </div>
  );
}

export default NotificationItem;
