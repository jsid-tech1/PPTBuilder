const slides = [
  {
    "section": "HERO SECTION",
    "title": "AI-Powered Design System Builder",
    "question": "What are we presenting today?",
    "blocks": [
      "Build your design system, based on your idea."
    ]
  },
  {
    "section": "PROJECT OVERVIEW",
    "title": "What is the project?",
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
const clean = text => text.replace(/\*\*/g,'');
const palettes = [['#e5ff9d','#12180c','#ffe78b'],['#dfd5ff','#1c152a','#fcf1bd'],['#18191b','#fff','#fff489'],['#fff691','#19190a','#f3bef0'],['#eff0ed','#1f2021','#ffbb81']];
const esc = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function card(s,i){
 const [bg,fg,tile]=palettes[i%palettes.length];
 const cover=[0,1,12].includes(i);
 const tiles=[];
 const body=[];
 for(const block of s.blocks){
   const lines=block.split('\n');
   if(lines[0].startsWith('**') && lines.length>1){
     tiles.push('<div class="tile"><strong>'+esc(clean(lines[0]))+'</strong><p>'+esc(lines.slice(1).join(' '))+'</p></div>');
   }else if(/^(- |1\. )/.test(block)){
     const tag=block.startsWith('-')?'ul':'ol';
     body.push('<'+tag+'>'+lines.map(line=>'<li>'+esc(line.replace(/^(- |\d+\. )/,''))+'</li>').join('')+'</'+tag+'>');
   }else body.push('<p>'+esc(clean(block))+'</p>');
 }
 if(tiles.length) body.push('<div class="tiles">'+tiles.join('')+'</div>');
 return '<article data-page="'+i+'" class="slide '+(cover?'cover':'')+'" style="--bg:'+bg+';--fg:'+fg+';--tile:'+tile+'"><div class="folio"><span>'+esc(s.section)+'</span><span>'+String(i).padStart(2,'0')+' / 12</span></div><h2>'+esc(i === 1 ? 'Project Overview' : s.title)+'</h2><div class="copy">'+body.join('')+'</div>'+(cover?'<div class="shapes" aria-hidden="true"><i></i><i></i><i></i></div>':'')+'</article>';
}
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
  message.focus({preventScroll:true});
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
  story.innerHTML = '<p class="user">Start</p><div class="speaker"><b>✳</b> Forma</div><p>Type <strong>Project</strong> to see the project overview.</p>';
  message.focus();
};
$('suggest').onclick = () => {
  $('command').value = 'Start';
  $('start').requestSubmit();
};
