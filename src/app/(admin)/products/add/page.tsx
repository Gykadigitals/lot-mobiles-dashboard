"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Save, Plus, Trash2, Upload, X, Image as ImageIcon, GripVertical,
  Smartphone, Database, Monitor, Ruler, Cpu, Battery, Camera, Wifi, Film, FileText, Package
} from 'lucide-react';

const PHONE_COLORS = [
  "Midnight Black", "Phantom Black", "Space Black", "Onyx Black", "Obsidian", "Cosmic Black", "Matte Black", "Jet Black", "Piano Black", "Aura Black",
  "Pearl White", "Ceramic White", "Alpine White", "Starlight", "Cloud White", "Snow", "Prism White", "Aura White", "Cream", "Ivory",
  "Sierra Blue", "Midnight Blue", "Pacific Blue", "Sky Blue", "Ice Blue", "Ocean Blue", "Navy Blue", "Deep Blue", "Aqua", "Sapphire",
  "Olive Green", "Emerald Green", "Forest Green", "Mint Green", "Pine Green", "Midnight Green", "Sage", "Hazel", "Teal", "Jade",
  "Sunset Gold", "Rose Gold", "Champagne Gold", "Sunrise Gold", "Bronze", "Mystic Bronze", "Copper", "Aura Glow", "Sand", "Desert Titanium",
  "Titanium", "Graphite", "Silver", "Space Gray", "Lunar Silver", "Platinum", "Steel", "Iron", "Meteorite", "Quicksilver",
  "Purple", "Lavender", "Violet", "Deep Purple", "Lilac", "Orchid", "Plum", "Amethyst", "Indigo", "Mulberry",
  "Pink", "Coral", "Rose", "Blush", "Peach", "Flamingo", "Magenta", "Fuchsia", "Hot Pink", "Ruby",
  "Red", "Product RED", "Crimson", "Burgundy", "Bordeaux", "Scarlet", "Cherry", "Garnet", "Carmine", "Wine",
  "Yellow", "Canary Yellow", "Lemon", "Gold", "Mustard", "Amber", "Orange", "Tangerine", "Sunset", "Papaya"
];

const RAM_OPTIONS = [
  "1GB", "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB", "18GB", "24GB"
];

const ROM_OPTIONS = [
  "4GB", "8GB", "16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"
];

interface SpecificationItem {
  id: string;
  type: 'text' | 'color' | 'title' | 'list';
  key: string;
  value: string;
  listItems?: string[];
}

interface SpecificationCategory {
  id: string;
  name: string;
  items: SpecificationItem[];
}

const ALL_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Processor",
  "Memory & Storage",
  "Camera",
  "Battery",
  "Connectivity",
  "Multimedia",
  "Audio Features",
  "Features",
  "Video Features",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing, Packing & Imported Info",
  "Remote Control Features",
  "Power Features",
  "Network & Connectivity",
  "Remote Control Features",
  "Special Features",
  "Air flow & filter features",
  "Performance"
];

const MOBILES_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Processor",
  "Memory & Storage",
  "Camera",
  "Battery",
  "Connectivity",
  "Multimedia",
  "Audio Features",
  "Features",
  "Video Features",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing, Packing & Imported Info",
  "Remote Control Features"
];

const TVS_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Processor",
  "Memory & Storage",
  "Camera",
  "Power Features",
  "Connectivity",
  "Multimedia",
  "Audio Features",
  "Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing, Packing & Imported Info",
  "Video Features",
  "Remote Control Features"
];

const LAPTOPS_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Processor",
  "Memory & Storage",
  "Camera",
  "Power Features",
  "Connectivity",
  "Multimedia",
  "Audio Features",
  "Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing, Packing & Imported Info",
  "Video Features"
];

const SMARTWATCH_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Processor",
  "Audio Features",
  "Video Features",
  "Fitness And Heart Rate",
  "Warranty",
  "Memory",
  "Connectivity Features",
  "Camera",
  "Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Manufacturing, Packing and Imported Info"
];

const WIRELESS_HEADPHONE_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Audio Features",
  "Memory",
  "Connectivity",
  "Connectivity Features",
  "Camera",
  "Features",
  "Special Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing",
  "Manufacturing, Packing and Imported Info",
  "Video Features",
  "Remote Control Features"
];

const WIRED_HEADPHONE_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Audio Features",
  "Memory",
  "Connectivity",
  "Connectivity Features",
  "Features",
  "Special Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing",
  "Manufacturing, Packing and Imported Info"
];

const HOME_THEATRE_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Audio Features",
  "Memory",
  "Connectivity",
  "Connectivity Features",
  "Features",
  "Special Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing",
  "Manufacturing, Packing and Imported Info"
];

const SOUND_BAR_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Audio Features",
  "Memory",
  "Connectivity",
  "Connectivity Features",
  "Features",
  "Special Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing",
  "Manufacturing, Packing and Imported Info"
];

const POWER_BANK_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Connectivity",
  "Connectivity Features",
  "Features",
  "Special Features",
  "Battery",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing",
  "Manufacturing, Packing and Imported Info"
];

const TABLETS_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Processor",
  "Memory & Storage",
  "Camera",
  "Battery",
  "Connectivity",
  "Multimedia",
  "Audio Features",
  "Features",
  "Video Features",
  "Product Details",
  "In the Box",
  "Warranty",
  "Manufacturing, Packing & Imported Info",
  "Pencils Control Features"
];

const AC_SPECS_CATEGORIES = [
  "General",
  "Dimensions",
  "Display",
  "Performance",
  "Audio Features",
  "Memory",
  "Connectivity",
  "Connectivity Features",
  "Camera",
  "Features",
  "Air Flow & Filter Features",
  "Battery",
  "Power Features",
  "Product Details",
  "Special Features",
  "In the Box",
  "Warranty",
  "Manufacturing",
  "Manufacturing, Packing and Imported Info",
  "Video Features",
  "Remote Control Features"
];

const getInitialSpecs = (category: string, type: string = ''): SpecificationCategory[] => {
  let specsList = ALL_SPECS_CATEGORIES;

  if (category === 'Mobiles') {
    specsList = MOBILES_SPECS_CATEGORIES;
  } else if (category === 'TV' || category === 'TVs' || category === "TV's") {
    specsList = TVS_SPECS_CATEGORIES;
  } else if (category === 'Laptop' || category === 'Laptops' || category === "Laptop's") {
    specsList = LAPTOPS_SPECS_CATEGORIES;
  } else if (category === 'Tablet' || category === 'Tablets' || category === "Tablet's") {
    specsList = TABLETS_SPECS_CATEGORIES;
  } else if (category === 'AC' || category === 'ACs' || category === "AC's") {
    specsList = AC_SPECS_CATEGORIES;
  } else if (category === 'Accessories' && (type === 'Smart Watch' || type === 'Smart Watches')) {
    specsList = SMARTWATCH_SPECS_CATEGORIES;
  } else if (type === 'Wireless Headphone' || type === 'Wireless Headphones') {
    specsList = WIRELESS_HEADPHONE_SPECS_CATEGORIES;
  } else if (type === 'Wired Headphone' || type === 'Wired Headphones') {
    specsList = WIRED_HEADPHONE_SPECS_CATEGORIES;
  } else if (type === 'Home Theatre' || type === 'Home Theatres') {
    specsList = HOME_THEATRE_SPECS_CATEGORIES;
  } else if (type === 'Sound Bar' || type === 'Sound Bars') {
    specsList = SOUND_BAR_SPECS_CATEGORIES;
  } else if (type === 'Power Bank' || type === 'Power Banks') {
    specsList = POWER_BANK_SPECS_CATEGORIES;
  }

  return specsList.map((cat, idx) => ({
    id: `cat-${idx}-${Date.now()}`,
    name: cat,
    items: [{ id: `item-${Date.now()}-${idx}`, type: 'text', key: '', value: '' }]
  }));
};

export default function AddProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Top Level Controls
  const [enableProduct, setEnableProduct] = useState(true);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Navigation Data State
  const [navData, setNavData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/navigation')
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          setNavData(data.items);
        }
      })
      .catch(err => console.error("Failed to fetch navigation categories", err));
  }, []);

  // Conditional UI State
  const [hasWeight, setHasWeight] = useState('This item has no weight');

  // Variations State
  const [variations, setVariations] = useState([
    { id: 1, color: '', ram: '', rom: '', badge: '', images: [] as string[] }
  ]);

  // Step State
  const [currentStep, setCurrentStep] = useState(1);

  // Specifications State
  const [specCategories, setSpecCategories] = useState<SpecificationCategory[]>([]);

  // Product Images State
  const [relatedImages, setRelatedImages] = useState<string[]>([]);

  useEffect(() => {
    setSpecCategories(getInitialSpecs(selectedCategory, selectedType));
  }, [selectedCategory, selectedType]);

  // --- Specifications Handlers ---
  const handleAddSpecCategory = () => {
    setSpecCategories([
      ...specCategories,
      { id: `cat-new-${Date.now()}`, name: 'New Category', items: [{ id: `item-${Date.now()}`, type: 'text', key: '', value: '' }] }
    ]);
  };

  const handleUpdateSpecCategory = (id: string, name: string) => {
    setSpecCategories(specCategories.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleRemoveSpecCategory = (id: string) => {
    setSpecCategories(specCategories.filter(c => c.id !== id));
  };

  const handleAddSpecItem = (catId: string) => {
    setSpecCategories(specCategories.map(c => {
      if (c.id === catId) {
        return { ...c, items: [...c.items, { id: `item-${Date.now()}`, type: 'text', key: '', value: '' }] };
      }
      return c;
    }));
  };

  const handleUpdateSpecItem = (catId: string, itemId: string, field: string, val: any) => {
    setSpecCategories(specCategories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, [field]: val } : i)
        };
      }
      return c;
    }));
  };

  const handleRemoveSpecItem = (catId: string, itemId: string) => {
    setSpecCategories(specCategories.map(c => {
      if (c.id === catId) {
        return { ...c, items: c.items.filter(i => i.id !== itemId) };
      }
      return c;
    }));
  };

  // --- Product Images Handlers ---
  const handleRelatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setRelatedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveRelatedImage = (index: number) => {
    setRelatedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Note: List Handlers & Image Upload handlers removed

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      { id: Date.now(), color: '', ram: '', rom: '', badge: '', images: [] }
    ]);
  };

  const handleRemoveVariation = (id: number) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const updateVariation = (id: number, field: string, value: string) => {
    setVariations(variations.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const imageUrls = filesArray.map(file => URL.createObjectURL(file));
      setVariations(variations.map(v => v.id === id ? { ...v, images: [...v.images, ...imageUrls] } : v));
    }
  };

  const handleRemoveImage = (id: number, imageIndex: number) => {
    setVariations(variations.map(v => v.id === id ? { ...v, images: v.images.filter((_, i) => i !== imageIndex) } : v));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Product saved successfully!');
      router.push('/products');
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 w-full mx-auto text-gray-900 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="font-medium text-brand-500 text-theme-lg dark:text-white/90 sm:text-2xl">Add New Product</h1>
            <p className="text-sm text-gray-500 mt-1">Create a new product in the catalog.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-brand-500 text-white px-5 py-2.5 w-full sm:w-auto rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {currentStep === 1 && (
          <>
            {/* Top Level Configuration */}
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Initial Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                  <div>
                    <label className="font-medium text-gray-900 dark:text-white block mb-1">Enable Product</label>
                    <span className="text-xs text-gray-500">Make this product visible in store</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={enableProduct} onChange={(e) => setEnableProduct(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                  <div>
                    <label className="font-medium text-gray-900 dark:text-white block mb-1">Express Delivery</label>
                    <span className="text-xs text-gray-500">Available for fast shipping</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={expressDelivery} onChange={(e) => setExpressDelivery(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/20 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                  </label>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedType('');
                        setSelectedBrand('');
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Default">Default</option>
                      {navData.map(cat => (
                        <option key={cat.id} value={cat.title}>{cat.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedCategory && selectedCategory !== 'Default' && (
                    <>
                      {(() => {
                        const selectedCategoryObj = navData.find(c => c.title === selectedCategory);
                        const subCategories = selectedCategoryObj?.columns?.flatMap((col: any) => col.sections) || [];

                        if (subCategories.length === 0) return null;

                        return (
                          <div className="animate-in fade-in zoom-in duration-300">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sub Category / Type <span className="text-red-500">*</span></label>
                            <select
                              value={selectedType}
                              onChange={(e) => {
                                setSelectedType(e.target.value);
                                setSelectedBrand('');
                              }}
                              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                              required
                            >
                              <option value="" disabled>Select Type</option>
                              {subCategories.map((sub: any, idx: number) => (
                                <option key={idx} value={sub.title}>{sub.title}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {selectedType && (
                    <>
                      {(() => {
                        const selectedCategoryObj = navData.find(c => c.title === selectedCategory);
                        const subCategories = selectedCategoryObj?.columns?.flatMap((col: any) => col.sections) || [];
                        const selectedTypeObj = subCategories.find((s: any) => s.title === selectedType);
                        const brands = selectedTypeObj?.items || [];

                        if (brands.length === 0) return null;

                        return (
                          <div className="animate-in fade-in zoom-in duration-300">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand <span className="text-red-500">*</span></label>
                            <select
                              value={selectedBrand}
                              onChange={(e) => setSelectedBrand(e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                              required
                            >
                              <option value="" disabled>Select Brand</option>
                              {brands.map((brand: any, idx: number) => (
                                <option key={idx} value={brand.label}>{brand.label}</option>
                              ))}
                            </select>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Fields based on Category Selection */}
            {(selectedCategory === 'Default' || selectedBrand !== '') && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Basic Information */}
                <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" required placeholder="e.g. iPhone 15 Pro" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SKU <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" required placeholder="e.g. IPH-15-PRO-256" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" step="0.01" className="w-full pl-8 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" required placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                      <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manufacturer</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="e.g. Apple Inc." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country of Manufacture</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="e.g. India, China" />
                    </div>
                  </div>
                </div>

                {/* Variations Builder */}
                <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <h2 className="text-lg font-semibold">Variations (Color, RAM, ROM, Images)</h2>
                      <p className="text-sm text-gray-500">Configure different specifications for this product.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVariation}
                      className="flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={16} /> Add Variation
                    </button>
                  </div>

                  <div className="space-y-6">
                    {variations.map((variation, index) => (
                      <div key={variation.id} className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 relative group">
                        {variations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariation(variation.id)}
                            className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Variation #{index + 1}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Feature Badge</label>
                            <select
                              value={variation.badge || ''}
                              onChange={(e) => updateVariation(variation.id, 'badge', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                            >
                              <option value="">None</option>
                              <option value="Sold Out">Sold Out</option>
                              <option value="New In">New In</option>
                              <option value="Top Deal">Top Deal</option>
                              <option value="50% Discount">50% Discount</option>
                              <option value="Limited Edition">Limited Edition</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Color</label>
                            <select
                              value={variation.color}
                              onChange={(e) => updateVariation(variation.id, 'color', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                            >
                              <option value="">Select Color</option>
                              {PHONE_COLORS.map(color => (
                                <option key={color} value={color}>{color}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">RAM</label>
                            <select
                              value={variation.ram}
                              onChange={(e) => updateVariation(variation.id, 'ram', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                            >
                              <option value="">Select RAM</option>
                              {RAM_OPTIONS.map(ram => (
                                <option key={ram} value={ram}>{ram}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">ROM</label>
                            <select
                              value={variation.rom}
                              onChange={(e) => updateVariation(variation.id, 'rom', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                            >
                              <option value="">Select ROM</option>
                              {ROM_OPTIONS.map(rom => (
                                <option key={rom} value={rom}>{rom}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">Images</label>
                          <label className="w-full flex items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:border-brand-500 dark:hover:border-brand-400 transition-colors cursor-pointer group/upload">
                            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(variation.id, e)} />
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover/upload:text-brand-500 mb-2 transition-colors" />
                              <span className="text-sm text-gray-500 font-medium">Click to upload or drag & drop</span>
                            </div>
                          </label>

                          {variation.images.length > 0 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                              {variation.images.map((img, imgIndex) => (
                                <div key={imgIndex} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group/img">
                                  <img src={img} alt={`Preview ${imgIndex}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(variation.id, imgIndex)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payments & Tax */}
                <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">Payments & Tax</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Restrict Follow Payments for this Product</label>
                      <div className="space-y-3 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                        {['All Payments are available', 'Cash On Delivery', 'Pinelabs', 'Razorpay'].map((payment, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                              <input type="checkbox" className="peer w-5 h-5 opacity-0 absolute" defaultChecked={idx === 0} />
                              <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-colors flex items-center justify-center">
                                <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{payment}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Class</label>
                      <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all">
                        <option value="None">None</option>
                        <option value="Taxable Goods">Taxable Goods</option>
                        <option value="Refund Adjustments">Refund Adjustments</option>
                        <option value="Gift Options">Gift Options</option>
                        <option value="Order Gift Wrapping">Order Gift Wrapping</option>
                        <option value="Item Gift Wrapping">Item Gift Wrapping</option>
                        <option value="Printed Gift Card">Printed Gift Card</option>
                        <option value="Reward Points">Reward Points</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Shipping & Weight */}
                <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">Shipping & Weight</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight Requirement</label>
                      <select
                        value={hasWeight}
                        onChange={(e) => setHasWeight(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      >
                        <option value="This item has weight">This item has weight</option>
                        <option value="This item has no weight">This item has no weight</option>
                      </select>
                    </div>

                    {hasWeight === 'This item has weight' && (
                      <div className="animate-in fade-in zoom-in duration-300">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight</label>
                        <div className="flex relative">
                          <input type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-l-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="0.00" />
                          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-200 dark:border-gray-700 rounded-r-xl text-gray-600 dark:text-gray-300 flex items-center font-medium">
                            lbs
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status, Priorities & Toggles */}
                <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">Status, Priorities & Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Switches / Toggles Group */}
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Featured</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pre Registration</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bestseller</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Pre-Order Product</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                      </div>
                    </div>

                    {/* Dropdowns Group */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Enable</label>
                        <select className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none text-sm">
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bajaj Enable</label>
                        <select className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none text-sm">
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Sync</label>
                        <select className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none text-sm">
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    {/* Priorities & Values */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Product Priority</label>
                        <input type="number" className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none text-sm" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Priority</label>
                        <input type="number" className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none text-sm" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bestseller Priority</label>
                        <input type="number" className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 outline-none text-sm" placeholder="0" />
                      </div>
                    </div>
                  </div>

                  {/* Extended Configurations */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Set Product as New From</label>
                      <input type="date" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Insurance Brands</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="Enter brands" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popularity</label>
                      <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pre-Order Product Availability</label>
                      <input type="date" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pre-Order Quantity</label>
                      <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preorder Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input type="number" step="0.01" className="w-full pl-8 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loyalty Points</label>
                      <input type="number" className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all" placeholder="0" />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Step Navigation */}
            <div className="flex justify-end pt-4">
              {selectedCategory && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center justify-center gap-2 bg-brand-500 text-white w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm animate-in fade-in zoom-in duration-300"
                >
                  Next: Product Specifications <ChevronRight size={18} />
                </button>
              )}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Step 2: Specifications Builder */}
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Specifications</h2>
                  <p className="text-sm text-gray-500 mt-1">Define technical specs and details across categories.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpecCategory}
                  className="flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Add Category
                </button>
              </div>

              <div className="p-6 space-y-6">
                {specCategories.map((cat, idx) => (
                  <div key={cat.id} className="border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/30 dark:bg-gray-800/20 overflow-hidden relative group/cat">
                    <div className="bg-[#f3e5f5] dark:bg-brand-900/20 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 max-w-sm">
                        <GripVertical size={18} className="text-gray-400 cursor-grab" />
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => handleUpdateSpecCategory(cat.id, e.target.value)}
                          className="bg-transparent font-medium text-gray-800 dark:text-brand-200 text-[15px] outline-none border-b border-transparent focus:border-brand-500/50 w-full transition-colors"
                          placeholder="Category Name"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecCategory(cat.id)}
                        className="text-red-500 hover:text-red-600 p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover/cat:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="p-4">

                      {/* Key-Value Items */}
                      <div className="space-y-3">
                        {cat.items.map((item, itemIdx) => (
                          <div key={item.id} className="flex items-start gap-3 group/item">
                            <div className="flex-1 flex flex-col gap-3">
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <select
                                  value={item.type}
                                  onChange={(e) => handleUpdateSpecItem(cat.id, item.id, 'type', e.target.value)}
                                  className="md:col-span-3 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                                >
                                  <option value="text">Text (Key-Value)</option>
                                  {cat.name === 'General' && <option value="color">Colors</option>}
                                  <option value="title">Section Title</option>
                                </select>

                                {item.type === 'title' ? (
                                  <input
                                    type="text"
                                    value={item.key}
                                    onChange={(e) => handleUpdateSpecItem(cat.id, item.id, 'key', e.target.value)}
                                    placeholder="Section Title (e.g. Display Features)"
                                    className="md:col-span-9 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-brand-50/50 dark:bg-brand-900/10 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold text-brand-600 dark:text-brand-400"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={item.key}
                                    onChange={(e) => handleUpdateSpecItem(cat.id, item.id, 'key', e.target.value)}
                                    placeholder={item.type === 'color' ? "Color Key (e.g. Available Colors)" : "Specification Key"}
                                    className={`w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-[#7a9e9f] font-medium ${item.type === 'text' ? 'md:col-span-4' : 'md:col-span-9'}`}
                                  />
                                )}

                                {item.type === 'text' && (
                                  <input
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => handleUpdateSpecItem(cat.id, item.id, 'value', e.target.value)}
                                    placeholder="Value (e.g. 120Hz)"
                                    className="md:col-span-5 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                                  />
                                )}
                              </div>

                              {/* Dynamic Second Row for Colors / List */}
                              {item.type === 'color' && (
                                <div className="pl-[25%] flex flex-wrap items-center gap-3">
                                  {(item.value ? item.value.split(',').filter(v => v.includes('#')) : []).map((color, idx) => (
                                    <div key={idx} className="relative group/col">
                                      <div className="w-8 h-8 rounded-full shadow-sm border border-gray-200" style={{ backgroundColor: color }}></div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const arr = item.value.split(',').filter(v => v.includes('#'));
                                          arr.splice(idx, 1);
                                          handleUpdateSpecItem(cat.id, item.id, 'value', arr.join(','));
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover/col:opacity-100 transition-opacity z-10"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}

                                  <label className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-brand-500 transition-colors">
                                    <Plus size={16} className="text-gray-400" />
                                    <input
                                      type="color"
                                      className="hidden"
                                      onChange={(e) => {
                                        const curr = item.value ? item.value.split(',').filter(v => v.includes('#')) : [];
                                        if (!curr.includes(e.target.value)) {
                                          handleUpdateSpecItem(cat.id, item.id, 'value', [...curr, e.target.value].join(','));
                                        }
                                      }}
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSpecItem(cat.id, item.id, 'value', 'SWATCHES')}
                                    className="text-xs text-gray-500 underline ml-2 hover:text-brand-500"
                                  >
                                    Or use Auto-Swatches
                                  </button>
                                </div>
                              )}

                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecItem(cat.id, item.id)}
                              className="mt-2 text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleAddSpecItem(cat.id)}
                          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-500 transition-colors"
                        >
                          <Plus size={14} /> Add Specification Row
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} /> Back to Basic Info
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center justify-center gap-2 bg-brand-500 text-white w-full sm:w-auto px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm"
              >
                Next: Product Images <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            {/* Step 3: Product Related Images */}
            <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 p-6">
              <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product Images</h2>
                <p className="text-sm text-gray-500 mt-1">Upload high resolution feature images for the product detail page.</p>
              </div>

              <div className="space-y-6">
                <label className="w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-800/30 hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-500/10 transition-colors cursor-pointer group/upload">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleRelatedImageUpload} />
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-sm mb-4 group-hover/upload:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-brand-500" />
                  </div>
                  <span className="text-base text-gray-700 dark:text-gray-300 font-medium mb-1">Click to upload or drag and drop</span>
                  <span className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 800x800px)</span>
                </label>

                {relatedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    {relatedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group/img shadow-sm">
                        <img src={img} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveRelatedImage(idx)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} /> Back to Specifications
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-brand-500 text-white w-full sm:w-auto px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={18} /> {saving ? 'Saving Product...' : 'Save Complete Product'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
