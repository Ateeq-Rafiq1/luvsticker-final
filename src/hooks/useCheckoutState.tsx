// This file is no longer needed as we've switched to an inquiry-based system
// Keeping as placeholder to avoid import errors
import { useState } from "react";

export interface CheckoutState {
  selectedSize: any;
  quantity: number;
  customDimensions: { width: number; height: number } | null;
  artworkFile: File | null;
  artworkViaEmail: boolean;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const useCheckoutState = () => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    selectedSize: null,
    quantity: 1,
    customDimensions: null,
    artworkFile: null,
    artworkViaEmail: false,
    customerInfo: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
  });

  const updateCheckoutState = (updates: Partial<CheckoutState>) => {
    setCheckoutState(prev => ({ ...prev, ...updates }));
  };

  return {
    checkoutState,
    updateCheckoutState,
  };
};
