
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code } from "lucide-react";

const TechDocsHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-800"
      >
        ← Back to SnakesList
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
          <Code className="w-10 h-10 mr-4 text-blue-400" />
          Technical Documentation
        </h1>
        <p className="text-slate-400 text-lg">Complete technical overview and roadmap for SnakesList platform</p>
      </div>
    </>
  );
};

export default TechDocsHeader;
