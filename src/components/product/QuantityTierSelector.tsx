
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Percent, Calculator, Zap } from "lucide-react";

interface QuantityTier {
  id: string;
  quantity: number;
  price_per_unit: number;
  discount_percentage: number;
  display_order: number;
}

interface QuantityTierSelectorProps {
  basePricePerUnit: number;
  quantityTiers: QuantityTier[];
  selectedQuantity: number;
  onQuantityChange: (quantity: number, tierPrice?: number) => void;
}

const QuantityTierSelector = ({ 
  basePricePerUnit, 
  quantityTiers, 
  selectedQuantity, 
  onQuantityChange 
}: QuantityTierSelectorProps) => {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [customQuantity, setCustomQuantity] = useState<number>(selectedQuantity);
  const [useCustom, setUseCustom] = useState(false);

  // Sort tiers by quantity for display
  const sortedTiers = [...quantityTiers].sort((a, b) => a.quantity - b.quantity);

  const calculateSavings = (tierPrice: number) => {
    if (tierPrice >= basePricePerUnit) return 0;
    return Math.round(((basePricePerUnit - tierPrice) / basePricePerUnit) * 100);
  };

  const getBulkDiscountPrice = (quantity: number) => {
    // Apply 90% discount for quantities over 10,000
    if (quantity > 10000) {
      return basePricePerUnit * 0.1; // 90% off means paying only 10%
    }
    return null;
  };

  const getEffectivePrice = (quantity: number) => {
    // Check for bulk discount first
    const bulkPrice = getBulkDiscountPrice(quantity);
    if (bulkPrice !== null) {
      return bulkPrice;
    }

    // Check if this quantity matches any tier
    const matchingTier = sortedTiers.find(t => t.quantity === quantity);
    if (matchingTier) {
      return matchingTier.price_per_unit;
    }

    return basePricePerUnit;
  };

  const handleTierSelect = (tierId: string) => {
    const tier = sortedTiers.find(t => t.id === tierId);
    if (tier) {
      setSelectedTier(tierId);
      setUseCustom(false);
      const effectivePrice = getEffectivePrice(tier.quantity);
      onQuantityChange(tier.quantity, effectivePrice);
    }
  };

  const handleCustomQuantityChange = (quantity: number) => {
    setCustomQuantity(quantity);
    setUseCustom(true);
    setSelectedTier("");
    
    const effectivePrice = getEffectivePrice(quantity);
    onQuantityChange(quantity, effectivePrice);
  };

  const getTotalPrice = (quantity: number, pricePerUnit: number) => {
    return (quantity * pricePerUnit).toFixed(2);
  };

  if (sortedTiers.length === 0) {
    // Fallback to simple quantity input if no tiers
    return (
      <div className="space-y-4">
        <Label>Quantity</Label>
        <Input
          type="number"
          min="1"
          value={selectedQuantity}
          onChange={(e) => {
            const qty = parseInt(e.target.value) || 1;
            const effectivePrice = getEffectivePrice(qty);
            onQuantityChange(qty, effectivePrice);
          }}
          className="w-32"
        />
        <div className="text-sm text-gray-600">
          Price per unit: ${getEffectivePrice(selectedQuantity).toFixed(2)}
        </div>
        {selectedQuantity > 10000 && (
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-600" />
              <Badge className="bg-green-600 text-white">
                BULK DISCOUNT - 90% OFF
              </Badge>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Amazing savings on orders over 10,000 units!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Choose Quantity & Pricing</Label>
        <p className="text-sm text-gray-600 mt-1">
          Base price: ${basePricePerUnit.toFixed(2)} per unit
        </p>
      </div>

      <RadioGroup value={selectedTier} onValueChange={handleTierSelect}>
        <div className="grid gap-4">
          {sortedTiers.map((tier) => {
            const effectivePrice = getEffectivePrice(tier.quantity);
            const savings = calculateSavings(effectivePrice);
            const totalPrice = getTotalPrice(tier.quantity, effectivePrice);
            const isBulkDiscount = tier.quantity > 10000;
            
            return (
              <Card key={tier.id} className={`cursor-pointer transition-colors ${
                selectedTier === tier.id ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
              } ${isBulkDiscount ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={tier.id} id={tier.id} />
                    <div className="flex-1">
                      <Label htmlFor={tier.id} className="cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-lg">
                              {tier.quantity} units
                            </span>
                            {isBulkDiscount ? (
                              <Badge className="bg-green-600 text-white">
                                <Zap className="w-3 h-3 mr-1" />
                                BULK 90% OFF
                              </Badge>
                            ) : savings > 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <Percent className="w-3 h-3 mr-1" />
                                Save {savings}%
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${isBulkDiscount ? 'text-green-600' : 'text-orange-600'}`}>
                              ${totalPrice}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${effectivePrice.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Custom Quantity Option */}
          <Card className={`cursor-pointer transition-colors ${
            useCustom ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
          } ${customQuantity > 10000 ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem 
                  value="custom" 
                  id="custom"
                  checked={useCustom}
                  onClick={() => setUseCustom(true)}
                />
                <div className="flex-1">
                  <Label htmlFor="custom" className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold">Custom Quantity</span>
                        <Calculator className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="number"
                          min="1"
                          value={customQuantity}
                          onChange={(e) => handleCustomQuantityChange(parseInt(e.target.value) || 1)}
                          className="w-24 text-center"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="text-right">
                          <div className={`text-xl font-bold ${customQuantity > 10000 ? 'text-green-600' : 'text-orange-600'}`}>
                            ${getTotalPrice(customQuantity, getEffectivePrice(customQuantity))}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${getEffectivePrice(customQuantity).toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Discount Notice */}
          {(useCustom && customQuantity > 10000) && (
            <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-6 h-6 text-green-600" />
                <Badge className="bg-green-600 text-white text-sm">
                  BULK DISCOUNT APPLIED - 90% OFF
                </Badge>
              </div>
              <p className="text-sm text-green-700 font-medium">
                🎉 Incredible savings! You're getting 90% off on this bulk order of {customQuantity.toLocaleString()} units.
              </p>
              <p className="text-xs text-green-600 mt-1">
                Original price: ${basePricePerUnit.toFixed(2)} → Your price: ${(basePricePerUnit * 0.1).toFixed(2)} per unit
              </p>
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default QuantityTierSelector;
