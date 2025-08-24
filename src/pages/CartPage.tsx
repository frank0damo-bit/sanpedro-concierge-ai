import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const cartImageUrl = "https://images.unsplash.com/photo-1516832677958-6a9a0b182a12";

export function CartPage() {
  const { cart, removeFromCart, cartCount } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + tax;

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] -mt-16 flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cartImageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-bold">Your Adventure Awaits</h1>
          <p className="text-xl md:text-2xl mt-4 max-w-2xl mx-auto">Review your selections and get ready for an unforgettable trip.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {cartCount > 0 ? (
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2 space-y-6">
                {cart.map(item => (
                  <Card key={item.id} className="flex items-center p-4">
                    <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="ml-6 flex-grow">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      {item.options && item.options.length > 0 && (
                        <ul className="text-xs text-muted-foreground mt-2">
                          {item.options.map(opt => <li key={opt.name}>+ {opt.name}</li>)}
                        </ul>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes & Fees</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <Button size="lg" className="w-full">Proceed to Checkout</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added any services yet.</p>
              <Link to="/services">
                <Button>Explore Services</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
