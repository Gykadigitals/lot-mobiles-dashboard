export type PaymentStatus = "Successful" | "Failed" | "Pending" | "Refunded";
export type PaymentMethod = "Credit Card" | "PayPal" | "Bank Transfer" | "Crypto";
export type Gateway = "Stripe" | "Razorpay" | "PayPal" | "Coinbase";

export interface PaymentRecord {
  id: string; // Payment ID
  orderId: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  gateway: Gateway;
  date: string; // ISO String
}

export const mockPayments: PaymentRecord[] = [
  {
    id: "PAY-1001",
    orderId: "ORD-5432",
    customerName: "Alex Johnson",
    customerEmail: "alex.j@example.com",
    paymentMethod: "Credit Card",
    transactionId: "TXN-87654321",
    amount: 1299.99,
    status: "Successful",
    gateway: "Stripe",
    date: "2023-10-25T14:32:00Z",
  },
  {
    id: "PAY-1002",
    orderId: "ORD-5433",
    customerName: "Maria Garcia",
    customerEmail: "m.garcia@example.com",
    paymentMethod: "PayPal",
    transactionId: "TXN-87654322",
    amount: 49.50,
    status: "Pending",
    gateway: "PayPal",
    date: "2023-10-25T15:05:00Z",
  },
  {
    id: "PAY-1003",
    orderId: "ORD-5434",
    customerName: "David Chen",
    customerEmail: "david.c@example.com",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-87654323",
    amount: 3450.00,
    status: "Failed",
    gateway: "Razorpay",
    date: "2023-10-26T09:12:00Z",
  },
  {
    id: "PAY-1004",
    orderId: "ORD-5435",
    customerName: "Emma Wilson",
    customerEmail: "emma.w@example.com",
    paymentMethod: "Credit Card",
    transactionId: "TXN-87654324",
    amount: 199.99,
    status: "Refunded",
    gateway: "Stripe",
    date: "2023-10-26T11:45:00Z",
  },
  {
    id: "PAY-1005",
    orderId: "ORD-5436",
    customerName: "James Brown",
    customerEmail: "j.brown@example.com",
    paymentMethod: "Crypto",
    transactionId: "TXN-87654325",
    amount: 850.00,
    status: "Successful",
    gateway: "Coinbase",
    date: "2023-10-27T16:20:00Z",
  },
  {
    id: "PAY-1006",
    orderId: "ORD-5437",
    customerName: "Sophia Lee",
    customerEmail: "sophia.lee@example.com",
    paymentMethod: "PayPal",
    transactionId: "TXN-87654326",
    amount: 120.00,
    status: "Successful",
    gateway: "PayPal",
    date: "2023-10-27T18:10:00Z",
  },
];
