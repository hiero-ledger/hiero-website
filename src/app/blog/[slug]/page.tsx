import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { format } from "date-fns";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.abstract };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const recentPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div className="mx-auto flex">
      <article className="w-full break-words">
        {/* Hero */}
        <div
          id="hero"
          className="bg-gradient-to-br from-red-dark via-red to-red relative"
        >
          <div className="container pt-14 pb-12 sm:py-[100px] text-white">
            <h1 className="font-medium text-xl sm:text-2xl leading-none relative mb-6 sm:mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-6">
              {post.authors.map((author, i) => (
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
            <div
              className="content text-sm text-charcoal font-normal sm:text-base"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
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
                {recentPosts.map((rp) => (
                  <li key={rp.slug}>
                    <Link
                      href={`/blog/${rp.slug}`}
                      className="no-underline grid grid-cols-1 sm:grid-cols-2 sm:gap-9 xl:gap-0 xl:grid-cols-1"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rp.featuredImage}
                        alt={rp.title}
                        className="w-full h-[140px] object-cover"
                        loading="lazy"
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
  author: {
    name?: string;
    title?: string;
    organization?: string;
    link?: string;
    image?: string;
  };
  date: string;
  duration?: string;
}) {
  const inner = (
    <>
      {author.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.image}
          alt={author.name ?? ""}
          className="inline-block h-[72px] w-[72px] rounded-full bg-white"
          loading="lazy"
        />
      )}
      <div className="font-normal">
        <p className="m-0">
          {duration}
          {duration && <span className="mx-1">•</span>}
          {format(new Date(date), "MMMM d, yyyy")}
        </p>
        <p className="m-0">by {author.name}</p>
        {(author.title || author.organization) && (
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
        title={author.name}
      >
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
