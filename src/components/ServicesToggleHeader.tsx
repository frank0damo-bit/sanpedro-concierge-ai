import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ServicesToggleHeaderProps {
  activeGroup: string;
  setActiveGroup: (group: string) => void;
}

export default function ServicesToggleHeader({ activeGroup, setActiveGroup }: ServicesToggleHeaderProps) {
  return (
    <div className="text-center mb-12">
      <ToggleGroup
        type="single"
        value={activeGroup}
        onValueChange={(value) => {
          if (value) setActiveGroup(value);
        }}
        className="inline-flex"
      >
        <ToggleGroupItem value="Vacation" aria-label="Toggle vacation services">
          I'm Travelling
        </ToggleGroupItem>
        <ToggleGroupItem value="Relocation" aria-label="Toggle relocation services">
          I'm Moving
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
