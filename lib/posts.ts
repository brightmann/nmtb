import fs from "fs"
import path from "path"
import { serialize } from "next-mdx-remote/serialize"
import { PostPreview } from "@/types/posts"

export const POSTS_PER_PAGE = 5

export async function getAllPostPreviews(): Promise<PostPreview[]> {
  const postFilePaths = fs.readdirSync("_posts").filter((postFilePath) => {
    return path.extname(postFilePath).toLowerCase() === ".mdx"
  })

  const postPreviews: PostPreview[] = []

  for (const postFilePath of postFilePaths) {
    const postFile = fs.readFileSync(`_posts/${postFilePath}`, "utf8")
    const serializedPost = await serialize(postFile, {
      parseFrontmatter: true,
    })

    postPreviews.push({
      ...serializedPost.frontmatter,
      slug: postFilePath.replace(".mdx", ""),
    } as PostPreview)
  }

  // Sort newest-first by frontmatter date; posts without a date go last
  // (in filesystem order) so Brite's dated posts always lead.
  postPreviews.sort((a, b) => {
    const dateA = a.date ? new Date(a.date as string).getTime() : 0
    const dateB = b.date ? new Date(b.date as string).getTime() : 0
    return dateB - dateA
  })

  return postPreviews
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync("_posts")
    .filter((p) => path.extname(p).toLowerCase() === ".mdx")
    .map((p) => p.replace(".mdx", ""))
}

export function getTotalPages(totalPosts: number): number {
  return Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))
}
