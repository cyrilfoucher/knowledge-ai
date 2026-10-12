import Button from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <div className="mt-6 grid grid-cols-3 items-center">
      <Button
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="justify-self-start"
      >
        Précédent
      </Button>
      <span className="font-semibold text-heading text-center">
        Page {page} sur {totalPages}
      </span>
      <Button
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="justify-self-end"
      >
        Suivant
      </Button>
    </div>
  );
}
export default Pagination;
