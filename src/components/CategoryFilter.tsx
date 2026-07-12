
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
    <div className="space-y-4" data-testid="category-filter">
      <h2 className="text-xl font-semibold text-white">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-colors",
              selectedCategory === category.id && "bg-slate-700 border-slate-500 text-white"
            )}
          >
            {category.label}
            <Badge className={cn(
              "ml-2 text-xs border border-slate-600/50",
              selectedCategory === category.id
                ? "bg-slate-900/60 text-slate-100"
                : "bg-slate-800 text-slate-300"
            )}>
              {category.count}
            </Badge>
          </Button>
        ))}

      </div>
    </div>
  );
};

export default CategoryFilter;
