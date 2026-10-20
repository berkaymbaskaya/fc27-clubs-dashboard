const allowedPlayers=new Set(['ElectKnightFghtr','burak_kvkl','Emirhanekizce','berkaymbaskaya','shock_exi','sabenkerem7878','efeebaskaya','UtkuSngll','ugurcangul']);
const memory=new Map();
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8',...extra}});
export async function handleFcclub(request){
 const url=new URL(request.url),resource=url.pathname.split('/').filter(Boolean).pop();
 const name=url.searchParams.get('player')||'ElectKnightFghtr';
 if(!['profile','matches','club'].includes(resource)||!allowedPlayers.has(name))return json({error:'Geçersiz veri isteği.'},400);
 const key=resource+':'+(resource==='club'?'1546086':name),now=Date.now(),cached=memory.get(key);
 if(cached&&cached.expires>now)return json(cached.value,200,{'Cache-Control':'public, max-age=300'});
 const path=resource==='club'?'clubs/1546086':`players/1546086/${encodeURIComponent(name)}${resource==='matches'?'/matches?limit=50':''}`;
 try{
  const response=await fetch('https://fcclub.gg/api/'+path,{headers:{'Accept':'application/json','User-Agent':'LavuksFK-Dashboard/1.0'},signal:AbortSignal.timeout(12000)});
  if(!response.ok)return json({error:response.status===429?'Veri sağlayıcı kısa süreli istek sınırına ulaştı.':'Veri sağlayıcı şu anda yanıt veremiyor.'},503,{'Retry-After':'60'});
  const data=await response.json();
  if(resource==='profile'&&(data.name!==name||Number(data.clubId)!==1546086))throw Error('Unexpected profile');
  if(resource==='matches'&&!Array.isArray(data.results))throw Error('Unexpected matches');
  if(resource==='club'&&Number(data.club?.clubId)!==1546086)throw Error('Unexpected club');
  const value={source:'FCClub.gg',fetchedAt:new Date().toISOString(),data};
  memory.set(key,{expires:now+300000,value});
  return json(value,200,{'Cache-Control':'public, max-age=300'});
 }catch{return json({error:'FCClub verisi şu anda alınamıyor. Son kaydedilen veri kullanılabilir.'},503,{'Retry-After':'60'});}
}
