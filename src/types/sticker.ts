
export interface StickerType {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  videoUrl?: string;
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  gallery: {
    image: string;
    caption?: string;
  }[];
  reviews: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  sizes: {
    name: string;
    dimensions: string;
    priceMultiplier: number;
  }[];
}

export interface StickerQuantityOption {
  quantity: number;
  priceMultiplier: number;
}
