"use client";

import React, { useState } from "react";
import PhoneInputLib from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import toast from "react-hot-toast";
import PrimaryButton from "@/components/ui/PrimaryButton";

interface PhoneInputProps {
  onPhoneSubmit: (phone: string) => void;
  isLoading?: boolean;
}

export default function PhoneInput({ onPhoneSubmit, isLoading = false }: PhoneInputProps) {
  const [phone, setPhone] = useState<string>("");

  const handleContinue = () => {
    if (!phone || !isPossiblePhoneNumber(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    onPhoneSubmit(phone);
  };

  const isValid = phone && isPossiblePhoneNumber(phone);

  return (
    <div>
      <PhoneInputLib
        international
        defaultCountry="NG"
        value={phone}
        onChange={(v) => setPhone(v || "")}
        placeholder="+234..."
        className="custom-phone-input-auth"
        inputComponent={(props) => (
          <input
            {...props}
            className="w-full h-14 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 text-lg focus:ring-2 focus:ring-blue-600 dark:bg-neutral-800 dark:text-white bg-white text-neutral-900 placeholder-neutral-500 dark:placeholder-neutral-400 transition"
          />
        )}
      />
      <PrimaryButton
        onClick={handleContinue}
        disabled={!isValid}
        loading={isLoading}
      >
        Continue
      </PrimaryButton>
    </div>
  );
}
