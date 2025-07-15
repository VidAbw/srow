import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/components/auth/AuthProvider";

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate and save the shipping information
    console.log("Shipping info:", shippingInfo);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process the payment
    console.log("Payment info:", paymentInfo);
    router.push("/profile");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Shipping Information</h2>
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                value={shippingInfo.name}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, name: e.target.value })
                }
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <input
                type="text"
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, city: e.target.value })
                  }
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">State</label>
                <input
                  type="text"
                  value={shippingInfo.state}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, state: e.target.value })
                  }
                  className="border p-2 w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={shippingInfo.zipCode}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                  }
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Country</label>
                <input
                  type="text"
                  value={shippingInfo.country}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, country: e.target.value })
                  }
                  className="border p-2 w-full"
                  required
                />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Continue to Payment
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Payment Information</h2>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Card Number</label>
              <input
                type="text"
                value={paymentInfo.cardNumber}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })
                }
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={paymentInfo.expiryDate}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })
                  }
                  className="border p-2 w-full"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">CVV</label>
                <input
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                  }
                  className="border p-2 w-full"
                  required
                />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 