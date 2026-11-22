import { Icon, ChevronLeftIcon, ChevronRightIcon } from '../../../components/icons';
import { Button } from '../../../components/ui';
import { useLang } from '../../../i18n';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { d } = useLang();
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label={d.pagination.aria} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          <Icon icon={ChevronLeftIcon} size={16} strokeWidth={1.5} />
          {d.pagination.prev}
        </Button>
        {pages.map((n) => (
          <Button
            key={n}
            variant={n === page ? 'primary' : 'ghost'}
            size="sm"
            aria-current={n === page ? 'page' : undefined}
            aria-label={`${d.pagination.page} ${n}`}
            onClick={() => onPageChange(n)}
            className="w-8 px-0"
          >
            {n}
          </Button>
        ))}
        <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          {d.pagination.next}
          <Icon icon={ChevronRightIcon} size={16} strokeWidth={1.5} />
        </Button>
      </div>
      <p className="text-sm text-muted">
        {d.pagination.page} {page} {d.pagination.of} {totalPages}
      </p>
    </nav>
  );
}