
import TechDocsHeader from "@/components/tech-docs/TechDocsHeader";
import CurrentArchitecture from "@/components/tech-docs/CurrentArchitecture";
import EnhancedFeatures from "@/components/tech-docs/EnhancedFeatures";
import DatabaseSchema from "@/components/tech-docs/DatabaseSchema";
import SecurityFeatures from "@/components/tech-docs/SecurityFeatures";
import ApiIntegration from "@/components/tech-docs/ApiIntegration";
import PerformanceScalability from "@/components/tech-docs/PerformanceScalability";
import ImplementationTimeline from "@/components/tech-docs/ImplementationTimeline";
import DevelopmentSetup from "@/components/tech-docs/DevelopmentSetup";

const TechnicalDocumentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <TechDocsHeader />
        
        <div className="space-y-8">
          <CurrentArchitecture />
          <EnhancedFeatures />
          <DatabaseSchema />
          <SecurityFeatures />
          <ApiIntegration />
          <PerformanceScalability />
          <ImplementationTimeline />
          <DevelopmentSetup />
        </div>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
