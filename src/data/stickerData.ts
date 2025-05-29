
import { StickerType, StickerQuantityOption } from "../types/sticker";

export const quantityOptions: StickerQuantityOption[] = [
  { quantity: 10, priceMultiplier: 1 },
  { quantity: 25, priceMultiplier: 0.9 },
  { quantity: 50, priceMultiplier: 0.8 },
  { quantity: 100, priceMultiplier: 0.7 },
  { quantity: 250, priceMultiplier: 0.6 },
  { quantity: 500, priceMultiplier: 0.5 },
];

export const stickerTypes: StickerType[] = [
  {
    id: "die-cut",
    name: "Die Cut Stickers",
    description: "Custom shapes cut to the outline of your design",
    longDescription: "Our premium die cut stickers are custom-shaped to follow the contours of your design. Made from durable vinyl with a protective coating that makes them waterproof and scratch-resistant. Perfect for laptops, water bottles, car bumpers, and more.",
    price: 3.49,
    image: "/2.png",
    videoUrl: "https://www.example.com/videos/die-cut-demo.mp4",
    benefits: [
      { title: "Free Shipping", description: "Get your stickers in just 4 days", icon: "truck" },
      { title: "Online Proof", description: "Review your design before printing", icon: "check-square" },
      { title: "Weatherproof", description: "Durable vinyl that lasts years", icon: "shield" }
    ],
    gallery: [
      { image: "/2.png" },
      { image: "/1.png" },
      { image: "/3.png" }
    ],
    reviews: [
      { id: "1", name: "John D.", rating: 5, comment: "The die cut stickers came out perfect! Great quality and fast shipping.", date: "2024-05-01" },
      { id: "2", name: "Sarah M.", rating: 4, comment: "Love how my logo looks as a sticker. Will order again.", date: "2024-04-15" },
      { id: "3", name: "Mike R.", rating: 5, comment: "Excellent quality. The cut lines are perfect and the colors are vibrant.", date: "2024-04-03" }
    ],
    sizes: [
      { name: "Small", dimensions: "2\" x 2\"", priceMultiplier: 0.8 },
      { name: "Medium", dimensions: "3\" x 3\"", priceMultiplier: 1 },
      { name: "Custom", dimensions: "Custom dimensions", priceMultiplier: 1.2 }
    ]
  },
  {
    id: "circle",
    name: "Circle Stickers",
    description: "Perfect round stickers in various sizes",
    longDescription: "Our circle stickers are perfectly round and come in various sizes. They're made from high-quality vinyl with a protective coating that makes them waterproof and durable. Great for branding, packaging, or decorative purposes.",
    price: 2.99,
    image: "/4.png",
    benefits: [
      { title: "Free Shipping", description: "Get your stickers in just 4 days", icon: "truck" },
      { title: "Online Proof", description: "Review your design before printing", icon: "check-square" },
      { title: "Weatherproof", description: "Durable vinyl that lasts years", icon: "shield" }
    ],
    gallery: [
      { image: "/2.png" },
      { image: "/4.png" },
      { image: "/3.png" }
    ],
    reviews: [
      { id: "1", name: "Emily L.", rating: 5, comment: "Perfect circle stickers for my product packaging.", date: "2024-05-03" },
      { id: "2", name: "Tom B.", rating: 4, comment: "Great quality, though I wish they had more size options.", date: "2024-04-22" },
      { id: "3", name: "Jessica W.", rating: 5, comment: "These stickers look so professional on my coffee bags!", date: "2024-04-10" }
    ],
    sizes: [
      { name: "Small", dimensions: "2\" diameter", priceMultiplier: 0.8 },
      { name: "Medium", dimensions: "3\" diameter", priceMultiplier: 1 },
      { name: "Large", dimensions: "4\" diameter", priceMultiplier: 1.2 }
    ]
  },
  {
    id: "rectangle",
    name: "Rectangle Stickers",
    description: "Versatile rectangular stickers for many uses",
    longDescription: "Our rectangle stickers are perfect for labels, packaging, and promotional materials. Each sticker is made from premium vinyl with a protective coating, ensuring they stay vibrant and intact for years to come.",
    price: 2.99,
    image: "/1.png",
    benefits: [
      { title: "Free Shipping", description: "Get your stickers in just 4 days", icon: "truck" },
      { title: "Online Proof", description: "Review your design before printing", icon: "check-square" },
      { title: "Weatherproof", description: "Durable vinyl that lasts years", icon: "shield" }
    ],
    gallery: [
      { image: "/4.png" },
      { image: "/1.png" },
      { image: "/3.png" }
    ],
    reviews: [
      { id: "1", name: "Robert K.", rating: 5, comment: "Perfect for my product labels. Clear print and great adhesive.", date: "2024-05-05" },
      { id: "2", name: "Amanda J.", rating: 5, comment: "The rectangle stickers look very professional. Will order again!", date: "2024-04-25" },
      { id: "3", name: "David M.", rating: 4, comment: "Good quality, arrived quickly. Just what I needed for my business.", date: "2024-04-08" }
    ],
    sizes: [
      { name: "Small", dimensions: "2\" x 3\"", priceMultiplier: 0.8 },
      { name: "Medium", dimensions: "3\" x 5\"", priceMultiplier: 1 },
      { name: "Large", dimensions: "4\" x 6\"", priceMultiplier: 1.2 }
    ]
  },
  {
    id: "square",
    name: "Square Stickers",
    description: "Clean, geometric square stickers",
    longDescription: "Our square stickers offer a clean, geometric look perfect for modern designs. Available in multiple sizes and printed on high-quality vinyl with protective coating. Water-resistant and suitable for both indoor and outdoor use.",
    price: 2.99,
    image: "/3.png",
    benefits: [
      { title: "Free Shipping", description: "Get your stickers in just 4 days", icon: "truck" },
      { title: "Online Proof", description: "Review your design before printing", icon: "check-square" },
      { title: "Weatherproof", description: "Durable vinyl that lasts years", icon: "shield" }
    ],
    gallery: [
      { image: "/4.png" },
      { image: "/3.png" },
      { image: "/3.png" }
    ],
    reviews: [
      { id: "1", name: "Lisa P.", rating: 4, comment: "Nice square stickers with good adhesive. Colors look great.", date: "2024-05-04" },
      { id: "2", name: "Brian T.", rating: 5, comment: "Perfect squares with crisp edges. Exactly what I wanted.", date: "2024-04-20" },
      { id: "3", name: "Karen W.", rating: 5, comment: "These square stickers are perfect for my product labels!", date: "2024-04-05" }
    ],
    sizes: [
      { name: "Small", dimensions: "2\" x 2\"", priceMultiplier: 0.8 },
      { name: "Medium", dimensions: "3\" x 3\"", priceMultiplier: 1 },
      { name: "Large", dimensions: "4\" x 4\"", priceMultiplier: 1.2 }
    ]
  },
  {
    id: "cut-to-shape",
    name: "Cut to Shape Stickers",
    description: "Custom cut stickers from your artwork",
    longDescription: "Our cut to shape stickers allow you to create custom-shaped stickers from your artwork. Simply upload your design, and we'll cut it to match any shape you want. Perfect for creating unique promotional items or branded materials.",
    price: 3.99,
    image: "/cut to shape1.png",
    videoUrl: "https://www.example.com/videos/cut-to-shape-demo.mp4",
    benefits: [
      { title: "Free Shipping", description: "Get your stickers in just 4 days", icon: "truck" },
      { title: "Online Proof", description: "Review your design before printing", icon: "check-square" },
      { title: "Weatherproof", description: "Durable vinyl that lasts years", icon: "shield" }
    ],
    gallery: [
      { image: "/cut to shape3.png" },
      { image: "/cut to shape2.png" },
      { image: "/cut to shape1.png" }
    ],
    reviews: [
      { id: "1", name: "Alex M.", rating: 5, comment: "Love how my custom shape turned out! Will definitely order again.", date: "2024-05-02" },
      { id: "2", name: "Sophia L.", rating: 4, comment: "Great quality and the custom shape was cut perfectly.", date: "2024-04-18" },
      { id: "3", name: "Chris D.", rating: 5, comment: "These custom cut stickers exceeded my expectations!", date: "2024-04-07" }
    ],
    sizes: [
      { name: "Small", dimensions: "Up to 2\"", priceMultiplier: 0.8 },
      { name: "Medium", dimensions: "Up to 4\"", priceMultiplier: 1 },
      { name: "Large", dimensions: "Up to 6\"", priceMultiplier: 1.2 }
    ]
  }
];

export const getStickerById = (id: string): StickerType | undefined => {
  return stickerTypes.find(sticker => sticker.id === id);
};
