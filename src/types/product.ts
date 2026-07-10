export type ProductType = 
  | 'Simple Product' 
  | 'Configurable Product' 
  | 'Grouped Product' 
  | 'Virtual Product' 
  | 'Bundle Product' 
  | 'Downloadable Product';

export interface Product {
  id: string; // Product ID
  thumbnail: string;
  name: string;
  productType: ProductType;
  attributeSet: string;
  sku: string;
  price: number;
  categories: string[];
  quantity: number;
  salableQuantity: number;
  visibility: string; // e.g. 'Catalog, Search'
  status: 'Active' | 'Inactive';
  preOrderProduct: boolean;
  
  // Specific attributes 
  productTypes?: string; // from user prompt
  ram?: string;
  internalStorage?: string;
  bluetooth?: string;
  displayResolution?: string;
  displaySize?: string;
  displayType?: string;
  expandableStorage?: string;
  networkType?: string;
  operatingSystem?: string;
  primaryCamera?: string;
  processor?: string;
  sensors?: string;
  expressDelivery?: boolean;
  technology?: string;
  dimensions?: string;
  itemWeight?: string;
  sim?: string;
  modelName?: string;
  manufacturersDetails?: string;
  packersDetails?: string;
  emailUs?: string;
  contactUs?: string;
  importersDetails?: string;
  processorFamily?: string;
  mobileSecurity?: string;
  bodyGuardProfessional?: boolean;
  bodyGuardType?: string;
  dateFirstAvailable?: string;
  screenResolution?: string;
  refreshRate?: string;
  whd?: string;
  chargingType?: string;
  primaryCameraFeatures?: string;
  secondaryCameraFeatures?: string;
  connectivity?: string;
  audioFormats?: string;
  videoFormats?: string;
  specialFeatures?: string;
  audioJack?: string;
  inTheBox?: string;
  warrantySummary?: string;
  genericName?: string;
  notCoveredInWarranty?: string;
  gift?: string;
  brand?: string;
  websites?: string;
  lastUpdatedAt: string; // Will be used for LIFO sorting if needed, or we just rely on array order
}
