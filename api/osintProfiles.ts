import type { VercelRequest, VercelResponse } from "@vercel/node";
import { flagFor } from "../lib/flags.js";
import { checkAnswers, platforms, questions } from "../lib/socialProfiles.js";

const FLAG = flagFor("hands-on-practice/paper-trail");

/** Keeps the inlined data from closing the script tag early. */
const encode = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  /* JetBrains Mono ligates == != -> </ /> into single glyphs, which makes
     typed payloads and quoted syntax unreadable. Never wanted here. */
  * { font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0; }

  body {
    background: #09090F;
    color: #DDD;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px;
    line-height: 1.55;
    padding: 2rem 1rem 4rem;
  }

  .wrap { max-width: 1180px; margin: 0 auto; }

  /* Profiles on the left, recovery questions parked on the right so you can
     read one while filling in the other. Stacks on narrow screens. */
  .columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 1.5rem;
    align-items: start;
    margin-top: 1.5rem;
  }

  @media (max-width: 940px) {
    .columns { grid-template-columns: minmax(0, 1fr); }
  }

  .label { font-size: 0.7rem; letter-spacing: 0.3em; color: #555; text-transform: uppercase; }
  h1 { font-size: 1.35rem; color: #A855F7; margin: 0.4rem 0 0.5rem; }
  .brief { color: #777; max-width: 62ch; }

  .tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; }

  .tabs button {
    background: #101019;
    border: 1px solid #1E1E3A;
    border-bottom: none;
    color: #888;
    font: inherit;
    padding: 0.45rem 0.9rem;
    cursor: pointer;
  }

  .tabs button:hover { color: #DDD; }
  .tabs button.active { color: #0B0B12; font-weight: 700; }

  .browser { border: 1px solid #1E1E3A; background: #0B0B12; }

  .bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.9rem;
    background: #101019;
    border-bottom: 1px solid #1E1E3A;
  }

  .dots { display: flex; gap: 0.3rem; }
  .dots i { width: 9px; height: 9px; border-radius: 50%; background: #2A2A40; display: block; }

  .url {
    flex: 1;
    background: #06060B;
    border: 1px solid #1E1E3A;
    padding: 0.25rem 0.6rem;
    color: #7A7A95;
    font-size: 0.72rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .site-head { padding: 1.2rem 1.2rem 1rem; border-bottom: 1px solid #16162A; }
  .site-name { font-size: 1.05rem; font-weight: 700; }
  .site-tagline { font-size: 0.68rem; color: #555; letter-spacing: 0.12em; text-transform: uppercase; }

  .who { display: flex; align-items: center; gap: 0.9rem; margin-top: 1rem; }
  .avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
  .who .name { font-weight: 700; color: #EEE; }
  .who .handle { color: #666; font-size: 0.75rem; }
  .who .bio { color: #999; margin-top: 0.2rem; }
  .who .stats { color: #555; font-size: 0.72rem; }

  .section { padding: 1rem 1.2rem; border-bottom: 1px solid #16162A; }
  .section:last-child { border-bottom: none; }

  .heading {
    font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: #666; margin-bottom: 0.8rem;
  }

  .item { padding: 0.7rem 0; border-bottom: 1px solid #121220; }
  .item:last-child { border-bottom: none; }
  .item .t { font-weight: 700; color: #EEE; }
  .item .s { font-size: 0.8rem; }
  .item .m { color: #555; font-size: 0.72rem; }
  .item .b { color: #C5C5D5; margin-top: 0.15rem; }

  .chip {
    display: inline-block; margin-top: 0.35rem; padding: 0.1rem 0.5rem;
    border: 1px solid #23233C; border-radius: 999px;
    font-size: 0.7rem; color: #8A8AA5;
  }

  .feed .b { font-size: 0.95rem; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.8rem; }
  .grid .item { border: 1px solid #1A1A2C; border-bottom: 1px solid #1A1A2C; padding: 0; }
  .photo { aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
           color: rgba(255,255,255,0.25); font-size: 1.6rem; }
  .grid .caption { padding: 0.5rem 0.6rem 0.7rem; }

  .code .t { font-family: inherit; }
  .code .s { color: #8A8AA5; }

  form {
    border: 1px solid #1E1E3A;
    padding: 1.2rem;
    background: #0C0C14;
    position: sticky;
    top: 1.5rem;
  }

  @media (max-width: 940px) { form { position: static; } }
  form h2 { font-size: 0.95rem; color: #A855F7; margin-bottom: 0.3rem; }
  form .note { color: #666; font-size: 0.75rem; margin-bottom: 1.1rem; }

  .q { margin-bottom: 0.9rem; }
  .q label { display: block; color: #AAA; margin-bottom: 0.3rem; }

  .q input {
    width: 100%; background: #14141F; border: 1px solid #262640;
    color: #EEE; font: inherit; padding: 0.55rem 0.7rem;
  }

  .q input:focus { outline: none; border-color: #A855F7; }
  .q.right input { border-color: #00B862; }
  .q.wrong input { border-color: #C8102E; }

  .mark { float: right; font-weight: 700; }
  .q.right .mark { color: #00B862; }
  .q.wrong .mark { color: #C8102E; }

  button.submit {
    background: #A855F7; border: none; color: #0B0B12; font: inherit;
    font-weight: 700; padding: 0.6rem 1.5rem; cursor: pointer;
  }

  button.submit:hover { background: #BE7BFF; }
  button.submit:disabled { opacity: 0.5; cursor: default; }

  .verdict { margin-top: 0.9rem; }
  .verdict.part { color: #E0A020; }
  .verdict.done { color: #00B862; font-weight: 700; }
  .flag { color: #00B862; font-weight: 700; font-size: 1rem; margin-top: 0.4rem; }
`;

function page(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Paper Trail</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>
<div class="wrap">
  <div class="label">Open source intelligence</div>
  <h1>Paper Trail</h1>
  <p class="brief">
    Five accounts, one person, nothing private posted anywhere. Every answer
    below still sits in public — you just have to read two profiles at once to
    see it. All five sites and the person on them are fictional.
  </p>

  <div class="columns">
    <div>
      <div class="tabs" id="tabs"></div>

      <div class="browser">
        <div class="bar">
          <div class="dots"><i></i><i></i><i></i></div>
          <div class="url" id="url"></div>
        </div>
        <div id="site"></div>
      </div>
    </div>

    <form id="quiz">
      <h2>Account recovery questions</h2>
      <p class="note">
        These are the questions a helpdesk would ask to prove you are them.
      </p>
      <div id="questions"></div>
      <button class="submit" type="submit">Check answers</button>
      <div class="verdict" id="verdict"></div>
    </form>
  </div>
</div>

<script>
(function () {
  var PLATFORMS = ${encode(platforms)};
  var QUESTIONS = ${encode(questions)};

  var tabsEl = document.getElementById('tabs');
  var urlEl = document.getElementById('url');
  var siteEl = document.getElementById('site');
  var questionsEl = document.getElementById('questions');
  var verdictEl = document.getElementById('verdict');

  var current = 0;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null && text !== '') node.textContent = text;
    return node;
  }

  function renderTabs() {
    tabsEl.textContent = '';

    PLATFORMS.forEach(function (platform, index) {
      var button = el('button', index === current ? 'active' : '', platform.name);
      button.type = 'button';
      if (index === current) button.style.background = platform.accent;
      button.onclick = function () { current = index; render(); };
      tabsEl.appendChild(button);
    });
  }

  function renderItem(platform, item) {
    var node = el('div', 'item');

    if (platform.layout === 'grid') {
      var photo = el('div', 'photo', '▦');
      photo.style.background =
        'linear-gradient(135deg, ' + platform.accent + '55, #0B0B12)';
      node.appendChild(photo);

      var caption = el('div', 'caption');
      caption.appendChild(el('div', 'b', item.body));
      if (item.tag) caption.appendChild(el('span', 'chip', '📍 ' + item.tag));
      if (item.meta) caption.appendChild(el('div', 'm', item.meta));
      node.appendChild(caption);
      return node;
    }

    if (item.title) node.appendChild(el('div', 't', item.title));

    if (item.subtitle) {
      var subtitle = el('div', 's', item.subtitle);
      subtitle.style.color = platform.accent;
      node.appendChild(subtitle);
    }

    if (item.meta) node.appendChild(el('div', 'm', item.meta));
    if (item.body) node.appendChild(el('div', 'b', item.body));
    if (item.tag) node.appendChild(el('span', 'chip', item.tag));

    return node;
  }

  function renderSite() {
    var platform = PLATFORMS[current];
    urlEl.textContent = 'https://' + platform.domain;
    siteEl.textContent = '';

    var head = el('div', 'site-head');
    var name = el('div', 'site-name', platform.name);
    name.style.color = platform.accent;
    head.appendChild(name);
    head.appendChild(el('div', 'site-tagline', platform.tagline));

    var who = el('div', 'who');
    var avatar = el('div', 'avatar');
    avatar.style.background =
      'linear-gradient(135deg, ' + platform.accent + ', #0B0B12)';
    who.appendChild(avatar);

    var identity = el('div');
    identity.appendChild(el('div', 'name', platform.displayName));
    identity.appendChild(el('div', 'handle', platform.handle));
    identity.appendChild(el('div', 'bio', platform.bio));
    identity.appendChild(el('div', 'stats', platform.stats));
    who.appendChild(identity);

    head.appendChild(who);
    siteEl.appendChild(head);

    platform.sections.forEach(function (section) {
      var wrapper = el('div', 'section ' + platform.layout);
      wrapper.appendChild(el('div', 'heading', section.heading));

      var list = el('div', platform.layout === 'grid' ? 'grid' : '');
      section.items.forEach(function (item) {
        list.appendChild(renderItem(platform, item));
      });

      wrapper.appendChild(list);
      siteEl.appendChild(wrapper);
    });
  }

  function renderQuestions() {
    questionsEl.textContent = '';

    QUESTIONS.forEach(function (question) {
      var row = el('div', 'q');
      row.id = 'q-' + question.id;

      var label = el('label', '', question.prompt);
      label.setAttribute('for', 'input-' + question.id);
      row.appendChild(label);

      var input = document.createElement('input');
      input.type = 'text';
      input.id = 'input-' + question.id;
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.maxLength = 120;
      input.placeholder = question.placeholder;
      row.appendChild(input);

      questionsEl.appendChild(row);
    });
  }

  function render() {
    renderTabs();
    renderSite();
  }

  document.getElementById('quiz').addEventListener('submit', function (event) {
    event.preventDefault();

    var button = event.target.querySelector('button');
    var answers = {};
    QUESTIONS.forEach(function (question) {
      answers[question.id] = document.getElementById('input-' + question.id).value;
    });

    button.disabled = true;
    verdictEl.className = 'verdict';
    verdictEl.textContent = 'Checking…';

    fetch(window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answers })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        button.disabled = false;
        verdictEl.textContent = '';

        QUESTIONS.forEach(function (question) {
          var row = document.getElementById('q-' + question.id);
          var existing = row.querySelector('.mark');
          if (existing) existing.remove();

          var right = data.results[question.id];
          row.className = 'q ' + (right ? 'right' : 'wrong');

          var mark = el('span', 'mark', right ? '✓' : '✗');
          row.querySelector('label').appendChild(mark);
        });

        if (data.flag) {
          verdictEl.className = 'verdict done';
          verdictEl.textContent = 'All five. That is an account takeover.';
          var flag = el('div', 'flag', data.flag);
          verdictEl.appendChild(flag);
          return;
        }

        verdictEl.className = 'verdict part';
        verdictEl.textContent =
          data.correct + ' of ' + QUESTIONS.length + ' correct. Keep digging.';
      })
      .catch(function () {
        button.disabled = false;
        verdictEl.className = 'verdict part';
        verdictEl.textContent = 'Could not reach the checker.';
      });
  });

  renderQuestions();
  render();
})();
</script>
</body>
</html>
`;
}

/**
 * The "Paper Trail" challenge. The profiles are public by design; only the
 * flag is held back, and only once all five answers land at once — getting
 * four is not a takeover.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { answers } = req.body ?? {};

    if (typeof answers !== "object" || answers === null) {
      return res.status(400).json({ error: "Missing answers" });
    }

    const verdict = checkAnswers(answers as Record<string, unknown>);
    return res.status(200).json({
      results: verdict.results,
      correct: verdict.correct,
      ...(verdict.all ? { flag: FLAG } : {}),
    });
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(page());
}
