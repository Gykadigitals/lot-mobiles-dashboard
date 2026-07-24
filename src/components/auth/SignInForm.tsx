"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Select from "@/components/form/Select";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthProvider";
import { Role } from "@/lib/auth/roles";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("ADMINISTRATOR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUserRole, isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let isValid = false;

    if (
      selectedRole === "ADMINISTRATOR" &&
      email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      isValid = true;
    } else if (
      selectedRole === "PRODUCT_MANAGER" &&
      email === process.env.NEXT_PUBLIC_PRODUCT_MANAGER_EMAIL &&
      password === process.env.NEXT_PUBLIC_PRODUCT_MANAGER_PASSWORD
    ) {
      isValid = true;
    } else if (
      selectedRole === "SALES_MANAGER" &&
      email === process.env.NEXT_PUBLIC_SALES_MANAGER_EMAIL &&
      password === process.env.NEXT_PUBLIC_SALES_MANAGER_PASSWORD
    ) {
      isValid = true;
    } else if (
      selectedRole === "MIS" &&
      email === process.env.NEXT_PUBLIC_MIS_EMAIL &&
      password === process.env.NEXT_PUBLIC_MIS_PASSWORD
    ) {
      isValid = true;
    } else if (
      selectedRole === "ORDER_MANAGEMENT" &&
      email === process.env.NEXT_PUBLIC_ORDER_MANAGEMENT_EMAIL &&
      password === process.env.NEXT_PUBLIC_ORDER_MANAGEMENT_PASSWORD
    ) {
      isValid = true;
    } else if (
      selectedRole === "HR" &&
      email === process.env.NEXT_PUBLIC_HR_EMAIL &&
      password === process.env.NEXT_PUBLIC_HR_PASSWORD
    ) {
      isValid = true;
    }

    if (isValid) {
      setUserRole(selectedRole);
      router.push("/");
    } else {
      setError("Invalid email or password for the selected role.");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>

            {error && (
              <div className="mb-4 text-sm text-error-500 text-center font-medium">
                {error}
              </div>
            )}
            <form onSubmit={handleSignIn}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Role <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Select
                    options={[
                      { value: "ADMINISTRATOR", label: "Administrator" },
                      { value: "PRODUCT_MANAGER", label: "Product Manager" },
                      { value: "SALES_MANAGER", label: "Sales Manager" },
                      { value: "MIS", label: "MIS" },
                      { value: "ORDER_MANAGEMENT", label: "Order Management" },
                      { value: "HR", label: "HR" },
                    ]}
                    defaultValue={selectedRole}
                    onChange={(val) => setSelectedRole(val as Role)}
                  />
                </div>
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
