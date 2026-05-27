"use client";

import { useRouter } from "next/navigation";
import { LiaArrowLeftSolid } from "react-icons/lia";

type BackButtonProps = {
  isWarm: boolean;
};

export function BackButton({ isWarm }: BackButtonProps) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full border text-[24px] leading-none transition hover:scale-105 focus:outline-none focus-visible:ring-2 md:top-8 md:left-8 ${
        isWarm
          ? "border-white/60 text-white hover:bg-white/10 focus-visible:ring-white"
          : "border-black/35 text-black hover:bg-black/10 focus-visible:ring-black"
      }`}
      aria-label="Back to city selection"
      title="Back"
    >
      <LiaArrowLeftSolid aria-hidden="true" />
    </button>
  );
}
