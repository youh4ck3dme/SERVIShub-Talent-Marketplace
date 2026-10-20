import { createHmac, timingSafeEqual } from 'node:crypto';

export function unsubscribeSignature(alertId:string):string {
  const secret=process.env.ALERT_UNSUBSCRIBE_SECRET;
  if(!secret || secret.length<32)throw new Error('ALERT_UNSUBSCRIBE_SECRET is missing or weak');
  return createHmac('sha256',secret).update('unsubscribe:'+alertId).digest('hex');
}
export function verifyUnsubscribeSignature(alertId:string,sig:string):boolean {
  if(!/^[a-f0-9]{64}$/.test(sig))return false;
  const expected=unsubscribeSignature(alertId);
  return timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(sig,'hex'));
}
