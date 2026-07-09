// High-fidelity customer shopping datasets for our Customer Trends Data Analysis Studio

export interface DatasetColumn {
  name: string;
  type: 'string' | 'number' | 'date';
  description: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  columns: DatasetColumn[];
  data: Array<Record<string, any>>;
}

// Vocabulary arrays representing actual categorical distribution in user's CSV
export const CATEGORIES = ['Clothing', 'Footwear', 'Outerwear', 'Accessories'];
export const GENDERS = ['Male', 'Female'];
export const ITEMS_BY_CATEGORY: Record<string, string[]> = {
  Clothing: ['Blouse', 'Sweater', 'Jeans', 'Shirt', 'Shorts', 'Skirt', 'Pants', 'Hoodie', 'Socks', 'T-shirt'],
  Footwear: ['Sandals', 'Sneakers', 'Shoes', 'Boots'],
  Outerwear: ['Coat', 'Jacket'],
  Accessories: ['Handbag', 'Sunglasses', 'Jewelry', 'Scarf', 'Hat', 'Gloves', 'Belt', 'Backpack']
};

export const LOCATIONS = [
  'Kentucky', 'Maine', 'Massachusetts', 'Rhode Island', 'Oregon', 'Wyoming', 'Montana', 
  'Louisiana', 'West Virginia', 'Missouri', 'Arkansas', 'Hawaii', 'Delaware', 'New Hampshire', 
  'New York', 'Alabama', 'Mississippi', 'North Carolina', 'Oklahoma', 'Florida', 'Texas', 
  'Nevada', 'Kansas', 'Colorado', 'North Dakota', 'Illinois', 'Indiana', 'Arizona', 'Alaska', 
  'Tennessee', 'Ohio', 'New Jersey', 'Vermont', 'South Carolina', 'South Dakota', 'Minnesota', 
  'Utah', 'Iowa', 'Connecticut', 'Georgia', 'Nebraska', 'Washington', 'Wisconsin', 'Michigan', 
  'Maryland', 'Pennsylvania', 'Idaho'
];

export const COLORS = [
  'Gray', 'Maroon', 'Turquoise', 'White', 'Charcoal', 'Silver', 'Pink', 'Purple', 'Olive', 
  'Gold', 'Violet', 'Teal', 'Lavender', 'Black', 'Green', 'Peach', 'Red', 'Cyan', 'Brown', 
  'Orange', 'Indigo', 'Yellow', 'Magenta', 'Blue', 'Beige'
];

export const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'];
export const SIZES = ['S', 'M', 'L', 'XL'];
export const SHIPPING_TYPES = ['Express', 'Free Shipping', 'Next Day Air', 'Standard', '2-Day Shipping', 'Store Pickup'];
export const PAYMENT_METHODS = ['Venmo', 'Cash', 'Credit Card', 'PayPal', 'Debit Card', 'Bank Transfer'];
export const FREQUENCIES = ['Fortnightly', 'Weekly', 'Annually', 'Quarterly', 'Bi-Weekly', 'Monthly', 'Every 3 Months'];

// Seed static records exactly from user's CSV
const baseSampleCSV = [
  { id: 1, age: 55, gender: 'Male', item: 'Blouse', cat: 'Clothing', amount: 53, loc: 'Kentucky', size: 'L', col: 'Gray', season: 'Winter', rating: 3.1, sub: 'Yes', ship: 'Express', disc: 'Yes', promo: 'Yes', prev: 14, pay: 'Venmo', freq: 'Fortnightly' },
  { id: 2, age: 19, gender: 'Male', item: 'Sweater', cat: 'Clothing', amount: 64, loc: 'Maine', size: 'L', col: 'Maroon', season: 'Winter', rating: 3.1, sub: 'Yes', ship: 'Express', disc: 'Yes', promo: 'Yes', prev: 2, pay: 'Cash', freq: 'Fortnightly' },
  { id: 3, age: 50, gender: 'Male', item: 'Jeans', cat: 'Clothing', amount: 73, loc: 'Massachusetts', size: 'S', col: 'Maroon', season: 'Spring', rating: 3.1, sub: 'Yes', ship: 'Free Shipping', disc: 'Yes', promo: 'Yes', prev: 23, pay: 'Credit Card', freq: 'Weekly' },
  { id: 4, age: 21, gender: 'Male', item: 'Sandals', cat: 'Footwear', amount: 90, loc: 'Rhode Island', size: 'M', col: 'Maroon', season: 'Spring', rating: 3.5, sub: 'Yes', ship: 'Next Day Air', disc: 'Yes', promo: 'Yes', prev: 49, pay: 'PayPal', freq: 'Weekly' },
  { id: 5, age: 45, gender: 'Male', item: 'Blouse', cat: 'Clothing', amount: 49, loc: 'Oregon', size: 'M', col: 'Turquoise', season: 'Spring', rating: 2.7, sub: 'Yes', ship: 'Free Shipping', disc: 'Yes', promo: 'Yes', prev: 31, pay: 'PayPal', freq: 'Annually' },
  { id: 6, age: 46, gender: 'Male', item: 'Sneakers', cat: 'Footwear', amount: 20, loc: 'Wyoming', size: 'M', col: 'White', season: 'Summer', rating: 2.9, sub: 'Yes', ship: 'Standard', disc: 'Yes', promo: 'Yes', prev: 14, pay: 'Venmo', freq: 'Weekly' },
  { id: 7, age: 63, gender: 'Male', item: 'Shirt', cat: 'Clothing', amount: 85, loc: 'Montana', size: 'M', col: 'Gray', season: 'Fall', rating: 3.2, sub: 'Yes', ship: 'Free Shipping', disc: 'Yes', promo: 'Yes', prev: 49, pay: 'Cash', freq: 'Quarterly' },
  { id: 8, age: 27, gender: 'Male', item: 'Shorts', cat: 'Clothing', amount: 34, loc: 'Louisiana', size: 'L', col: 'Charcoal', season: 'Winter', rating: 3.2, sub: 'Yes', ship: 'Free Shipping', disc: 'Yes', promo: 'Yes', prev: 19, pay: 'Credit Card', freq: 'Weekly' },
  { id: 9, age: 26, gender: 'Male', item: 'Coat', cat: 'Outerwear', amount: 97, loc: 'West Virginia', size: 'L', col: 'Silver', season: 'Summer', rating: 2.6, sub: 'Yes', ship: 'Express', disc: 'Yes', promo: 'Yes', prev: 8, pay: 'Venmo', freq: 'Annually' },
  { id: 10, age: 57, gender: 'Male', item: 'Handbag', cat: 'Accessories', amount: 31, loc: 'Missouri', size: 'M', col: 'Pink', season: 'Spring', rating: 4.8, sub: 'Yes', ship: '2-Day Shipping', disc: 'Yes', promo: 'Yes', prev: 4, pay: 'Cash', freq: 'Quarterly' },
  { id: 11, age: 53, gender: 'Male', item: 'Shoes', cat: 'Footwear', amount: 34, loc: 'Arkansas', size: 'L', col: 'Purple', season: 'Fall', rating: 4.1, sub: 'Yes', ship: 'Store Pickup', disc: 'Yes', promo: 'Yes', prev: 26, pay: 'Bank Transfer', freq: 'Bi-Weekly' },
  { id: 12, age: 30, gender: 'Male', item: 'Shorts', cat: 'Clothing', amount: 68, loc: 'Hawaii', size: 'S', col: 'Olive', season: 'Winter', rating: 4.9, sub: 'Yes', ship: 'Store Pickup', disc: 'Yes', promo: 'Yes', prev: 10, pay: 'Bank Transfer', freq: 'Fortnightly' },
  { id: 13, age: 61, gender: 'Male', item: 'Coat', cat: 'Outerwear', amount: 72, loc: 'Delaware', size: 'M', col: 'Gold', season: 'Winter', rating: 4.5, sub: 'Yes', ship: 'Express', disc: 'Yes', promo: 'Yes', prev: 37, pay: 'Venmo', freq: 'Fortnightly' },
  { id: 14, age: 65, gender: 'Male', item: 'Dress', cat: 'Clothing', amount: 51, loc: 'New Hampshire', size: 'M', col: 'Violet', season: 'Spring', rating: 4.7, sub: 'Yes', ship: 'Express', disc: 'Yes', promo: 'Yes', prev: 31, pay: 'PayPal', freq: 'Weekly' },
  { id: 15, age: 64, gender: 'Male', item: 'Coat', cat: 'Outerwear', amount: 53, loc: 'New York', size: 'L', col: 'Teal', season: 'Winter', rating: 4.7, sub: 'Yes', ship: 'Free Shipping', disc: 'Yes', promo: 'Yes', prev: 34, pay: 'Debit Card', freq: 'Weekly' },
  { id: 16, age: 64, gender: 'Male', item: 'Skirt', cat: 'Clothing', amount: 81, loc: 'Rhode Island', size: 'M', col: 'Teal', season: 'Winter', rating: 2.8, sub: 'Yes', ship: 'Store Pickup', disc: 'Yes', promo: 'Yes', prev: 8, pay: 'PayPal', freq: 'Monthly' },
  { id: 17, age: 25, gender: 'Male', item: 'Sunglasses', cat: 'Accessories', amount: 36, loc: 'Alabama', size: 'S', col: 'Gray', season: 'Spring', rating: 4.1, sub: 'Yes', ship: 'Next Day Air', disc: 'Yes', promo: 'Yes', prev: 44, pay: 'Debit Card', freq: 'Bi-Weekly' },
  { id: 18, age: 53, gender: 'Male', item: 'Dress', cat: 'Clothing', amount: 38, loc: 'Mississippi', size: 'XL', col: 'Lavender', season: 'Winter', rating: 4.7, sub: 'Yes', ship: '2-Day Shipping', disc: 'Yes', promo: 'Yes', prev: 36, pay: 'Venmo', freq: 'Quarterly' },
  { id: 19, age: 52, gender: 'Male', item: 'Sweater', cat: 'Clothing', amount: 48, loc: 'Montana', size: 'S', col: 'Black', season: 'Summer', rating: 4.6, sub: 'Yes', ship: 'Free Shipping', disc: 'Yes', promo: 'Yes', prev: 17, pay: 'Cash', freq: 'Weekly' },
  { id: 20, age: 66, gender: 'Male', item: 'Pants', cat: 'Clothing', amount: 90, loc: 'Rhode Island', size: 'M', col: 'Green', season: 'Summer', rating: 3.3, sub: 'Yes', ship: 'Standard', disc: 'Yes', promo: 'Yes', prev: 46, pay: 'Debit Card', freq: 'Bi-Weekly' },
  { id: 1054, age: 59, gender: 'Male', item: 'Blouse', cat: 'Clothing', amount: 70, loc: 'Kansas', size: 'M', col: 'Blue', season: 'Spring', rating: 3.3, sub: 'No', ship: '2-Day Shipping', disc: 'Yes', promo: 'Yes', prev: 10, pay: 'Debit Card', freq: 'Bi-Weekly' },
  { id: 1055, age: 18, gender: 'Male', item: 'Shorts', cat: 'Clothing', amount: 96, loc: 'Arkansas', size: 'L', col: 'Cyan', season: 'Winter', rating: 4.9, sub: 'No', ship: 'Express', disc: 'Yes', promo: 'Yes', prev: 48, pay: 'PayPal', freq: 'Quarterly' },
  { id: 1056, age: 70, gender: 'Male', item: 'Jacket', cat: 'Outerwear', amount: 27, loc: 'Massachusetts', size: 'M', col: 'Orange', season: 'Spring', rating: 3.3, sub: 'No', ship: 'Next Day Air', disc: 'Yes', promo: 'Yes', prev: 24, pay: 'Debit Card', freq: 'Annually' },
  { id: 2653, age: 23, gender: 'Female', item: 'Shorts', cat: 'Clothing', amount: 20, loc: 'Maryland', size: 'L', col: 'Cyan', season: 'Summer', rating: 3.3, sub: 'No', ship: '2-Day Shipping', disc: 'No', promo: 'No', prev: 46, pay: 'Credit Card', freq: 'Monthly' },
  { id: 2654, age: 67, gender: 'Female', item: 'Blouse', cat: 'Clothing', amount: 36, loc: 'Wisconsin', size: 'L', col: 'Lavender', season: 'Fall', rating: 4.8, sub: 'No', ship: 'Express', disc: 'No', promo: 'No', prev: 24, pay: 'Venmo', freq: 'Every 3 Months' },
  { id: 2655, age: 23, gender: 'Female', item: 'Coat', cat: 'Outerwear', amount: 70, loc: 'Idaho', size: 'S', col: 'Pink', season: 'Fall', rating: 4.1, sub: 'No', ship: 'Next Day Air', disc: 'No', promo: 'No', prev: 4, pay: 'PayPal', freq: 'Annually' }
];

// Mappings for high-fidelity record synthesis
export function generateRow(index: number, forceCategory?: string): Record<string, any> {
  const seed = index + 1024;
  const gender = GENDERS[seed % GENDERS.length];
  const cat = forceCategory || CATEGORIES[seed % CATEGORIES.length];
  const items = ITEMS_BY_CATEGORY[cat];
  const item = items[seed % items.length];
  
  const location = LOCATIONS[(seed * 3) % LOCATIONS.length];
  const size = SIZES[seed % SIZES.length];
  const color = COLORS[(seed * 2) % COLORS.length];
  const season = SEASONS[(seed * 4) % SEASONS.length];
  
  // Generate realistic review ratings aligned with actual dataset (2.5 to 5.0)
  const rating = parseFloat((2.5 + ((seed % 26) / 25) * 2.5).toFixed(1));
  const subStatus = seed % 3 === 0 ? 'Yes' : 'No';
  const shipping = SHIPPING_TYPES[(seed * 5) % SHIPPING_TYPES.length];
  const discount = seed % 4 === 0 ? 'Yes' : 'No';
  const promo = discount;
  
  const prevPurchases = (seed % 49) + 1;
  const payMethod = PAYMENT_METHODS[seed % PAYMENT_METHODS.length];
  const freq = FREQUENCIES[seed % FREQUENCIES.length];
  
  // Purchase amount usually ranges from $20 to $100
  const amount = 20 + (seed % 81);
  
  // Create virtual dynamic timestamp (simulates purchase occurrence)
  const timestamp = new Date(Date.now() - (1000 - index) * 3600 * 1000).toISOString();

  return {
    'Timestamp': timestamp,
    'Customer ID': seed,
    'Age': 18 + (seed % 53), // 18 to 70
    'Gender': gender,
    'Item Purchased': item,
    'Category': cat,
    'Purchase Amount (USD)': amount,
    'Location': location,
    'Size': size,
    'Color': color,
    'Season': season,
    'Review Rating': rating,
    'Subscription Status': subStatus,
    'Shipping Type': shipping,
    'Discount Applied': discount,
    'Promo Code Used': promo,
    'Previous Purchases': prevPurchases,
    'Payment Method': payMethod,
    'Frequency of Purchases': freq
  };
}

// Map the small CSV exact samples first
const preloadedDemographics: Array<Record<string, any>> = [];
baseSampleCSV.forEach((row, idx) => {
  const timestamp = new Date(Date.now() - (200 - idx) * 3600 * 1000).toISOString();
  preloadedDemographics.push({
    'Timestamp': timestamp,
    'Customer ID': row.id,
    'Age': row.age,
    'Gender': row.gender,
    'Item Purchased': row.item,
    'Category': row.cat,
    'Purchase Amount (USD)': row.amount,
    'Location': row.loc,
    'Size': row.size,
    'Color': row.col,
    'Season': row.season,
    'Review Rating': row.rating,
    'Subscription Status': row.sub,
    'Shipping Type': row.ship,
    'Discount Applied': row.disc,
    'Promo Code Used': row.promo,
    'Previous Purchases': row.prev,
    'Payment Method': row.pay,
    'Frequency of Purchases': row.freq
  });
});

// Pad with rich synthesized records to make high quality default dashboards
for (let i = 0; i < 90; i++) {
  preloadedDemographics.push(generateRow(i));
}

// Setup dedicated high-value subscription cohort
const preloadedSubscribers: Array<Record<string, any>> = [];
for (let i = 0; i < 110; i++) {
  const row = generateRow(i + 150);
  row['Subscription Status'] = 'Yes'; // Guarantee all Yes
  row['Purchase Amount (USD)'] = Math.floor(row['Purchase Amount (USD)'] * 1.25); // high spenders
  row['Previous Purchases'] = Math.floor(row['Previous Purchases'] * 1.5) + 5; // highly loyal
  preloadedSubscribers.push(row);
}

// Setup dedicated product/seasonal trends subset
const preloadedSeasonal: Array<Record<string, any>> = [];
for (let i = 0; i < 120; i++) {
  const row = generateRow(i + 300);
  // Align items perfectly with typical seasonal attributes for aesthetic correlation
  if (row['Season'] === 'Winter') {
    row['Item Purchased'] = i % 2 === 0 ? 'Sweater' : 'Coat';
    row['Category'] = i % 2 === 0 ? 'Clothing' : 'Outerwear';
  } else if (row['Season'] === 'Summer') {
    row['Item Purchased'] = i % 2 === 0 ? 'Sandals' : 'Shorts';
    row['Category'] = i % 2 === 0 ? 'Footwear' : 'Clothing';
  } else if (row['Season'] === 'Spring') {
    row['Item Purchased'] = 'Blouse';
    row['Category'] = 'Clothing';
  } else {
    row['Item Purchased'] = 'Jacket';
    row['Category'] = 'Outerwear';
  }
  preloadedSeasonal.push(row);
}

export const datasets: Dataset[] = [
  {
    id: 'customer_demographics',
    name: 'Customer Demographics & Spend',
    description: 'Comprehensive demographic mapping tracking buyer ages, geographical locations, spending power, and gender distributions.',
    category: 'Demographics',
    columns: [
      { name: 'Timestamp', type: 'date', description: 'Simulated Purchase Date' },
      { name: 'Customer ID', type: 'number', description: 'Unique customer sequence identifier' },
      { name: 'Age', type: 'number', description: 'Customer age in years (18-70)' },
      { name: 'Gender', type: 'string', description: 'Customer biological gender (Male, Female)' },
      { name: 'Item Purchased', type: 'string', description: 'Name of retail item purchased' },
      { name: 'Category', type: 'string', description: 'Broad classification (Clothing, Accessories, etc.)' },
      { name: 'Purchase Amount (USD)', type: 'number', description: 'Gross transaction amount in USD' },
      { name: 'Location', type: 'string', description: 'US State where the transaction took place' },
      { name: 'Size', type: 'string', description: 'Product sizing (S, M, L, XL)' },
      { name: 'Color', type: 'string', description: 'Aesthetic product color choice' },
      { name: 'Season', type: 'string', description: 'Active seasonal buying season (Winter, Spring, Summer, Fall)' },
      { name: 'Review Rating', type: 'number', description: 'Product feedback rating out of 5 stars' },
      { name: 'Subscription Status', type: 'string', description: 'Loyalty member active subscription status (Yes, No)' },
      { name: 'Shipping Type', type: 'string', description: 'Carrier speed preference (Express, Free, Standard)' },
      { name: 'Discount Applied', type: 'string', description: 'Promotional discount flag (Yes, No)' },
      { name: 'Promo Code Used', type: 'string', description: 'Promotional coupon active code code (Yes, No)' },
      { name: 'Previous Purchases', type: 'number', description: 'Historical order count of this account' },
      { name: 'Payment Method', type: 'string', description: 'Transactional gateway choice' },
      { name: 'Frequency of Purchases', type: 'string', description: 'Self-reported buying cycle rate' }
    ],
    data: preloadedDemographics
  },
  {
    id: 'subscription_analysis',
    name: 'Subscriber Loyalty & Behavior',
    description: 'Special cohort indexing subscribed loyalty members, comparing promotional interactions, prior store usage, and payment gateways.',
    category: 'Subscribers',
    columns: [
      { name: 'Timestamp', type: 'date', description: 'Simulated Purchase Date' },
      { name: 'Customer ID', type: 'number', description: 'Unique customer sequence identifier' },
      { name: 'Age', type: 'number', description: 'Customer age in years (18-70)' },
      { name: 'Gender', type: 'string', description: 'Customer biological gender' },
      { name: 'Item Purchased', type: 'string', description: 'Name of retail item purchased' },
      { name: 'Category', type: 'string', description: 'Broad classification (Clothing, Accessories, etc.)' },
      { name: 'Purchase Amount (USD)', type: 'number', description: 'Gross transaction amount in USD' },
      { name: 'Location', type: 'string', description: 'US State where the transaction took place' },
      { name: 'Size', type: 'string', description: 'Product sizing (S, M, L, XL)' },
      { name: 'Color', type: 'string', description: 'Aesthetic product color choice' },
      { name: 'Season', type: 'string', description: 'Active seasonal buying season' },
      { name: 'Review Rating', type: 'number', description: 'Product feedback rating out of 5 stars' },
      { name: 'Subscription Status', type: 'string', description: 'Loyalty member active subscription status' },
      { name: 'Shipping Type', type: 'string', description: 'Carrier speed preference' },
      { name: 'Discount Applied', type: 'string', description: 'Promotional discount flag' },
      { name: 'Promo Code Used', type: 'string', description: 'Promotional coupon active code' },
      { name: 'Previous Purchases', type: 'number', description: 'Historical order count of this account' },
      { name: 'Payment Method', type: 'string', description: 'Transactional gateway choice' },
      { name: 'Frequency of Purchases', type: 'string', description: 'Self-reported buying cycle rate' }
    ],
    data: preloadedSubscribers
  },
  {
    id: 'seasonal_favorites',
    name: 'Seasonal Catalog Favorites',
    description: 'Targeted visual grid evaluating summer wear, winter outerwear, color preferences, and review trends by seasonal indices.',
    category: 'Product & Season',
    columns: [
      { name: 'Timestamp', type: 'date', description: 'Simulated Purchase Date' },
      { name: 'Customer ID', type: 'number', description: 'Unique customer sequence identifier' },
      { name: 'Age', type: 'number', description: 'Customer age in years (18-70)' },
      { name: 'Gender', type: 'string', description: 'Customer biological gender' },
      { name: 'Item Purchased', type: 'string', description: 'Name of retail item purchased' },
      { name: 'Category', type: 'string', description: 'Broad classification (Clothing, Accessories, etc.)' },
      { name: 'Purchase Amount (USD)', type: 'number', description: 'Gross transaction amount in USD' },
      { name: 'Location', type: 'string', description: 'US State where the transaction took place' },
      { name: 'Size', type: 'string', description: 'Product sizing (S, M, L, XL)' },
      { name: 'Color', type: 'string', description: 'Aesthetic product color choice' },
      { name: 'Season', type: 'string', description: 'Active seasonal buying season' },
      { name: 'Review Rating', type: 'number', description: 'Product feedback rating out of 5 stars' },
      { name: 'Subscription Status', type: 'string', description: 'Loyalty member active subscription status' },
      { name: 'Shipping Type', type: 'string', description: 'Carrier speed preference' },
      { name: 'Discount Applied', type: 'string', description: 'Promotional discount flag' },
      { name: 'Promo Code Used', type: 'string', description: 'Promotional coupon active code' },
      { name: 'Previous Purchases', type: 'number', description: 'Historical order count of this account' },
      { name: 'Payment Method', type: 'string', description: 'Transactional gateway choice' },
      { name: 'Frequency of Purchases', type: 'string', description: 'Self-reported buying cycle rate' }
    ],
    data: preloadedSeasonal
  }
];
