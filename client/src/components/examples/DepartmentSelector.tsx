import { useState } from "react";
import DepartmentSelector from "../DepartmentSelector";

export default function DepartmentSelectorExample() {
  const [selected, setSelected] = useState("bca");

  return (
    <div className="p-8 bg-background">
      <DepartmentSelector selected={selected} onChange={setSelected} />
    </div>
  );
}
