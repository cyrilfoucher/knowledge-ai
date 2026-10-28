import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallback: string;
}

function BackButton({ fallback }: BackButtonProps) {
  const navigate = useNavigate();
  function handleBack() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }
  return (
    <button
      type="button"
      onClick={handleBack}
      className="mb-4 inline-flex cursor-pointer items-center gap-1 text-sm text-muted hover:text-text"
    >
      <ArrowLeft size={16} />
      Retour
    </button>
  );
}

export default BackButton;
