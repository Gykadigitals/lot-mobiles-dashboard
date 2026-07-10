import { Product, ProductType } from '../types/product';

const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  const brands = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Sony'];
  const categoriesList = [
    ['Mobiles', 'Android Phones'],
    ['Mobiles', 'iPhones'],
    ['Laptops'],
    ['Tablet'],
    ['Smart Watch'],
    ['Accessories']
  ];
  const types: ProductType[] = ['Simple Product', 'Configurable Product'];
  
  for (let i = 1; i <= 35; i++) {
    const isIphone = i % 5 === 0;
    const category = isIphone ? ['Mobiles', 'iPhones'] : categoriesList[i % categoriesList.length];
    const brand = isIphone ? 'Apple' : brands[i % brands.length];
    
    products.push({
      id: `PRD-${1000 + i}`,
      thumbnail: 'https://via.placeholder.com/50',
      name: `${brand} Awesome Device ${i}`,
      productType: types[i % 2],
      attributeSet: 'Default',
      sku: `SKU-${brand.toUpperCase()}-${1000 + i}`,
      price: 199.99 * (i % 5 + 1),
      categories: category,
      quantity: 100 + i,
      salableQuantity: 90 + i,
      visibility: 'Catalog, Search',
      status: i % 10 === 0 ? 'Inactive' : 'Active',
      preOrderProduct: i % 7 === 0,
      
      // Some random fields
      brand: brand,
      ram: i % 2 === 0 ? '8GB' : '16GB',
      internalStorage: '256GB',
      operatingSystem: isIphone ? 'iOS' : 'Android',
      processor: 'Octa-core 3.0 GHz',
      displaySize: '6.5 inches',
      primaryCamera: '64MP',
      dimensions: '160 x 75 x 8 mm',
      itemWeight: '180g',
      warrantySummary: '1 Year Manufacturer Warranty',
      lastUpdatedAt: new Date(Date.now() - i * 10000000).toISOString(),
    });
  }
  return products;
};

export const mockProducts = generateMockProducts();
