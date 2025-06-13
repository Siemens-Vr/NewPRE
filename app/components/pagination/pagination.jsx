// app/components/pagination/Pagination.jsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from '@/app/styles/pagination/pagination.module.css';

export default function Pagination({ count, itemsPerPage = 10 }) {
  const searchParams = useSearchParams();
  const pathname     = usePathname();
  const { replace }  = useRouter();

  // Current page from URL (0-based)
  const page = parseInt(searchParams.get('page') ?? '0', 10);

  // Compute whether prev/next exist
  const hasPrev = page > 0;
  const hasNext = (page + 1) * itemsPerPage < count;

  // Handler to bump page param
  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={() => changePage(page - 1)}
        disabled={!hasPrev}
      >
        Previous
      </button>

      <span className={styles.pageInfo}>
        Page {page + 1} of {Math.ceil(count / itemsPerPage)}
      </span>

      <button
        className={styles.button}
        onClick={() => changePage(page + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
}
