// ============================================================
//  FOREVER FLOWERS — PRODUCT LIST
//  ✏️  HOW TO EDIT:
//  • Change a name   → edit the "name" value
//  • Change a price  → edit the "price" value (numbers only, no KSh)
//  • Cross-out price → add "originalPrice" (leave out if no sale)
//  • Add a badge     → set "badge" to "Sale", "New", "Popular", etc.
//  • Add a product   → copy one object below, paste at the end,
//                      change its "id" to the next number.
//  • Remove product  → delete the whole { ... }, block.
//  • Change image    → put your image file in the same folder,
//                      then set "image" to the filename e.g. "roses.jpg"
//                      OR use a full URL e.g. "https://..."
// ============================================================

const products = [

  {
    id: 1,
    name: "Classic Tulips",
    price: 699.18,
    originalPrice: 5018.10,   // ← remove this line if no sale price
    image: "https://images.unsplash.com/photo-1487530811015-780780169993?w=600&q=80",
    badge: "Sale",            // ← options: "Sale" | "New" | "Popular" | "" (empty = no badge)
    description: "Fresh classic tulips, perfect for any occasion."
  },

  {
    id: 2,
    name: "Romantic Tulips",
    price: 2146.56,
    originalPrice: 2745.12,
    image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&q=80",
    badge: "Popular",
    description: "A romantic bouquet of handpicked tulips, wrapped with love."
  },

  {
    id: 3,
    name: "Flower Bucket",
    price: 4992.30,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "",
    description: "A generous bucket arrangement bursting with seasonal flowers."
  },

  {
    id: 4,
    name: "Lavender Love",
    price: 1850.00,
    image: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=600&q=80",
    badge: "New",
    description: "Dried lavender bouquet — long-lasting and beautifully fragrant."
  },

  {
    id: 5,
    name: "Sunshine Mix",
    price: 2350.00,
    image: "https://images.unsplash.com/photo-1490750967868-88df5691cc60?w=600&q=80",
    badge: "",
    description: "Bright sunflowers and mixed blooms to light up any room."
  },

  {
    id: 6,
    name: "Forever Rose Set",
    price: 3500.00,
    image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&q=80",
    badge: "Popular",
    description: "Preserved roses in an elegant box — a gift that lasts forever."
  },

  {
    id: 7,
    name: "Birthday Surprise Box",
    price: 2800.00,
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80",
    badge: "New",
    description: "Colourful mix of blooms arranged in a beautiful gift box."
  },

  {
    id: 8,
    name: "Wedding White Bouquet",
    price: 5500.00,
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80",
    badge: "",
    description: "Elegant white roses and lilies — perfect for your special day."
  }

];

// ============================================================
//  TESTIMONIALS — Edit names and messages below
// ============================================================
const testimonials = [
  {
    name: "Amina W. 🌸",
    text: "Forever Flowers made my anniversary unforgettable. The bouquet was even more beautiful in person!"
  },
  {
    name: "James K. 🌷",
    text: "Ordered for my mum's birthday and she cried happy tears. Fast delivery and stunning arrangement!"
  },
  {
    name: "Fatuma H. 🌺",
    text: "The lavender bouquet still looks gorgeous two weeks later. Will definitely order again!"
  },
  {
    name: "Brian O. 🌻",
    text: "Best flower shop in Nairobi. The custom bouquet was exactly what I described. Highly recommended!"
  }
];
