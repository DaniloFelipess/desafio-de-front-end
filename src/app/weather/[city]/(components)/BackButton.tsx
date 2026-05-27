import Link from "next/link";
import { LiaArrowLeftSolid } from "react-icons/lia";

type BackButtonProps = {
  isWarm: boolean;
};

export function BackButton({ isWarm }: BackButtonProps) {
  return (
    <Link
      href="/"
      className={`absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full border text-[24px] leading-none transition hover:scale-105 focus:outline-none focus-visible:ring-2 md:top-8 md:left-8 ${
        isWarm
          ? "border-white/60 text-white hover:bg-white/10 focus-visible:ring-white"
          : "border-black/35 text-black hover:bg-black/10 focus-visible:ring-black"
      }`}
      aria-label="Back to city selection"
      title="Back"
    >
      <LiaArrowLeftSolid aria-hidden="true" />
    </Link>
  );
}
