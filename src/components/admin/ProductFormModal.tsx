
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductForm from "./ProductForm";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          product={product}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
