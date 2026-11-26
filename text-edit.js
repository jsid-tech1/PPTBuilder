const liveWebsite='https://dsgen-4gtm.vercel.app/';
const textKey='forma-pdf-text-v1';
let changes={};
try { changes=JSON.parse(localStorage.getItem(textKey))||{}; } catch {}
let selection;
const editor=document.getElementById('edit-text');
const replacement=document.getElementById('replacement');
const srcFor=i=>'./slides/page-'+String(i+1).padStart(2,'0')+'.png';
const cache=new Map();
function loaded(src){
  if(!cache.has(src)) cache.set(src,new Promise((resolve,reject)=>{
    const img=new Image(); img.onload=()=>resolve(img);img.onerror=()=>{cache.delete(src);reject(Error('Could not load slide image'));};img.src=src;
  }));
  return cache.get(src);
}
async function drawPage(canvas,i){
  const original=await loaded(srcFor(i));
  const entries=textPages[i];
  const edited=entries.map((e,j)=>({e,value:changes[i+'-'+j]})).filter(item=>typeof item.value==='string');
  await Promise.all(edited.map(({e})=>loaded(e.patch)));
  if(edited.length) await Promise.all([400,700].map(weight=>document.fonts.load(weight+' 24px "DM Sans"')));
  canvas.width=original.naturalWidth;canvas.height=original.naturalHeight;
  const ctx=canvas.getContext('2d');
  ctx.scale(canvas.width/1440,canvas.height/810);
  ctx.drawImage(original,0,0,1440,810);
  for(const {e} of edited)ctx.drawImage(await loaded(e.patch),...e.box);
  for(const {e,value} of edited){
    ctx.font=(e.bold?'700 ':'400 ')+e.size+'px "DM Sans"';ctx.fillStyle=e.color;
    ctx.fillText(value,e.x,e.y,e.w);
  }
}
function position(el,x,y,w,h){
  Object.assign(el.style,{left:x/14.4+'%',top:y/8.1+'%',width:w/14.4+'%',height:h/8.1+'%'});
}
function siteLink(parent,x,y,w,h){
  const a=document.createElement('a');a.href=liveWebsite;a.target='_blank';a.rel='noopener noreferrer';
  a.className='slide-hit website';a.title='Open live website';a.setAttribute('aria-label','Play website');position(a,x,y,w,h);parent.append(a);
}
function buildSlide(i){
  const page=document.createElement('article');page.className='pdf-page';page.dataset.page=i;
  const canvas=document.createElement('canvas');canvas.className='pdf-slide';canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Presentation page '+(i+1));page.append(canvas);drawPage(canvas,i);
  if(i===6)siteLink(page,720,90,700,650);
  textPages[i].forEach((e,j)=>{
    const play=i===6 && /^play website$/i.test(e.t);
    if(play)siteLink(page,e.x-15,e.y-e.size,e.w+30,e.size*1.45);
    const btn=document.createElement('button');btn.type='button';btn.className='slide-hit'+(play?' edit-link':'');
    if(play)btn.textContent='✎';
    btn.title='Edit text';btn.setAttribute('aria-label','Edit '+(changes[i+'-'+j]??e.t));
    if(play)position(btn,e.x+e.w+22,e.y-e.size,49,49);
    else position(btn,e.x,e.y-e.size*.83,e.w,e.size*1.06);
    btn.onclick=()=>{selection={i,j,e,btn,canvas};replacement.value=changes[i+'-'+j]??e.t;editor.returnValue='cancel';editor.showModal();replacement.select();};
    page.append(btn);
  });
  return page;
}
editor.addEventListener('close',async()=>{
  if(editor.returnValue!=='save'||!selection)return;
  const {i,j,e,btn,canvas}=selection,key=i+'-'+j;
  if(replacement.value===e.t)delete changes[key];else changes[key]=replacement.value;
  try{localStorage.setItem(textKey,JSON.stringify(changes));}catch{}
  btn.setAttribute('aria-label','Edit '+replacement.value);await drawPage(canvas,i);
});
let library;
async function exportPages(){
  if(!library)library=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./vendor/pptxgen.bundle.js';script.onload=resolve;script.onerror=()=>{library=null;reject(Error('Export library unavailable'));};document.head.append(script);});
  await library;
  const deck=new PptxGenJS();deck.layout='LAYOUT_WIDE';
  for(let i=0;i<textPages.length;i++){
    const canvas=document.createElement('canvas');await drawPage(canvas,i);
    const slide=deck.addSlide();slide.addImage({data:canvas.toDataURL(),x:0,y:0,w:13.33333,h:7.5});
    if(i===6){
      for(const [x,y,w,h] of [[720,90,700,650],[200,390,310,100]])
        slide.addShape(deck.ShapeType.rect,{x:x/108,y:y/108,w:w/108,h:h/108,line:{transparency:100},fill:{color:'FFFFFF',transparency:99},hyperlink:{url:liveWebsite}});
    }
  }
  await deck.writeFile({fileName:'Design System Builder.pptx'});
}
const exportButton=document.getElementById('export');
exportButton.onclick=async event=>{
  event.preventDefault();if(exportButton.dataset.busy)return;
  exportButton.dataset.busy='1';exportButton.textContent='Exporting…';
  try{await exportPages();exportButton.textContent='Export PPTX';}
  catch{exportButton.textContent='Retry export';}
  finally{delete exportButton.dataset.busy;}
};
