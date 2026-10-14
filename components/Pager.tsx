import Link from "next/link"

type PagerProps = {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pager({ currentPage, totalPages, basePath }: PagerProps) {
  if (totalPages <= 1) return null

  const pageHref = (page: number) => (page === 1 ? "/" : `${basePath}/${page}`)

  const pages: (number | "ellipsis")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis")
    }
  }

  return (
    <nav aria-label="Pagination" className="d-flex justify-content-center gap-2 my-4">
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1)} className="btn btn-outline-secondary btn-sm">
          Previous
        </Link>
      ) : (
        <span className="btn btn-outline-secondary btn-sm disabled">Previous</span>
      )}
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="btn btn-sm disabled">
            …
          </span>
        ) : p === currentPage ? (
          <span key={p} className="btn btn-secondary btn-sm disabled">
            {p}
          </span>
        ) : (
          <Link key={p} href={pageHref(p)} className="btn btn-outline-secondary btn-sm">
            {p}
          </Link>
        ),
      )}
      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1)} className="btn btn-outline-secondary btn-sm">
          Next
        </Link>
      ) : (
        <span className="btn btn-outline-secondary btn-sm disabled">Next</span>
      )}
    </nav>
  )
}
