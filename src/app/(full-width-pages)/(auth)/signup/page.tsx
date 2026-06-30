import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LOT Mobiles",
  description: "LOT Mobiles",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
