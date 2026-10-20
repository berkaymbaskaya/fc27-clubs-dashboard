import { handleFcclub } from '../../../../lib/fcclub.js';
export const dynamic='force-dynamic';
export async function GET(request: Request){ return handleFcclub(request); }
