
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
      display_order: tiers.length
    };
    
    // Create a new array with the new tier to trigger re-render
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
    // Create a completely new array to ensure React detects the change
    const updatedTiers = tiers.map((tier, i) => {
      if (i === index) {
        const updatedTier = { ...tier, [field]: value };
        
        // Auto-calculate price based on discount if discount changes
        if (field === 'discount_percentage') {
          const discountedPrice = basePricePerUnit * (1 - value / 100);
          updatedTier.price_per_unit = Math.max(0.01, discountedPrice);
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

  // Sort tiers by quantity for display
  const sortedTiers = [...tiers].sort((a, b) => a.quantity - b.quantity);

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Quantity Tiers for {sizeName}</CardTitle>
          <Button type="button" onClick={addTier} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Tier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Base price: ${basePricePerUnit.toFixed(2)} per unit
        </div>
        
        {sortedTiers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No quantity tiers defined. Users will pay the base price per unit.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTiers.map((tier, sortedIndex) => {
              // Find the original index in the unsorted array
              const originalIndex = tiers.findIndex(t => 
                t.quantity === tier.quantity && 
                t.price_per_unit === tier.price_per_unit &&
                t.display_order === tier.display_order
              );
              
              return (
                <div key={`${tier.quantity}-${tier.price_per_unit}-${originalIndex}`} className="border p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Tier {sortedIndex + 1}</Badge>
                      {calculateSavings(tier.price_per_unit) > 0 && (
                        <Badge variant="secondary" className="text-green-600">
                          <Percent className="w-3 h-3 mr-1" />
                          Save {calculateSavings(tier.price_per_unit)}%
                        </Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTier(originalIndex)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={tier.quantity}
                        onChange={(e) => updateTier(originalIndex, 'quantity', parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Price per Unit ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={tier.price_per_unit}
                        onChange={(e) => updateTier(originalIndex, 'price_per_unit', parseFloat(e.target.value) || 0.01)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Discount (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="99"
                        value={tier.discount_percentage}
                        onChange={(e) => updateTier(originalIndex, 'discount_percentage', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>{tier.quantity} units: ${tier.price_per_unit.toFixed(2)} each</strong>
                    <span className="ml-2">
                      Total: ${(tier.price_per_unit * tier.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantityTierManager;
