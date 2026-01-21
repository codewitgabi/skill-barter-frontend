"use client";

import { Button } from "@/components/ui/button";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { cn } from "@/lib/utils";

interface CategoryFiltersProps {
  categories: Array<{
    id: string;
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  }>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function CategoryFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFiltersProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "rounded-full",
                isActive && "bg-primary text-primary-foreground",
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilters;
