
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Percent, Calculator } from "lucide-react";

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

  const handleTierSelect = (tierId: string) => {
    const tier = sortedTiers.find(t => t.id === tierId);
    if (tier) {
      setSelectedTier(tierId);
      setUseCustom(false);
      onQuantityChange(tier.quantity, tier.price_per_unit);
    }
  };

  const handleCustomQuantityChange = (quantity: number) => {
    setCustomQuantity(quantity);
    setUseCustom(true);
    setSelectedTier("");
    
    // Check if this quantity matches any tier
    const matchingTier = sortedTiers.find(t => t.quantity === quantity);
    if (matchingTier) {
      onQuantityChange(quantity, matchingTier.price_per_unit);
    } else {
      onQuantityChange(quantity, basePricePerUnit);
    }
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
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
          className="w-32"
        />
        <div className="text-sm text-gray-600">
          Price per unit: ${basePricePerUnit.toFixed(2)}
        </div>
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
            const savings = calculateSavings(tier.price_per_unit);
            const totalPrice = getTotalPrice(tier.quantity, tier.price_per_unit);
            
            return (
              <Card key={tier.id} className={`cursor-pointer transition-colors ${
                selectedTier === tier.id ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
              }`}>
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
                            {savings > 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <Percent className="w-3 h-3 mr-1" />
                                Save {savings}%
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              ${totalPrice}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${tier.price_per_unit.toFixed(2)} each
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
          }`}>
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
                          <div className="text-xl font-bold text-orange-600">
                            ${getTotalPrice(customQuantity, 
                              sortedTiers.find(t => t.quantity === customQuantity)?.price_per_unit || basePricePerUnit
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${(sortedTiers.find(t => t.quantity === customQuantity)?.price_per_unit || basePricePerUnit).toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </RadioGroup>
    </div>
  );
};

export default QuantityTierSelector;
