import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, RotateCcw, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const dataFields = [
  { id: "overview", label: "Event Overview", category: "General" },
  { id: "participants", label: "Participant Statistics", category: "General" },
  { id: "points", label: "Department Points", category: "Performance" },
  { id: "rankings", label: "Department Rankings", category: "Performance" },
  { id: "events", label: "Event Details", category: "Events" },
  { id: "timeline", label: "Timeline Summary", category: "Events" },
  { id: "trends", label: "Performance Trends", category: "Analytics" },
  { id: "categories", label: "Category Breakdown", category: "Analytics" },
];

const chartTypes = [
  { id: "bar", label: "Bar Charts" },
  { id: "line", label: "Line Graphs" },
  { id: "pie", label: "Pie Charts" },
  { id: "table", label: "Data Tables" },
];

export default function ReportGeneration() {
  const [selectedFields, setSelectedFields] = useState<string[]>(["overview", "points"]);
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["bar", "table"]);
  const [layout, setLayout] = useState<"single" | "multi">("single");

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const toggleChart = (chartId: string) => {
    setSelectedCharts(prev =>
      prev.includes(chartId)
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  const resetSelections = () => {
    setSelectedFields(["overview", "points"]);
    setSelectedCharts(["bar", "table"]);
    setLayout("single");
  };

  const categories = Array.from(new Set(dataFields.map(f => f.category)));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Report Generation</h1>
          <p className="text-muted-foreground">Customize and generate your event report</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Data Selection</h3>
              <div className="space-y-6">
                {categories.map(category => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-3">{category}</h4>
                    <div className="space-y-2">
                      {dataFields
                        .filter(field => field.category === category)
                        .map(field => (
                          <div key={field.id} className="flex items-center gap-2">
                            <Checkbox
                              id={field.id}
                              checked={selectedFields.includes(field.id)}
                              onCheckedChange={() => toggleField(field.id)}
                              data-testid={`checkbox-${field.id}`}
                            />
                            <Label htmlFor={field.id} className="cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Chart Types</h3>
              <div className="space-y-2">
                {chartTypes.map(chart => (
                  <div key={chart.id} className="flex items-center gap-2">
                    <Checkbox
                      id={chart.id}
                      checked={selectedCharts.includes(chart.id)}
                      onCheckedChange={() => toggleChart(chart.id)}
                      data-testid={`checkbox-chart-${chart.id}`}
                    />
                    <Label htmlFor={chart.id} className="cursor-pointer">
                      {chart.label}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Layout</h3>
              <div className="space-y-2">
                <Button
                  variant={layout === "single" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setLayout("single")}
                  data-testid="button-layout-single"
                >
                  Single Column
                </Button>
                <Button
                  variant={layout === "multi" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setLayout("multi")}
                  data-testid="button-layout-multi"
                >
                  Multi Column
                </Button>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={resetSelections}
                data-testid="button-reset"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                variant="default"
                className="flex-1 gap-2"
                data-testid="button-export"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Report Preview</h3>
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-preview">
                <Eye className="w-4 h-4" />
                Full Preview
              </Button>
            </div>

            <div className={`space-y-6 ${layout === "multi" ? "lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0" : ""}`}>
              {selectedFields.map(fieldId => {
                const field = dataFields.find(f => f.id === fieldId);
                return (
                  <Card key={fieldId} className="p-4 border-2 border-dashed" data-testid={`preview-${fieldId}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{field?.label}</h4>
                      <Badge variant="secondary">{field?.category}</Badge>
                    </div>
                    <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center text-sm text-muted-foreground">
                      {selectedCharts.includes("bar") && fieldId.includes("points") ? "Bar Chart Preview" :
                       selectedCharts.includes("table") ? "Data Table Preview" :
                       selectedCharts.includes("pie") && fieldId.includes("categories") ? "Pie Chart Preview" :
                       selectedCharts.includes("line") && fieldId.includes("trends") ? "Line Graph Preview" :
                       "Content Preview"}
                    </div>
                  </Card>
                );
              })}

              {selectedFields.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Select data fields from the sidebar to preview your report
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="text-sm space-y-1">
                <p className="font-medium">Report Configuration:</p>
                <p className="text-muted-foreground">
                  {selectedFields.length} data section{selectedFields.length !== 1 ? 's' : ''}, {selectedCharts.length} chart type{selectedCharts.length !== 1 ? 's' : ''}, {layout} column layout
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
