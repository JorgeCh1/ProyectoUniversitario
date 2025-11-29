import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProductDetailAddedDialog() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleProductAdded(e) {
      if (e && e.detail && e.detail.product) {
        setProduct(e.detail.product);
        setOpen(true);
      }
    }

    window.addEventListener("product:added-to-cart", handleProductAdded);
    return () => window.removeEventListener("product:added-to-cart", handleProductAdded);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-brand-dark">
            ✓ Producto añadido correctamente
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {product && (
            <div className="text-center">
              <p className="text-sm text-slate-600">{product.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                Cantidad: {product.quantity}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setOpen(false);
                navigate("/cart");
              }}
              className="flex-1"
            >
              Ver carrito
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
