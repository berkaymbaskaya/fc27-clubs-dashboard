import dashboard from "../dashboard.html?raw";
export async function GET(){return new Response(dashboard,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"public, max-age=60"}})}
