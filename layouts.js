// The browser preview and PowerPoint export share a 1280 × 720 design surface.
const escapeText = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const measure = document.createElement('canvas').getContext('2d');

function wrapLines(text,width) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      if (line && measure.measureText(line+' '+word).width > width) {
        lines.push(line);
        line = '';
      }
      if (measure.measureText(word).width > width) {
        for (const character of word) {
          if (line && measure.measureText(line+character).width > width) {
            lines.push(line); line = '';
          }
          line += character;
        }
      } else line += (line ? ' ' : '') + word;
    }
    lines.push(line);
  }
  return lines;
}

function contentItems(content) {
  return content.trim().split(/\n\s*\n/).filter(Boolean).flatMap(block => {
    const lines = block.split('\n');
    if (lines[0].startsWith('**') && lines.length>1)
      return [{label:lines[0].replaceAll('**',''),body:lines.slice(1).join('\n')}];
    return lines.map(line => ({label:'',body:line.replace(/^\s*(?:- |\d+\. )/,'').replaceAll('**','')}));
  });
}

function slideScene(s,index) {
  const parts = [];
  const p = Number(s.padding), w = 1280-2*p, bottom = 720-p;
  const shape = (type,x,y,width,height,fill) => parts.push({type,x,y,width,height,fill});
  const rect = (x,y,w,h,c) => shape('rect',x,y,w,h,c);
  const circle = (x,y,d,c) => shape('ellipse',x,y,d,d,c);
  function text(value,x,y,width,height,preferred,bold=false,color=s.ink) {
    if (!value || height <= 0) return;
    let size = preferred*s.scale/100, lines;
    do {
      measure.font = (bold?'bold ':'')+size+'px "'+s.font+'"';
      lines = wrapLines(value,width);
      if (lines.length*size*1.19 <= height || size < 3) break;
      size *= .93;
    } while (true);
    parts.push({type:'text',lines,x,y,width,height,size,bold,color,font:s.font});
  }
  const items = contentItems(s.content);
  const accentInk = parseInt(s.accent.slice(1,3),16)*.299 + parseInt(s.accent.slice(3,5),16)*.587 + parseInt(s.accent.slice(5),16)*.114 > 148 ? '#151515' : '#ffffff';
  text(s.section,p,p,w-130,34,20,true);
  text(String(index).padStart(2,'0')+' / 12',1280-p-100,p,100,30,18);
  rect(p,p+44,w,2,s.ink);
  const top = p+68;
  if (s.layout==='Poster') {
    const artX=1280-p-282, artY=top+36;
    rect(artX,artY,282,350,s.accent);
    circle(artX+18,artY+20,245,s.ink);
    circle(artX+72,artY+74,137,s.accent);
    rect(artX+18,artY+274,246,16,s.ink);
    rect(artX+18,artY+305,160,16,s.ink);
    text(s.title,p,top+14,w-338,220,100,true);
    const details=items.map(v=>[v.label,v.body].filter(Boolean).join('\n')).join('\n');
    rect(p,top+259,60,9,s.accent);
    text(details,p,top+295,w-330,bottom-top-295,36);
    return parts;
  }
  const split = s.layout==='Split';
  const titleWidth = split ? w*.41 : w;
  text(s.title,p,top,titleWidth,split ? 275 : 106,split ? 76 : 67,true);
  const left=split ? p+titleWidth+40 : p;
  const y=split ? top : top+122;
  const innerWidth=1280-p-left, height=bottom-y;
  const count=Math.max(1,items.length);
  if (split) {
    rect(left-22,y,3,height,s.accent);
    circle(p,bottom-74,74,s.accent);
    circle(p+54,bottom-54,53,s.ink);
  }
  const grid=s.layout==='Grid', steps=s.layout==='Steps';
  const columns = grid||steps ? Math.min(3,count) : 1;
  const rows=Math.ceil(count/columns);
  const gap= Math.max(9,p*.23);
  const cw=(innerWidth-gap*(columns-1))/columns, rh=(height-gap*(rows-1))/rows;
  items.forEach((item,j)=>{
    let x=left+(j%columns)*(cw+gap), cy=y+Math.floor(j/columns)*(rh+gap);
    let tw=cw, th=rh, ink=s.ink;
    if(grid) {
      const filled=j%3!==1;
      rect(x,cy,cw,rh,filled?s.accent:s.ink);
      ink=filled?accentInk:s.bg;
      x+=19;cy+=16;tw-=38;th-=27;
    } else if(steps) {
      rect(x,cy,cw,4,s.accent);
      text(String(j+1).padStart(2,'0'),x,cy+10,cw,58,48,true);
      cy+=73;th-=73;
    } else {
      rect(x,cy,split?7:cw,split?rh:2,s.accent);
      x+=split?24:62;tw-=split?24:62;
      if (!split) text(String(j+1).padStart(2,'0'),x-62,cy+12,48,rh-12,22,true);
      cy+=8;th-=8;
    }
    if (item.label) {
      const labelH = Math.min(th*.44,grid?64:43);
      text(item.label,x,cy,tw,labelH,grid?32:28,true,ink);
      cy+=labelH;th-=labelH;
    }
    text(item.body,x,cy,tw,th,split?35:28,false,ink);
  });
  return parts;
}

function slideSvg(slide,index) {
  const parts=slideScene(slide,index).map(part=>{
    const {type,x,y,width,height,fill}=part;
    if(type==='rect') return '<rect rx="'+Math.min(slide.radius,width/2,height/2)+'" x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" fill="'+fill+'"/>';
    if(type==='ellipse') return '<ellipse cx="'+(x+width/2)+'" cy="'+(y+height/2)+'" rx="'+width/2+'" ry="'+height/2+'" fill="'+fill+'"/>';
    return '<g fill="'+part.color+'" font-family="'+part.font+'" font-size="'+part.size+'" font-weight="'+(part.bold?700:400)+'">'+part.lines.map((line,j)=>'<text x="'+x+'" y="'+(y+part.size*(.9+j*1.19))+'">'+escapeText(line)+'</text>').join('')+'</g>';
  });
  return '<svg role="img" aria-label="'+escapeText(slide.title)+'" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"><rect width="1280" height="720" fill="'+slide.bg+'"/>'+parts.join('')+'</svg>';
}
