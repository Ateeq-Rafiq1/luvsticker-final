
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Percent } from "lucide-react";

interface QuantityTier {
  id?: string;
  quantity: number;
  price_per_unit: number;
  discount_percentage: number;
  display_order: number;
  tempId?: string;
}

interface QuantityTierManagerProps {
  sizeName: string;
  basePricePerUnit: number;
  tiers: QuantityTier[];
  onTiersChange: (tiers: QuantityTier[]) => void;
}

const QuantityTierManager = ({ sizeName, basePricePerUnit, tiers, onTiersChange }: QuantityTierManagerProps) => {
  const addTier = () => {
    // Find the next logical quantity value
    const existingQuantities = tiers.map(t => t.quantity).sort((a, b) => a - b);
    let nextQuantity = 50;
    
    if (existingQuantities.length > 0) {
      const lastQuantity = existingQuantities[existingQuantities.length - 1];
      nextQuantity = lastQuantity + 25;
    }

    const newTier: QuantityTier = {
      quantity: nextQuantity,
      price_per_unit: basePricePerUnit,
      discount_percentage: 0,
      display_order: tiers.length,
      tempId: `temp-${Date.now()}-${Math.random()}`
    };
    
    const updatedTiers = [...tiers, newTier];
    onTiersChange(updatedTiers);
  };

  const removeTier = (index: number) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    // Update display orders
    const reorderedTiers = updatedTiers.map((tier, i) => ({ 
      ...tier, 
      display_order: i 
    }));
    onTiersChange(reorderedTiers);
  };

  const updateTier = (index: number, field: keyof QuantityTier, value: any) => {
    const updatedTiers = tiers.map((tier, i) => {
      if (i === index) {
        const updatedTier = { ...tier };
        
        if (field === 'quantity') {
          updatedTier.quantity = Math.max(1, parseInt(value) || 1);
        } else if (field === 'discount_percentage') {
          const discountValue = Math.max(0, Math.min(99, parseFloat(value) || 0));
          const discountedPrice = basePricePerUnit * (1 - discountValue / 100);
          updatedTier.price_per_unit = Math.max(0.01, discountedPrice);
          updatedTier.discount_percentage = discountValue;
        } else if (field === 'price_per_unit') {
          updatedTier.price_per_unit = Math.max(0.01, parseFloat(value) || 0.01);
        }
        
        return updatedTier;
      }
      return tier;
    });
    
    onTiersChange(updatedTiers);
  };

  const calculateSavings = (tierPrice: number) => {
    if (tierPrice >= basePricePerUnit) return 0;
    return Math.round(((basePricePerUnit - tierPrice) / basePricePerUnit) * 100);
  };

  return (
    <Card className="mt-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Quantity Tiers for {sizeName}</CardTitle>
          <Button type="button" onClick={addTier} variant="outline" size="sm">
            <Plus className="w-3 h-3 mr-1" />
            Add Tier
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-gray-600 mb-3">
          Base price: ${basePricePerUnit.toFixed(2)} per unit
        </div>
        
        {tiers.length === 0 ? (
          <div className="text-center py-3 text-gray-500 text-sm">
            No quantity tiers defined. Users will pay the base price per unit.
          </div>
        ) : (
          <div className="space-y-3">
            {tiers.map((tier, index) => (
              <div key={tier.tempId || tier.id || `tier-${index}`} className="border p-3 rounded-md bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Tier {index + 1}</Badge>
                    {calculateSavings(tier.price_per_unit) > 0 && (
                      <Badge variant="secondary" className="text-green-600 text-xs">
                        <Percent className="w-2 h-2 mr-1" />
                        Save {calculateSavings(tier.price_per_unit)}%
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTier(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={tier.quantity}
                      onChange={(e) => updateTier(index, 'quantity', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Price per Unit ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={tier.price_per_unit}
                      onChange={(e) => updateTier(index, 'price_per_unit', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Discount (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="99"
                      value={tier.discount_percentage}
                      onChange={(e) => updateTier(index, 'discount_percentage', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-600">
                  <strong>{tier.quantity} units: ${tier.price_per_unit.toFixed(2)} each</strong>
                  <span className="ml-2">
                    Total: ${(tier.price_per_unit * tier.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantityTierManager;
