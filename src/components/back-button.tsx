import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
  url?: string;
  label?: string;
}

const BackButton = ({url = "/courses", label = "Voltar"}: BackButtonProps) => {
  return (
    <div className="mb-6">
      <Link
        href={url}
        className="inline-flex items-center text-sm text-black transition-colors hover:text-blue-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </div>
  );
};

export default BackButton;
