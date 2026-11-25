const slides = [
  {
    "section": "3 TPD · Semester 5",
    "title": "AI Power Design System",
    "question": "What are we presenting today?",
    "blocks": [
      "**Participants**\nPunch · Adite · Shivangi · Upasna · Lev"
    ]
  },
  {
    "section": "PROJECT OVERVIEW",
    "title": "Project Overview",
    "question": "What is the project?",
    "blocks": [
      "Turn a project idea and a colour palette into a design system in seconds.",
      "Preview the result, share it with other designers, or import it into Figma."
    ]
  },
  {
    "section": "THE PROBLEM",
    "title": "The cost of starting from scratch",
    "question": "What problem are we solving?",
    "blocks": [
      "- Finding a system that fits the idea takes time.\n- Complex libraries overwhelm beginners.\n- Starting from scratch means repeating the same setup.",
      "Our goal is to give designers a simpler starting point."
    ]
  },
  {
    "section": "THE SOLUTION",
    "title": "From brief to first preview",
    "question": "How do we solve it?",
    "blocks": [
      "1. Describe your project.\n2. Choose a colour palette.\n3. Let AI extract the keywords.\n4. Generate your design system.\n5. Preview it and import it into Figma."
    ]
  },
  {
    "section": "KEY FEATURES",
    "title": "Five ways to use the builder",
    "question": "What makes our tool useful?",
    "blocks": [
      "**Quick generation**\nBuild a starter system from a short brief.",
      "**Save & publish**\nKeep a system for your next project.",
      "**Community**\nShare your work and explore other systems.",
      "**Live preview**\nCompare mobile, tablet, and desktop layouts.",
      "**Figma import**\nBring the system into your design file."
    ]
  },
  {
    "section": "DESIGN SYSTEM STRUCTURE",
    "title": "Inside a design system",
    "question": "What does the tool generate?",
    "blocks": [
      "- Variables store colours and design values as JSON.\n- States and frames show how the interface behaves.\n- Shared styles and components give screens a consistent look.",
      "Check the system in a responsive preview before sharing it with the community."
    ]
  },
  {
    "section": "TECHNICAL MECHANICS",
    "title": "The technology behind the tool",
    "question": "How does it work behind the scenes?",
    "blocks": [
      "**JavaScript**\nConnects the interface and generation logic.",
      "**Sarvam AI**\nInterprets keywords from the brief.",
      "**Variable JSON**\nEncodes the generated design values.",
      "**Real-time database**\nMakes published systems visible to the community."
    ]
  },
  {
    "section": "HOW THE SYSTEM WORKS",
    "title": "How an idea becomes a system",
    "question": "How does an idea become a design system?",
    "blocks": [
      "1. Describe the idea.\n2. Extract its keywords.\n3. Process them with Sarvam AI.\n4. Generate structured JSON.\n5. Turn values into design variables.\n6. Preview, save, publish, or import."
    ]
  },
  {
    "section": "SCREEN WALKTHROUGH",
    "title": "A tour of the product",
    "question": "Can you walk me through the product?",
    "blocks": [
      "**Home**\nMeet the builder.",
      "**Create**\nEnter an idea and palette.",
      "**Generated system**\nInspect variables, styles, and states.",
      "**Preview**\nCompare screen sizes.",
      "**Community**\nExplore published systems.",
      "**Save & import**\nKeep your work or open it in Figma."
    ]
  },
  {
    "section": "CHALLENGES WE FACED",
    "title": "Four engineering challenges",
    "question": "What were the major issues?",
    "blocks": [
      "**Generation logic**\nBalance response time with cost.",
      "**Serverless functions**\nCoordinate server-side work on Vercel.",
      "**Storage**\nDecide how to persist each generated system.",
      "**Publishing**\nReliably save private work and share published designs."
    ]
  },
  {
    "section": "HOW WE SOLVED THEM",
    "title": "What we changed",
    "question": "How did we solve those challenges?",
    "blocks": [
      "**Simpler logic**\nStreamlined generation to reduce time and cost.",
      "**Vercel functions**\nHandled server-side tasks without a dedicated server.",
      "**Storage**\nOrganised how generated systems are saved.",
      "**Live publishing**\nUsed a real-time database for community updates.",
      "**Save & publish**\nSimplified how designers manage their work."
    ]
  },
  {
    "section": "FINAL OUTCOME",
    "title": "A reusable system in one workflow",
    "question": "What did we achieve?",
    "blocks": [
      "- Turn an idea into reusable design variables.\n- Preview the system across screen sizes.\n- Save and publish it for the community.\n- Bring the result into Figma."
    ]
  },
  {
    "section": "THANK YOU",
    "title": "Thank You!",
    "question": "What would you like to leave us with?",
    "blocks": [
      "Making design systems simple, one idea at a time."
    ]
  }
];
const $ = id => document.getElementById(id);
const layouts = ['Poster', 'Split', 'Grid', 'Stripes', 'Steps'];
const defaults = ['Poster','Split','Stripes','Steps','Grid','Split','Grid','Steps','Grid','Stripes','Grid','Stripes','Poster'];
const themes = [
  ['#ece9ff','#201a30','#ab90ff'], ['#20372f','#ffffff','#a6ecc3'],
  ['#fff2ce','#341d12','#ff965f'], ['#191a21','#ffffff','#ded3ff'],
  ['#e1efff','#172c45','#83c2ff']
];
const fonts = ['Arial','Georgia','Verdana','Courier New'];
const storageKey = 'forma-slide-edits-v1';
let edits = {};
try { edits = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
const deck = slides.map((slide,i) => {
  const [bg,ink,accent] = themes[i % themes.length];
  return {...slide,content:slide.blocks.join('\n\n'),layout:defaults[i],bg,ink,accent,font:'Arial',scale:100,padding:56,...edits[i]};
});
function card(_,i) {
  const s = deck[i];
  return '<article class="canvas-slide" data-page="'+i+'" tabindex="0" role="button" aria-label="Edit slide '+(i+1)+': '+escapeText(s.title)+'">'+slideSvg(s,i)+'</article>';
}
const esc = escapeText;
const story = $('story');
const composer = $('composer');
const message = $('message');
let index = 1;
let busy = false;
let typing;

function prepareQuestion() {
  const question = slides[index].question;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  message.readOnly = true;
  message.value = reduced ? question : '';
  $('hint').textContent = 'Press Enter to reveal the next slide';
  if (!reduced) {
    let count = 0;
    typing = setInterval(() => {
      message.value = question.slice(0, ++count);
      if (count >= question.length) clearInterval(typing);
    }, 24);
  }
  if (activeSlide === null) message.focus({preventScroll:true});
}

function reveal() {
  clearInterval(typing);
  busy = true;
  composer.querySelector('button').disabled = true;
  message.value = '';
  message.readOnly = true;
  message.placeholder = 'Preparing slide…';
  $('hint').textContent = '';
  const i = index++;
  const slide = slides[i];
  const turn = document.createElement('section');
  turn.className = 'turn';
  turn.innerHTML = '<p class="user">' + esc(i === 1 ? 'Project' : slide.question) +
    '</p><div class="speaker"><b>✳</b> Forma <span class="pending" role="status">Preparing slide <i></i><i></i><i></i></span></div>';
  story.append(turn);
  turn.scrollIntoView({block:'start'});
  setTimeout(() => {
    turn.querySelector('.pending').remove();
    turn.insertAdjacentHTML('beforeend',card(slide,i));
    turn.lastElementChild.classList.add('reveal');
    turn.scrollIntoView({block:'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    busy = false;
    composer.querySelector('button').disabled = false;
    if (index < slides.length) {
      prepareQuestion();
    } else {
      composer.hidden = true;
      $('hint').innerHTML = '<a href="./">Back to start</a>';
    }
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 2000);
}

composer.onsubmit = event => {
  event.preventDefault();
  if (busy) return;
  if (index === 1 && message.value.trim().toLowerCase() !== 'project') {
    $('hint').textContent = 'Enter Project to open the overview.';
    return;
  }
  reveal();
};

$('start').onsubmit = event => {
  event.preventDefault();
  if (!['start','start project'].includes($('command').value.trim().toLowerCase())) {
    $('notice').textContent = 'Enter Start to open the chat.';
    return;
  }
  $('landing').hidden = true;
  $('chat').hidden = false;
  story.innerHTML = '<p class="user">Start</p><div class="speaker"><b>✳</b> Forma</div>' + card(slides[0],0) + '<p class="hero-tip">Click a slide to edit it. Type <strong>Project</strong> to continue.</p>';
  message.focus();
};
$('suggest').onclick = () => {
  $('command').value = 'Start';
  $('start').requestSubmit();
};

let activeSlide = null;
const panel = $('inspector');
const fields = ['section','title','content','bg','ink','accent','font','scale','padding'];

function updateLayoutButtons() {
  for (const button of $('layouts').children)
    button.setAttribute('aria-pressed',button.dataset.layout === deck[activeSlide].layout);
}

function editSlide(index) {
  activeSlide=index;
  document.querySelector('.canvas-slide.selected')?.classList.remove('selected');
  story.querySelector('[data-page="'+index+'"]').classList.add('selected');
  $('selection').textContent='Slide '+(index+1)+' of '+deck.length;
  fields.forEach(key=>{ $(key).value=deck[index][key]; });
  updateLayoutButtons();
  panel.hidden=false;
  document.body.classList.add('editing');
  $('save-state').textContent='Changes save on this device.';
  $('close-panel').focus({preventScroll:true});
}

function closePanel() {
  const article=story.querySelector('[data-page="'+activeSlide+'"]');
  article?.classList.remove('selected');
  panel.hidden=true;
  activeSlide=null;
  document.body.classList.remove('editing');
  if (composer.hidden) article?.focus({preventScroll:true});
  else message.focus({preventScroll:true});
}

function changeProperty(key,value) {
  if (activeSlide === null) return;
  deck[activeSlide][key]=value;
  edits[activeSlide]={...edits[activeSlide],[key]:value};
  const article=story.querySelector('[data-page="'+activeSlide+'"]');
  article.innerHTML=slideSvg(deck[activeSlide],activeSlide);
  article.setAttribute('aria-label','Edit slide '+(activeSlide+1)+': '+deck[activeSlide].title);
  try {
    localStorage.setItem(storageKey,JSON.stringify(edits));
    $('save-state').textContent='Saved on this device';
  } catch { $('save-state').textContent='Changes are in memory. Export to keep them.'; }
}

for (const layout of layouts) {
  const button=document.createElement('button');
  button.dataset.layout=layout;
  button.innerHTML='<span class="layout-icon" aria-hidden="true"><i></i><i></i><i></i></span>'+layout;
  button.onclick=()=>{ changeProperty('layout',layout); updateLayoutButtons(); };
  $('layouts').append(button);
}
fields.forEach(key=>{
  $(key).addEventListener('input',event=>changeProperty(key,event.target.type==='range' ? event.target.valueAsNumber : event.target.value));
});
story.addEventListener('click',event=>{
  const article=event.target.closest('.canvas-slide');
  if (article) editSlide(Number(article.dataset.page));
});
story.addEventListener('keydown',event=>{
  if (event.target.matches('.canvas-slide') && ['Enter',' '].includes(event.key)) {
    event.preventDefault();
    editSlide(Number(event.target.dataset.page));
  }
});
$('close-panel').onclick=closePanel;
document.addEventListener('keydown',event=>{ if (event.key==='Escape' && activeSlide!==null) closePanel(); });

let exportLibrary;
function loadExportLibrary() {
  if (!exportLibrary) exportLibrary=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='./vendor/pptxgen.bundle.js';
    script.onload=resolve;
    script.onerror=()=>{exportLibrary=null;script.remove();reject(new Error('Unable to load PowerPoint export'));};
    document.head.append(script);
  });
  return exportLibrary;
}

async function makePresentation() {
  await loadExportLibrary();
  const ppt=new PptxGenJS();
  ppt.layout='LAYOUT_WIDE';
  ppt.title=deck[0].title;
  deck.forEach((model,index)=>{
    const slide=ppt.addSlide();
    slide.background={color:model.bg.slice(1)};
    for (const part of slideScene(model,index)) {
      const bounds={x:part.x/96,y:part.y/96,w:part.width/96,h:part.height/96};
      if (part.type==='text') {
        part.lines.forEach((line,j)=>{
          if (!line) return;
          slide.addText(line,{...bounds,y:(part.y+j*part.size*1.19)/96,h:part.size*1.19/96,
            fontFace:part.font,fontSize:part.size*.75,color:part.color.slice(1),bold:part.bold,
            wrap:false,margin:0,valign:'mid',paraSpaceAfter:0,paraSpaceBefore:0});
        });
      } else {
        slide.addShape(ppt.ShapeType[part.type],{...bounds,line:{transparency:100},fill:{color:part.fill.slice(1)}});
      }
    }
    slide.addNotes(model.content);
  });
  return ppt;
}

$('export').onclick=async event=>{
  event.preventDefault();
  const link=$('export');
  if (link.getAttribute('aria-busy')==='true') return;
  link.setAttribute('aria-busy','true');
  link.textContent='Exporting…';
  try {
    const ppt=await makePresentation();
    await ppt.writeFile({fileName:(deck[0].title.trim()||'Design System')+'.pptx'});
    link.textContent='Export PPTX';
  } catch {
    link.textContent='Retry export';
  } finally { link.removeAttribute('aria-busy'); }
};
