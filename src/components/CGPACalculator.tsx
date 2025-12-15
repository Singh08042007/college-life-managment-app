import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calculator, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
  totalMarks: string;
  obtainedMarks: string;
  credits: string;
}

const CGPACalculator = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "", totalMarks: "100", obtainedMarks: "", credits: "3" }
  ]);
  const [calculatedCGPA, setCalculatedCGPA] = useState<number | null>(null);
  const [totalPercentage, setTotalPercentage] = useState<number | null>(null);

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: "",
      totalMarks: "100",
      obtainedMarks: "",
      credits: "3"
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length === 1) {
      toast.error("At least one subject is required");
      return;
    }
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const getGradePoint = (percentage: number): number => {
    if (percentage >= 90) return 10;
    if (percentage >= 80) return 9;
    if (percentage >= 70) return 8;
    if (percentage >= 60) return 7;
    if (percentage >= 50) return 6;
    if (percentage >= 40) return 5;
    return 0;
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return "O (Outstanding)";
    if (percentage >= 80) return "A+ (Excellent)";
    if (percentage >= 70) return "A (Very Good)";
    if (percentage >= 60) return "B+ (Good)";
    if (percentage >= 50) return "B (Above Average)";
    if (percentage >= 40) return "C (Average)";
    return "F (Fail)";
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;
    let totalObtained = 0;
    let totalMaxMarks = 0;

    for (const subject of subjects) {
      const obtained = parseFloat(subject.obtainedMarks);
      const total = parseFloat(subject.totalMarks);
      const credits = parseFloat(subject.credits);

      if (isNaN(obtained) || isNaN(total) || isNaN(credits)) {
        toast.error("Please fill all fields with valid numbers");
        return;
      }

      if (obtained > total) {
        toast.error("Obtained marks cannot exceed total marks");
        return;
      }

      if (obtained < 0 || total <= 0 || credits <= 0) {
        toast.error("Please enter valid positive numbers");
        return;
      }

      const percentage = (obtained / total) * 100;
      const gradePoint = getGradePoint(percentage);

      totalCredits += credits;
      totalGradePoints += gradePoint * credits;
      totalObtained += obtained;
      totalMaxMarks += total;
    }

    const cgpa = totalGradePoints / totalCredits;
    const overallPercentage = (totalObtained / totalMaxMarks) * 100;

    setCalculatedCGPA(parseFloat(cgpa.toFixed(2)));
    setTotalPercentage(parseFloat(overallPercentage.toFixed(2)));
    toast.success("CGPA calculated successfully!");
  };

  const resetCalculator = () => {
    setSubjects([{ id: "1", name: "", totalMarks: "100", obtainedMarks: "", credits: "3" }]);
    setCalculatedCGPA(null);
    setTotalPercentage(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-5 w-5 text-primary" />
            CGPA Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your subjects with marks to calculate your predicted CGPA
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="grid grid-cols-12 gap-3 items-end p-4 rounded-lg bg-muted/30 border border-border/30">
              <div className="col-span-12 sm:col-span-3">
                <Label className="text-xs text-muted-foreground">Subject Name</Label>
                <Input
                  placeholder={`Subject ${index + 1}`}
                  value={subject.name}
                  onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Total Marks</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={subject.totalMarks}
                  onChange={(e) => updateSubject(subject.id, "totalMarks", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <Label className="text-xs text-muted-foreground">Obtained Marks</Label>
                <Input
                  type="number"
                  placeholder="Enter marks"
                  value={subject.obtainedMarks}
                  onChange={(e) => updateSubject(subject.id, "obtainedMarks", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">Credits</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={subject.credits}
                  onChange={(e) => updateSubject(subject.id, "credits", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1 sm:col-span-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubject(subject.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={addSubject} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
            <Button onClick={calculateCGPA} className="gap-2">
              <Calculator className="h-4 w-4" />
              Calculate CGPA
            </Button>
            <Button variant="ghost" onClick={resetCalculator}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {calculatedCGPA !== null && totalPercentage !== null && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Your Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">Predicted CGPA</p>
                <p className="text-4xl font-bold text-primary">{calculatedCGPA}</p>
                <p className="text-xs text-muted-foreground mt-1">out of 10</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">Overall Percentage</p>
                <p className="text-4xl font-bold text-foreground">{totalPercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">aggregate</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">Grade</p>
                <p className="text-2xl font-bold text-foreground">{getGrade(totalPercentage)}</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm font-medium mb-2">Grade Scale Reference:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                <span>90%+ → 10 (O)</span>
                <span>80-89% → 9 (A+)</span>
                <span>70-79% → 8 (A)</span>
                <span>60-69% → 7 (B+)</span>
                <span>50-59% → 6 (B)</span>
                <span>40-49% → 5 (C)</span>
                <span>&lt;40% → 0 (F)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CGPACalculator;
