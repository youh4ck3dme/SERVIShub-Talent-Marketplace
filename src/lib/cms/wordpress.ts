/**
 * WordPress WPGraphQL is a read-only editorial source.
 * Never store auth, applications or payments in WP postmeta.
 */
type GraphQLResponse<T> = { data?: T; errors?: {message:string}[] };
export type CmsPost = {id:string;slug:string;title:string;excerpt:string|null;content:string|null;date:string|null;modified:string|null};

const POSTS_QUERY = 'query LatestPosts { posts(first: 20, where: { status: PUBLISH }) { nodes { id slug title excerpt content date modified } } }';
const POST_QUERY = 'query ArticleBySlug($slug: ID!) { post(id: $slug, idType: SLUG) { id slug title excerpt content date modified } }';

async function wpGraphQL<T>(query:string,variables?:Record<string,unknown>):Promise<T|null> {
  const endpoint=process.env.WP_GRAPHQL_ENDPOINT;
  if(!endpoint)return null;
  let url:URL;
  try { url=new URL(endpoint); } catch { throw new Error('Invalid WP_GRAPHQL_ENDPOINT URL'); }
  if(url.protocol!=='https:'&&process.env.NODE_ENV==='production')throw new Error('Production WP endpoint must use HTTPS');
  if(!['https:','http:'].includes(url.protocol))throw new Error('Unsupported WP endpoint protocol');
  const response=await fetch(url,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({query,variables}),
    signal:AbortSignal.timeout(5000),
    next:{revalidate:300},
  });
  if(!response.ok)throw new Error('WPGraphQL HTTP '+response.status);
  const data=(await response.json()) as GraphQLResponse<T>;
  if(data.errors?.length||!data.data)throw new Error('WPGraphQL returned errors');
  return data.data;
}
export async function listCmsPosts():Promise<{posts:CmsPost[];available:boolean}>{
  try {
    const data=await wpGraphQL<{posts:{nodes:CmsPost[]}}>(POSTS_QUERY);
    return {posts:data?.posts.nodes||[],available:Boolean(data)};
  } catch(error) {
    console.error('[cms] list failed',error);
    return {posts:[],available:false};
  }
}
export async function getCmsPost(slug:string):Promise<{post:CmsPost|null;available:boolean}>{
  if(!/^[a-z0-9-]{1,150}$/.test(slug))return {post:null,available:true};
  try {
    const data=await wpGraphQL<{post:CmsPost|null}>(POST_QUERY,{slug});
    return {post:data?.post||null,available:Boolean(data)};
  } catch(error) {
    console.error('[cms] detail failed',error);
    return {post:null,available:false};
  }
}
/**
 * Editorial content is untrusted. Return it verbatim and let React escape the
 * text node; do not parse HTML with regexes or decode entities by hand.
 *
 * This intentionally renders WP markup literally until we adopt a vetted,
 * explicit HTML-to-text parser. NEVER pass the result to dangerouslySetInnerHTML.
 */
export function htmlToPlainText(input: string | null | undefined): string {
  return input ?? '';
}
