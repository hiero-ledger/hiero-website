import type { Metadata } from "next";
import Image from "next/image";
import {
  getAllPosts,
  getPostBySlug,
  type PostAuthor,
  type PostFull,
  type PostMeta,
} from "../../../lib/posts";
import { format } from "date-fns";
import Link from "next/link";
import RichText from "@/components/RichText";
import ShareButtons from "@/components/ShareButtons";
import { notFound } from "next/navigation";

export function generateStaticParams(): { slug: string }[] {
  const posts: PostMeta[] = getAllPosts();
  return posts.map((post: PostMeta) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post: PostFull | null = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.abstract };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: PostFull | null = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts: PostMeta[] = getAllPosts();
  const recentPosts: PostMeta[] = allPosts
    .filter((candidate: PostMeta) => candidate.slug !== slug)
    .slice(0, 4);

  return (
    <div className="mx-auto flex">
      <article className="w-full break-words">
        {/* Hero */}
        <div
          id="hero"
          className="bg-gradient-to-br from-red-dark via-red to-red relative">
          <div className="container pt-14 pb-12 sm:py-[100px] text-white">
            <h1 className="font-medium text-xl sm:text-2xl leading-none relative mb-6 sm:mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-6">
              {post.authors.map((author: PostAuthor, i: number) => (
                <AuthorBlock
                  key={i}
                  author={author}
                  date={post.date}
                  duration={post.duration}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container py-14 sm:py-[80px] lg:py-[90px]">
          <main className="w-full min-w-0 max-w-[800px] mx-auto">
            <RichText
              markdown={post.contentMarkdown}
              className="content text-sm text-charcoal font-normal sm:text-base"
            />
            <div className="mt-11 mx-auto w-fit">
              <ShareButtons />
            </div>
          </main>
        </div>

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <div className="w-full bg-gray-light">
            <div className="container py-[60px] sm:py-[110px] text-black">
              <h2 className="text-[24px] leading-none font-medium">
                Recent Hiero Posts
              </h2>
              <ul className="mt-6 grid grid-cols-1 xl:grid-cols-4 gap-[38px] list-none p-0">
                {recentPosts.map((rp: PostMeta) => (
                  <li key={rp.slug}>
                    <Link
                      href={`/blog/${rp.slug}`}
                      className="no-underline grid grid-cols-1 sm:grid-cols-2 sm:gap-9 xl:gap-0 xl:grid-cols-1">
                      <Image
                        src={rp.featuredImage}
                        alt={rp.title}
                        width={560}
                        height={280}
                        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="w-full md:h-[140px] object-cover"
                        unoptimized
                      />
                      <div>
                        <h3 className="mt-3 sm:mt-0 xl:mt-3 text-[20px] font-medium text-black line-clamp-1">
                          {rp.title}
                        </h3>
                        <p className="text-charcoal text-sm font-normal mt-1 leading-none">
                          {rp.duration}
                          {rp.duration && <span className="mx-1">•</span>}
                          {format(new Date(rp.date), "MMMM d, yyyy")}
                        </p>
                        {rp.abstract && (
                          <p className="text-charcoal text-sm sm:text-base font-normal line-clamp-4 xl:line-clamp-2 mt-2">
                            {rp.abstract.length > 400
                              ? rp.abstract.slice(0, 400) + "…"
                              : rp.abstract}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

function AuthorBlock({
  author,
  date,
  duration,
}: {
  author: PostAuthor;
  date: string;
  duration?: string;
}) {
  const hasAuthorMeta = [author.title, author.organization].some(Boolean);

  const inner = (
    <>
      {author.image && (
        <Image
          src={author.image}
          alt={author.name ?? ""}
          width={72}
          height={72}
          className="inline-block h-[72px] w-[72px] rounded-full bg-white"
          unoptimized
        />
      )}
      <div className="font-normal">
        <p className="m-0">
          {duration}
          {duration && <span className="mx-1">•</span>}
          {format(new Date(date), "MMMM d, yyyy")}
        </p>
        <p className="m-0">by {author.name}</p>
        {hasAuthorMeta && (
          <p className="m-0">
            {author.title}
            {author.title && author.organization ? ", " : " "}
            {author.organization}
          </p>
        )}
      </div>
    </>
  );

  if (author.link) {
    return (
      <a
        href={author.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sand text-sm gap-x-4 no-underline"
        title={author.name}>
        {inner}
      </a>
    );
  }

  return (
    <span className="inline-flex items-center text-sand text-sm gap-x-4">
      {inner}
    </span>
  );
}
