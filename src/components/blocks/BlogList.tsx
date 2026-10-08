import type { BlockComponentProps } from "cms-renderer";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type BlogListContent, type BlogPost, imageSrc } from "@/lib/types";

const markdownPlugins = [remarkGfm];
const richTextPlugins = [rehypeRaw, rehypeSanitize];

/** Renders the selected blog_post documents, filled in by the page read. */
export default function BlogList({ content }: BlockComponentProps<BlogListContent>) {
  const posts = (content.posts ?? []).filter((post): post is BlogPost => Boolean(post?.title));

  return (
    <section className="mx-auto max-w-screen-2xl px-8 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-medium tracking-[3px] text-sage uppercase">{content.kicker}</span>
          <h1 className="heading-serif mt-3 text-5xl tracking-tighter">{content.heading}</h1>
          <div className="prose prose-sm mx-auto mt-6 max-w-2xl text-left text-warmgray">
            <ReactMarkdown remarkPlugins={markdownPlugins} rehypePlugins={richTextPlugins}>
              {content.subheading}
            </ReactMarkdown>
          </div>
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post._id ?? post.slug} className="overflow-hidden rounded-3xl border border-stone/50 bg-white">
                {imageSrc(post.cover_image) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageSrc(post.cover_image)} alt={post.cover_image?.alt ?? ""} className="aspect-[16/10] w-full object-cover" />
                )}
                <div className="p-6">
                  <div className="mb-3 flex gap-3 text-xs tracking-wide text-sage uppercase">
                    {post.category && <span>{post.category}</span>}
                    <span>{post.published_date}</span>
                  </div>
                  <h2 className="heading-serif text-3xl tracking-tight">{post.title}</h2>
                  <div className="prose prose-sm mt-3 max-w-none text-warmgray">
                    <ReactMarkdown remarkPlugins={markdownPlugins} rehypePlugins={richTextPlugins}>{post.excerpt}</ReactMarkdown>
                  </div>
                  <details className="group mt-5 border-t border-stone/40 pt-4">
                    <summary className="cursor-pointer text-xs font-medium tracking-[1.5px] text-sage uppercase">
                      Read article
                    </summary>
                    <div className="prose prose-sm mt-4 max-w-none text-warmgray">
                      <ReactMarkdown remarkPlugins={markdownPlugins} rehypePlugins={richTextPlugins}>{post.body}</ReactMarkdown>
                    </div>
                  </details>
                  <p className="mt-5 text-xs text-stone">By {post.author}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-warmgray">New journal entries will appear here soon.</p>
        )}
      </div>
    </section>
  );
}
