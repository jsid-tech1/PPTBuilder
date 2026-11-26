const $ = id => document.getElementById(id);
const questions = [
 'What is the project?', 'What problem are we solving?', 'How does the builder work?',
 'What are its key features?', 'What does it generate?', 'Which technologies power it?',
 'Can we see the product?', 'What challenges did we face?', 'How did we solve them?',
 'What is the project outline?', 'How is the project introduced?', 'What problem are we solving?',
 'What makes the tool useful?', 'What else is in the feature overview?', 'What does the tool generate?',
 'How does it work behind the scenes?', 'How does an idea become a design system?',
 'Can we walk through the screens?', 'What were the major issues?', 'How did we find the right approach?'
];
const story = $('story');
const composer = $('composer');
const message = $('message');
let index = 0;
let busy = false;
let typing;

function prepareQuestion() {
  const question = questions[index];
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

  const turn = document.createElement('section');
  turn.className = 'turn';
  turn.innerHTML = '<p class="user">' + (i === 0 ? 'Project' : questions[i]) +
    '</p><div class="speaker"><b>✳</b> Forma <span class="pending" role="status">Preparing slide <i></i><i></i><i></i></span></div>';
  story.append(turn);
  turn.scrollIntoView({block:'start'});
  setTimeout(() => {
    turn.querySelector('.pending').remove();
    turn.append(buildSlide(i));
    turn.lastElementChild.classList.add('reveal');
    turn.scrollIntoView({block:'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    busy = false;
    composer.querySelector('button').disabled = false;
    if (index < questions.length) {
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
  if (index === 0 && message.value.trim().toLowerCase() !== 'project') {
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
  story.innerHTML = '<p class="user">Start</p><div class="speaker"><b>✳</b> Forma</div><p class="hero-tip">Type <strong>Project</strong> to open the first slide.</p>';
  message.focus();
};
$('suggest').onclick = () => {
  $('command').value = 'Start';
  $('start').requestSubmit();
};

