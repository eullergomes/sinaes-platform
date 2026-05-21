"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  url?: string;
  fallbackUrl?: string;
  forceBack?: boolean;
  label?: string;
}

const BackButton = ({
  url,
  fallbackUrl = "/courses",
  forceBack = false,
  label = "Voltar",
}: BackButtonProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (forceBack || !url) {
      const isInternalReferrer = document.referrer.includes(window.location.host);

      if (isInternalReferrer && window.history.length > 1) {
        e.preventDefault();
        router.back();
      }
    }
  };

  const href = forceBack ? fallbackUrl : (url || fallbackUrl);

  return (
    <div className="mb-6">
      <Link
        href={href}
        onClick={handleClick}
        className="inline-flex items-center text-sm text-black transition-colors hover:text-blue-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </div>
  );
};

export default BackButton;