
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const categories = [
    { id: "all", label: "All Stories", count: 156 },
    { id: "long-term", label: "Long-term", count: 45 },
    { id: "marriage", label: "Marriage", count: 32 },
    { id: "engagement", label: "Engagement", count: 18 },
    { id: "dating", label: "Dating", count: 38 },
    { id: "friends", label: "Friends", count: 12 },
    { id: "workplace", label: "Workplace", count: 8 },
    { id: "online", label: "Online", count: 23 }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors",
              selectedCategory === category.id && "bg-slate-700 border-slate-500 text-white"
            )}
          >
            {category.label}
            <Badge className="ml-2 bg-slate-600 text-slate-300 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
