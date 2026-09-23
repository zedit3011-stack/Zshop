import React from 'react';
import {
  Headphones,
  Laptop,
  Home,
  Shirt,
  Watch,
  Footprints,
  Coffee,
  Armchair,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const CategoryGrid: React.FC = () => {
  const { categories, setFilters, setCurrentView } = useStore();

  const getCategoryIcon = (iconName: string) => {
    const className = 'w-5 h-5 text-blue-600';
    switch (iconName) {
      case 'Headphones':
        return <Headphones className={className} />;
      case 'Laptop':
        return <Laptop className={className} />;
      case 'Home':
        return <Home className={className} />;
      case 'Shirt':
        return <Shirt className={className} />;
      case 'Watch':
        return <Watch className={className} />;
      case 'Footprints':
        return <Footprints className={className} />;
      case 'Coffee':
        return <Coffee className={className} />;
      case 'Armchair':
        return <Armchair className={className} />;
      default:
        return <Headphones className={className} />;
    }
  };

  const handleSelect = (category: Category) => {
    setFilters((prev) => ({
      ...prev,
      category: category.name
    }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="mb-14" id="zstore-categories-section">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shop by Department
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curated categories with certified authenticity and direct warranties.
          </p>
        </div>
        <button
          onClick={() => {
            setFilters((prev) => ({ ...prev, category: 'all' }));
            setCurrentView('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
        >
          <span>All Departments</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelect(cat)}
            className="group cursor-pointer bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-center flex flex-col items-center justify-between"
            id={`category-item-${cat.id}`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors mb-2.5">
              <div className="group-hover:text-white transition-colors">
                {getCategoryIcon(cat.iconName)}
              </div>
            </div>
            <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-1">
              {cat.name}
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">
              {cat.itemCount}+ Items
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
