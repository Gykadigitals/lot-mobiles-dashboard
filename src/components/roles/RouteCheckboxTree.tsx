import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const RouteCheckboxTree = ({ items, selectedRoutes, onToggle, readonly = false }: { items: any[], selectedRoutes: string[], onToggle?: (path: string) => void, readonly?: boolean }) => {
  return (
    <ul className="space-y-1">
      {items.map((item, idx) => (
        <RouteCheckboxTreeNode key={`${item.name}-${idx}`} item={item} selectedRoutes={selectedRoutes} onToggle={onToggle} readonly={readonly} />
      ))}
    </ul>
  );
};

const RouteCheckboxTreeNode = ({ item, selectedRoutes, onToggle, readonly }: { item: any, selectedRoutes: string[], onToggle?: (path: string) => void, readonly?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  return (
    <li className="flex flex-col">
      <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        {hasSubItems ? (
           <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0">
             <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
           </button>
        ) : (
           <div className="w-6 shrink-0" />
        )}
        
        {item.path ? (
          <label className={`flex items-center gap-2.5 flex-1 ${readonly ? 'cursor-default' : 'cursor-pointer'}`}>
            <input 
              type="checkbox" 
              checked={selectedRoutes.includes(item.path)}
              onChange={() => !readonly && onToggle && onToggle(item.path)}
              disabled={readonly}
              className="w-4 h-4 text-brand-500 rounded border-gray-300 dark:border-gray-600 focus:ring-brand-500 dark:bg-gray-700 disabled:opacity-75"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium capitalize flex items-center gap-2">
              {item.icon && <span className="text-gray-400 flex items-center justify-center w-4 h-4 shrink-0">{item.icon}</span>}
              {item.name}
            </span>
          </label>
        ) : (
          <div className="flex items-center gap-2.5 flex-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
             <span className="text-sm text-gray-700 dark:text-gray-300 font-medium capitalize flex items-center gap-2">
              {item.icon && <span className="text-gray-400 flex items-center justify-center w-4 h-4 shrink-0">{item.icon}</span>}
              {item.name}
            </span>
          </div>
        )}
      </div>
      
      {hasSubItems && (
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="pl-3 border-l border-gray-200 dark:border-gray-700 ml-4 mt-1">
              <RouteCheckboxTree items={item.subItems} selectedRoutes={selectedRoutes} onToggle={onToggle} readonly={readonly} />
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
