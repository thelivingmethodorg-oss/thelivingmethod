import { configureSchema } from "cms-renderer/lib/schema";
import type { BlockComponentProps } from "cms-renderer/lib/types";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cmsConfig } from "@/lib/cms-config";
import type { BlogListContent, BlogPost, DocumentRef } from "@/lib/types";

function isRef(item: DocumentRef | BlogPost): item is DocumentRef {
  return typeof item === "object" && item !== null && "_ref" in item;
}

const markdownPlugins = [remarkGfm];
const richTextPlugins = [rehypeRaw, rehypeSanitize];

/** Renders selected headless blog_post records on the blog landing page. */
export default async function BlogList({ content }: BlockComponentProps<BlogListContent>) {
  const entries = content.posts ?? [];
  const ids = entries.filter(isRef).map((post) => post._ref);

  let resolved = new Map<string, BlogPost>();
  if (ids.length > 0) {
    try {
      resolved = await configureSchema({
        cmsUrl: cmsConfig.cmsUrl,
        websiteId: cmsConfig.websiteId,
        apiKey: cmsConfig.apiKey,
      })
        .name("blog_post")
        .fetchByIds<BlogPost>(ids);
    } catch (error) {
      console.error("[BlogList] Failed to resolve blog_post documents:", error);
    }
  }

  const posts = entries
    .map((post) => (isRef(post) ? resolved.get(post._ref) : post))
    .filter((post): post is BlogPost => Boolean(post?.title));

  return (
    <section className="mx-auto max-w-screen-2xl px-8 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-xs font-medium tracking-[3px] text-sage uppercase">{content.kicker}</span>
          <h1 className="heading-serif mt-3 text-5xl tracking-tighter">{content.heading}</h1>
          <p className="mt-4 text-warmgray">{content.subheading}</p>
        </header>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post._id ?? post.slug} className="overflow-hidden rounded-3xl border border-stone/50 bg-white">
                {post.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image_url} alt={post.cover_image_alt ?? ""} className="aspect-[16/10] w-full object-cover" />
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
