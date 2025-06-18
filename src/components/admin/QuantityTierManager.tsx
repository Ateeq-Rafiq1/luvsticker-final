
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Percent } from "lucide-react";

interface QuantityTier {
  id?: string;
  min_quantity: number;
  max_quantity: number | null;
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
    const newTier: QuantityTier = {
      min_quantity: tiers.length > 0 ? (tiers[tiers.length - 1].max_quantity || 0) + 1 : 50,
      max_quantity: tiers.length === 0 ? 100 : (tiers[tiers.length - 1].max_quantity || 0) + 50,
      price_per_unit: basePricePerUnit,
      discount_percentage: 0,
      display_order: tiers.length
    };
    onTiersChange([...tiers, newTier]);
  };

  const removeTier = (index: number) => {
    const updatedTiers = tiers.filter((_, i) => i !== index);
    onTiersChange(updatedTiers);
  };

  const updateTier = (index: number, field: keyof QuantityTier, value: any) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    
    // Auto-calculate price based on discount if discount changes
    if (field === 'discount_percentage') {
      const discountedPrice = basePricePerUnit * (1 - value / 100);
      updatedTiers[index].price_per_unit = Math.max(0.01, discountedPrice);
    }
    
    onTiersChange(updatedTiers);
  };

  const calculateSavings = (tierPrice: number) => {
    if (tierPrice >= basePricePerUnit) return 0;
    return Math.round(((basePricePerUnit - tierPrice) / basePricePerUnit) * 100);
  };

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
        
        {tiers.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No quantity tiers defined. Users will pay the base price per unit.
          </div>
        ) : (
          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Tier {index + 1}</Badge>
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
                    onClick={() => removeTier(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Min Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={tier.min_quantity}
                      onChange={(e) => updateTier(index, 'min_quantity', parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Max Quantity</Label>
                    <Input
                      type="number"
                      min={tier.min_quantity}
                      value={tier.max_quantity || ''}
                      onChange={(e) => updateTier(index, 'max_quantity', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="No limit"
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
                      onChange={(e) => updateTier(index, 'price_per_unit', parseFloat(e.target.value) || 0.01)}
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
                      onChange={(e) => updateTier(index, 'discount_percentage', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  {tier.min_quantity} - {tier.max_quantity || '∞'} units: 
                  <strong className="ml-1">${tier.price_per_unit.toFixed(2)} each</strong>
                  {tier.max_quantity && (
                    <span className="ml-2">
                      Total: ${(tier.price_per_unit * tier.max_quantity).toFixed(2)}
                    </span>
                  )}
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
