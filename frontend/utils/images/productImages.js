/**
 * Utility to map products to appropriate images based on their categories and names
 */

// Product images mapped to external URLs with optimized parameters
// Adding ?auto=format&fit=crop&w=500&h=500&q=80 for consistent, optimized images
const productImages = {
  // Clothing images
  clothing: {
    default: { uri: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&h=500&q=80' }, // generic clothing
    jacket: { uri: 'https://images.unsplash.com/photo-1520975916090-3d29c1fca4dc?auto=format&fit=crop&w=500&h=500&q=80' }, // leather jacket
    leather: { uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=500&q=80' }, // leather items
    shirt: { uri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&h=500&q=80' }, // shirt
    tshirt: { uri: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=500&h=500&q=80' }, // t-shirt
    hoodie: { uri: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&h=500&q=80' }, // hoodie
    vintage: { uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' }, // vintage clothing
    dress: { uri: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&h=500&q=80' }, // dress
    jeans: { uri: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&w=500&h=500&q=80' }, // jeans
    shoes: { uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&h=500&q=80' }, // shoes
  },

  // Electronics images
  electronics: {
    default: { uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&h=500&q=80' }, // gadgets
    iphone: { uri: 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aXBob25lJTIwMTIlMjBwcm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' }, // iPhone
    phone: { uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?auto=format&fit=crop&w=500&h=500&q=80' }, // generic phone
    laptop: { uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&h=500&q=80' }, // laptop
    computer: { uri: 'https://images.unsplash.com/photo-1603732551658-5fabbafa0a10?auto=format&fit=crop&w=500&h=500&q=80' }, // computer
    camera: { uri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&h=500&q=80' }, // camera
    polaroid: { uri: 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?auto=format&fit=crop&w=500&h=500&q=80' }, // polaroid camera
    headphones: { uri: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&h=500&q=80' }, // headphones
    tv: { uri: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=500&h=500&q=80' }, // TV
    speaker: { uri: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=500&h=500&q=80' }, // speaker
  },

  // Furniture images
  furniture: {
    default: { uri: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=500&h=500&q=80' }, // furniture
    chair: { uri: 'https://images.unsplash.com/photo-1616627988916-d9c7a6a43f38?auto=format&fit=crop&w=500&h=500&q=80' }, // chair
    table: { uri: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=500&h=500&q=80' }, // table
    desk: { uri: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?auto=format&fit=crop&w=500&h=500&q=80' }, // desk
    modern: { uri: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=500&h=500&q=80' }, // modern furniture
    century: { uri: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=500&h=500&q=80' }, // mid-century
    sofa: { uri: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&h=500&q=80' }, // sofa
    couch: { uri: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=500&h=500&q=80' }, // couch
    bed: { uri: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&h=500&q=80' }, // bed
    drawer: { uri: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=500&h=500&q=80' }, // drawer
    cabinet: { uri: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=500&h=500&q=80' }, // cabinet
  },

  // Sports images
  sports: {
    default: { uri: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=500&h=500&q=80' }, // sports gear
    bike: { uri: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=500&h=500&q=80' }, // mountain bike
    bicycle: { uri: 'https://images.unsplash.com/photo-1575585269294-7d28dd912db8?auto=format&fit=crop&w=500&h=500&q=80' }, // bicycle
    trek: { uri: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=500&h=500&q=80' }, // trek bike
    mountain: { uri: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=500&h=500&q=80' }, // mountain bike
    ball: { uri: 'https://images.unsplash.com/photo-1608571423902-fbfa0020941b?auto=format&fit=crop&w=500&h=500&q=80' }, // football
    basketball: { uri: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=500&h=500&q=80' }, // basketball
    football: { uri: 'https://images.unsplash.com/photo-1542852869-c71240d73cb2?auto=format&fit=crop&w=500&h=500&q=80' }, // american football
    tennis: { uri: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&h=500&q=80' }, // tennis
    golf: { uri: 'https://images.unsplash.com/photo-1535131749006-b7d58ee857b6?auto=format&fit=crop&w=500&h=500&q=80' }, // golf
    yoga: { uri: 'https://images.unsplash.com/photo-1599447292470-d3c1700e508a?auto=format&fit=crop&w=500&h=500&q=80' }, // yoga
  },

  // Books images
  books: {
    default: { uri: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&h=500&q=80' }, // books stack
    harry: { uri: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=500&h=500&q=80' }, // Harry Potter
    potter: { uri: 'https://images.unsplash.com/photo-1598153346810-860daa814c4b?auto=format&fit=crop&w=500&h=500&q=80' }, // Potter series
    set: { uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&h=500&q=80' }, // book set
    novel: { uri: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&w=500&h=500&q=80' }, // novel
    fiction: { uri: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=500&h=500&q=80' }, // fiction
    nonfiction: { uri: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=500&h=500&q=80' }, // non-fiction
    cookbook: { uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&h=500&q=80' }, // cookbook
    magazine: { uri: 'https://images.unsplash.com/photo-1586041828039-b8d193d6d1dc?auto=format&fit=crop&w=500&h=500&q=80' }, // magazine
    comic: { uri: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?auto=format&fit=crop&w=500&h=500&q=80' }, // comic book
  },

  // Other categories
  other: {
    default: { uri: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=500&h=500&q=80' }, // generic items
    jewelry: { uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&h=500&q=80' }, // jewelry
    plant: { uri: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&h=500&q=80' }, // plant
    art: { uri: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=500&h=500&q=80' }, // art
    toy: { uri: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=500&h=500&q=80' }, // toy
    game: { uri: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=500&h=500&q=80' }, // game
    tool: { uri: 'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?auto=format&fit=crop&w=500&h=500&q=80' }, // tool
    gift: { uri: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&h=500&q=80' }, // gift
  },

  // Default fallback image
  default: { uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&h=500&q=80' }, // placeholder
};

/**
 * Get an appropriate image for a product based on its title and category
 * This function intelligently selects an image that best matches the product,
 * considering both the title text and category to find the most relevant match.
 * 
 * @param {string} title - The product title
 * @param {string} category - The product category
 * @returns {{uri: string}} The image source object with URI
 * @example
 * // Returns an image for a leather jacket
 * getProductImage('Vintage Leather Jacket', 'Clothing')
 */
export const getProductImage = (title = '', category = '') => {
  const normalizedTitle = title.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  // Handle specific categories or default to "other"
  const validCategories = Object.keys(productImages);
  let categoryKey = normalizedCategory;
  if (!validCategories.includes(normalizedCategory) || normalizedCategory === '') {
    // Try to infer category from title if not specified
    if (normalizedTitle.includes('shirt') || normalizedTitle.includes('jacket') || normalizedTitle.includes('jeans') || 
        normalizedTitle.includes('dress') || normalizedTitle.includes('hoodie')) {
      categoryKey = 'clothing';
    } else if (normalizedTitle.includes('phone') || normalizedTitle.includes('laptop') || normalizedTitle.includes('camera') || 
              normalizedTitle.includes('headphones') || normalizedTitle.includes('tv') || normalizedTitle.includes('tech')) {
      categoryKey = 'electronics';
    } else if (normalizedTitle.includes('chair') || normalizedTitle.includes('table') || normalizedTitle.includes('desk') || 
              normalizedTitle.includes('sofa') || normalizedTitle.includes('couch') || normalizedTitle.includes('furniture')) {
      categoryKey = 'furniture';
    } else if (normalizedTitle.includes('book') || normalizedTitle.includes('novel') || normalizedTitle.includes('harry potter') || 
              normalizedTitle.includes('comic') || normalizedTitle.includes('magazine')) {
      categoryKey = 'books';
    } else if (normalizedTitle.includes('bike') || normalizedTitle.includes('ball') || normalizedTitle.includes('sport') || 
              normalizedTitle.includes('yoga') || normalizedTitle.includes('tennis') || normalizedTitle.includes('golf')) {
      categoryKey = 'sports';
    } else {
      categoryKey = 'other';
    }
  }

  // Get category-specific images
  const categoryImages = productImages[categoryKey] || productImages.default;

  // Comprehensive keywords mapping
  const keywordMap = {
    clothing: {
      'jacket': 'jacket',
      'leather': 'leather',
      'shirt': 'shirt',
      't-shirt': 'tshirt',
      'tshirt': 'tshirt',
      'hoodie': 'hoodie',
      'sweatshirt': 'hoodie',
      'dress': 'dress',
      'vintage': 'vintage',
      'jeans': 'jeans',
      'denim': 'jeans',
      'pants': 'jeans',
      'shoes': 'shoes',
      'sneakers': 'shoes',
      'boot': 'shoes',
    },
    electronics: {
      'iphone': 'iphone',
      'apple': 'iphone',
      'phone': 'phone',
      'smartphone': 'phone',
      'laptop': 'laptop',
      'macbook': 'laptop',
      'computer': 'computer',
      'pc': 'computer',
      'desktop': 'computer',
      'camera': 'camera',
      'dslr': 'camera',
      'polaroid': 'polaroid',
      'headphone': 'headphones',
      'earphone': 'headphones',
      'earbuds': 'headphones',
      'tv': 'tv',
      'television': 'tv',
      'monitor': 'tv',
      'speaker': 'speaker',
      'audio': 'speaker',
    },
    furniture: {
      'chair': 'chair',
      'table': 'table',
      'dining': 'table',
      'desk': 'desk',
      'office': 'desk',
      'work': 'desk',
      'modern': 'modern',
      'century': 'century',
      'mid-century': 'century',
      'sofa': 'sofa',
      'couch': 'couch',
      'sectional': 'couch',
      'bed': 'bed',
      'mattress': 'bed',
      'drawer': 'drawer',
      'dresser': 'drawer',
      'cabinet': 'cabinet',
      'storage': 'cabinet',
    },
    sports: {
      'bike': 'bike',
      'bicycle': 'bicycle',
      'cycling': 'bicycle',
      'trek': 'trek',
      'mountain': 'mountain',
      'hiking': 'mountain',
      'ball': 'ball',
      'football': 'football',
      'soccer': 'football',
      'basketball': 'basketball',
      'tennis': 'tennis',
      'racket': 'tennis',
      'golf': 'golf',
      'club': 'golf',
      'yoga': 'yoga',
      'mat': 'yoga',
      'fitness': 'yoga',
    },
    books: {
      'harry': 'harry',
      'potter': 'potter',
      'set': 'set',
      'collection': 'set',
      'novel': 'novel',
      'fiction': 'fiction',
      'non-fiction': 'nonfiction',
      'nonfiction': 'nonfiction',
      'cookbook': 'cookbook',
      'recipe': 'cookbook',
      'magazine': 'magazine',
      'comic': 'comic',
      'graphic': 'comic',
    },
    other: {
      'jewelry': 'jewelry',
      'necklace': 'jewelry',
      'ring': 'jewelry',
      'plant': 'plant',
      'succulent': 'plant',
      'flower': 'plant',
      'art': 'art',
      'painting': 'art',
      'poster': 'art',
      'toy': 'toy',
      'game': 'game',
      'board': 'game',
      'tool': 'tool',
      'gift': 'gift',
    }
  };

  // Check the title for specific keywords based on category
  const keywords = keywordMap[categoryKey] || {};
  for (const [keyword, imageKey] of Object.entries(keywords)) {
    if (normalizedTitle.includes(keyword) && categoryImages[imageKey]) {
      return categoryImages[imageKey];
    }
  }

  // Try to find more general matches if nothing specific matched
  for (const category in keywordMap) {
    if (category !== categoryKey) {
      const keywords = keywordMap[category];
      for (const [keyword, imageKey] of Object.entries(keywords)) {
        if (normalizedTitle.includes(keyword) && productImages[category][imageKey]) {
          return productImages[category][imageKey];
        }
      }
    }
  }

  // Return default image for the category if no specific match was found
  return categoryImages.default || productImages.default;
};
