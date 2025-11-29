import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CartAddedDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    function handleProductAdded(e) {
      if (e && e.detail && e.detail.product) {
        setProduct(e.detail.product);
        setOpen(true);
      }
    }

    window.addEventListener("product:added-to-cart", handleProductAdded);
    return () => {
      window.removeEventListener("product:added-to-cart", handleProductAdded);
    };
  }, []);

  const handleContinueShopping = () => {
    setOpen(false);
    setProduct(null);
  };

  const handleGoToCart = () => {
    setOpen(false);
    setProduct(null);
    navigate("/cart");
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Producto añadido al carrito</DialogTitle>
          <DialogDescription>
            {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {product.image && (
            <div className="w-48 h-64 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleContinueShopping}
            className="flex-1 px-4 py-2 rounded-full border-2 border-brand-dark text-brand-dark bg-white hover:bg-slate-50 font-medium transition-colors"
          >
            Continuar Comprando
          </button>
          <button
            onClick={handleGoToCart}
            className="flex-1 px-4 py-2 rounded-full bg-brand-dark text-white hover:bg-brand-light hover:text-brand-dark font-medium transition-colors"
          >
            Ir al Carrito
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
