const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,res)=>{const f=path.join(__dirname,decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/,'/index.html'));
fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;return res.end()}res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'application/octet-stream');res.end(d)})}).listen(8123);
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
const p=await b.newPage({viewport:{width:540,height:960}});
p.on('console',m=>console.log(m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8123/');await p.waitForFunction('window.ready',null,{timeout:30000});
fs.mkdirSync('frames',{recursive:true});const FPS=24,N=FPS*10;
for(let i=0;i<N;i++){await p.evaluate(t=>window.render(t),i/FPS);await p.screenshot({path:`frames/f${String(i).padStart(4,'0')}.png`});}
await b.close();srv.close();})();
