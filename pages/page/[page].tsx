import PostCard from "@/components/PostCard"
import Pager from "@/components/Pager"
import { GetStaticPropsContext, InferGetStaticPropsType } from "next"
import { getAllPostPreviews, getTotalPages, POSTS_PER_PAGE } from "@/lib/posts"

export default function PagedHome({
  postPreviews,
  currentPage,
  totalPages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <div className={"row"}>
        {postPreviews.map((postPreview, i) => {
          return (
            <div className={"col-6 mb-4"} key={i}>
              <PostCard postPreview={postPreview} />
            </div>
          )
        })}
      </div>
      <Pager currentPage={currentPage} totalPages={totalPages} basePath="/page" />
    </div>
  )
}

export async function getStaticPaths() {
  const allPreviews = await getAllPostPreviews()
  const totalPages = getTotalPages(allPreviews.length)
  // page 1 is the homepage; only pre-render pages 2..N
  const paths = Array.from({ length: totalPages - 1 }, (_, i) => ({
    params: { page: String(i + 2) },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps(ctx: GetStaticPropsContext<{ page: string }>) {
  const currentPage = parseInt(ctx.params!.page, 10)
  const allPreviews = await getAllPostPreviews()
  const totalPages = getTotalPages(allPreviews.length)

  if (currentPage < 2 || currentPage > totalPages) {
    return { notFound: true }
  }

  return {
    props: {
      postPreviews: allPreviews.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
      currentPage,
      totalPages,
    },
  }
}
