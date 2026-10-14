import PostCard from "@/components/PostCard"
import Pager from "@/components/Pager"
import { InferGetStaticPropsType } from "next"
import { getAllPostPreviews, getTotalPages, POSTS_PER_PAGE } from "@/lib/posts"

export default function Home({ postPreviews, totalPages }: InferGetStaticPropsType<typeof getStaticProps>) {
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
      <Pager currentPage={1} totalPages={totalPages} basePath="/page" />
    </div>
  )
}

export async function getStaticProps() {
  const allPreviews = await getAllPostPreviews()
  const totalPages = getTotalPages(allPreviews.length)

  return {
    props: {
      postPreviews: allPreviews.slice(0, POSTS_PER_PAGE),
      totalPages,
    },
  }
}
