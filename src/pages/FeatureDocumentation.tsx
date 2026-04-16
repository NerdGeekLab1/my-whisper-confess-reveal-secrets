import FeatureOverviewStats from "@/components/feature-docs/FeatureOverviewStats";
import FeatureCategoryCard from "@/components/feature-docs/FeatureCategoryCard";
import NavigationGuide from "@/components/feature-docs/NavigationGuide";
import TechnicalNotes from "@/components/feature-docs/TechnicalNotes";
import { features } from "@/components/feature-docs/featureData";

const FeatureDocumentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">TruthSpace Feature Documentation</h1>
          <p className="text-slate-400 text-lg">
            Comprehensive guide to all implemented and planned features in the TruthSpace platform
          </p>
        </div>

        <FeatureOverviewStats />

        <div className="space-y-8">
          {features.map((category, index) => (
            <FeatureCategoryCard
              key={index}
              category={category.category}
              icon={category.icon}
              color={category.color}
              items={category.items}
            />
          ))}
        </div>

        <NavigationGuide />
        <TechnicalNotes />
      </div>
    </div>
  );
};

export default FeatureDocumentation;
