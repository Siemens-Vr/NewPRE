'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './pagination.module.css';

export default function Pagination({ count, itemsPerPage = 10 }) {
  const searchParams = useSearchParams();
  const pathname     = usePathname();
  const { replace }  = useRouter();

  // Current zero-based page from URL
  const page = parseInt(searchParams.get('page') ?? '0', 10);

  const pageCount = Math.ceil(count / itemsPerPage);

  const hasPrev = page > 0;
  const hasNext = page + 1 < pageCount;

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
        ← Prev
      </button>

      <span className={styles.pageInfo}>
        {page + 1} / {pageCount}
      </span>

      <button
        className={styles.button}
        onClick={() => changePage(page + 1)}
        disabled={!hasNext}
      >
        Next →
      </button>
    </div>
  );
}
