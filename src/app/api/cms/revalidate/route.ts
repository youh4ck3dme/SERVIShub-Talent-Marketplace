import {NextRequest,NextResponse} from 'next/server';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {revalidatePath} from 'next/cache';
export const runtime='nodejs';
export async function POST(req:NextRequest){
  const secret=process.env.WP_WEBHOOK_SECRET;
  if(!secret||secret.length<32)return NextResponse.json({error:'Not configured'},{status:503});
  const raw=await req.text();
  if(raw.length>65536)return NextResponse.json({error:'Payload too large'},{status:413});
  const sig=req.headers.get('x-wp-signature')||'';
  const match=/^sha256=([a-f0-9]{64})$/.exec(sig);
  const expected=createHmac('sha256',secret).update(raw).digest('hex');
  if(!match||!timingSafeEqual(Buffer.from(match[1],'hex'),Buffer.from(expected,'hex')))
    return NextResponse.json({error:'Unauthorized'},{status:401});
  let payload:{slug?:unknown};
  try { payload=JSON.parse(raw); } catch {return NextResponse.json({error:'Invalid JSON'},{status:400});}
  revalidatePath('/blog');
  if(typeof payload.slug==='string'&&/^[a-z0-9-]{1,150}$/.test(payload.slug))revalidatePath('/blog/'+payload.slug);
  return NextResponse.json({revalidated:true});
}
