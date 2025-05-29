
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export const MaterialsManagement = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      name: "Vinyl",
      description: "Durable waterproof vinyl material",
      properties: "Waterproof, UV-resistant, 2-5 year outdoor durability",
      productCount: 30,
    },
    {
      id: 2,
      name: "Matte",
      description: "Non-glossy finish with elegant look",
      properties: "Fingerprint-resistant, non-reflective surface",
      productCount: 25,
    },
    {
      id: 3,
      name: "Glossy",
      description: "Shiny finish with vibrant colors",
      properties: "High-shine, vibrant color reproduction",
      productCount: 20,
    },
    {
      id: 4,
      name: "Waterproof",
      description: "Extra durable for outdoor conditions",
      properties: "100% waterproof, dishwasher safe, 5+ year outdoor durability",
      productCount: 15,
    },
    {
      id: 5,
      name: "Holographic",
      description: "Rainbow effect that changes with light angles",
      properties: "Prismatic effect, eye-catching in direct light",
      productCount: 10,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<any>(null);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    description: "",
    properties: "",
  });

  const handleAddMaterial = () => {
    const materialToAdd = {
      id: materials.length + 1,
      name: newMaterial.name,
      description: newMaterial.description,
      properties: newMaterial.properties,
      productCount: 0,
    };
    
    setMaterials([...materials, materialToAdd]);
    setIsAddDialogOpen(false);
    setNewMaterial({
      name: "",
      description: "",
      properties: "",
    });
    
    toast({
      title: "Material added",
      description: `${materialToAdd.name} has been added successfully.`,
    });
  };

  const handleEditMaterial = () => {
    if (!currentMaterial) return;
    
    const updatedMaterials = materials.map((m) =>
      m.id === currentMaterial.id ? currentMaterial : m
    );
    
    setMaterials(updatedMaterials);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Material updated",
      description: `${currentMaterial.name} has been updated successfully.`,
    });
  };

  const handleDeleteMaterial = () => {
    if (!currentMaterial) return;
    
    const filteredMaterials = materials.filter(
      (m) => m.id !== currentMaterial.id
    );
    setMaterials(filteredMaterials);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Material deleted",
      description: `${currentMaterial.name} has been deleted.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Materials Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell>{material.properties}</TableCell>
                <TableCell>{material.productCount}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setCurrentMaterial(material);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setCurrentMaterial(material);
                      setIsDeleteDialogOpen(true);
                    }}
                    disabled={material.productCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Material Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newMaterial.name}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newMaterial.description}
                onChange={(e) =>
                  setNewMaterial({
                    ...newMaterial,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="properties" className="text-right">
                Properties
              </Label>
              <Textarea
                id="properties"
                value={newMaterial.properties}
                onChange={(e) =>
                  setNewMaterial({
                    ...newMaterial,
                    properties: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMaterial}>Add Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          {currentMaterial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentMaterial.name}
                  onChange={(e) =>
                    setCurrentMaterial({
                      ...currentMaterial,
                      name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={currentMaterial.description}
                  onChange={(e) =>
                    setCurrentMaterial({
                      ...currentMaterial,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-properties" className="text-right">
                  Properties
                </Label>
                <Textarea
                  id="edit-properties"
                  value={currentMaterial.properties}
                  onChange={(e) =>
                    setCurrentMaterial({
                      ...currentMaterial,
                      properties: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMaterial}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Material Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Material</DialogTitle>
          </DialogHeader>
          {currentMaterial && (
            <div className="py-4">
              <p>
                Are you sure you want to delete "{currentMaterial.name}"? This
                action cannot be undone.
              </p>
              {currentMaterial.productCount > 0 && (
                <p className="text-red-500 mt-2">
                  This material is used by {currentMaterial.productCount}{" "}
                  products. You must reassign or delete these products first.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMaterial}
              disabled={currentMaterial?.productCount > 0}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
