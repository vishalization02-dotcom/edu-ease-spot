import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassRow } from "@/lib/classledger-data";

export function ClassSelector({
  classes,
  value,
  onChange,
  includeAll = false,
  placeholder = "Select a class",
  className = "h-10 w-[220px]",
}: {
  classes: ClassRow[];
  value: string | undefined;
  onChange: (id: string) => void;
  includeAll?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="__all__">All classes</SelectItem>}
        {classes.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
