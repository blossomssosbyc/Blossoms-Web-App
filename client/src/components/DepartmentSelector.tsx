import { Button } from "@/components/ui/button";

const DEPARTMENTS = [
  { id: "bca", name: "BCA", fullName: "Bachelor of Computer Applications" },
  { id: "bsc-cm", name: "BSc CM", fullName: "BSc in Computational Mathematics" },
  { id: "mds", name: "M.DS", fullName: "Master of Data Science" },
  { id: "ms-ai-cs", name: "MS AI & CS", fullName: "MS in AI & Computer Science" },
  { id: "bems", name: "B.EMS", fullName: "Bachelor of Environmental Science" },
];

interface DepartmentSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function DepartmentSelector({ selected, onChange }: DepartmentSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {DEPARTMENTS.map((dept) => (
        <Button
          key={dept.id}
          variant={selected === dept.id ? "default" : "outline"}
          onClick={() => onChange(dept.id)}
          className="font-medium"
          data-testid={`button-dept-${dept.id}`}
        >
          {dept.name}
        </Button>
      ))}
    </div>
  );
}

export { DEPARTMENTS };
