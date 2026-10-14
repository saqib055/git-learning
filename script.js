import { TOPICS, buildQuery, checkAnswer, getOutput, countCompleted } from './logic.mjs';

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = Object.fromEntries(TOPICS.map(topic => [topic, document.getElementById(`panel-${topic}`)]));
const storageKey = 'learnlab-general-progress-v1';
let completed = {};
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (saved && typeof saved === 'object') completed = saved;
} catch { completed = {}; }

function showTopic(topic, focus = false) {
  if (!TOPICS.includes(topic)) return;
  tabs.forEach(tab => {
    const active = tab.dataset.topic === topic;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (focus && active) tab.focus();
  });
  TOPICS.forEach(id => { panels[id].hidden = id !== topic; });
}

function updateProgress() {
  const count = countCompleted(completed);
  document.getElementById('progress-label').textContent = `${count} of 3 completed`;
  document.getElementById('progress-bar').setAttribute('aria-valuenow', String(count));
  document.getElementById('progress-fill').style.width = `${(count / 3) * 100}%`;
  tabs.forEach(tab => tab.classList.toggle('is-done', completed[tab.dataset.topic] === true));
}

function saveProgress() {
  try { localStorage.setItem(storageKey, JSON.stringify(completed)); } catch { /* Storage may be blocked. */ }
  updateProgress();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showTopic(tab.dataset.topic));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    showTopic(tabs[next].dataset.topic, true);
  });
});

document.querySelectorAll('.quiz').forEach(quiz => {
  const topic = quiz.dataset.quiz;
  const feedback = quiz.querySelector('.feedback');
  const buttons = [...quiz.querySelectorAll('[data-answer]')];
  function renderComplete() {
    buttons.forEach(button => {
      button.disabled = true;
      button.classList.toggle('correct', checkAnswer(topic, button.dataset.answer));
    });
    feedback.textContent = 'Correct! Topic completed.';
  }
  if (completed[topic]) renderComplete();
  buttons.forEach(button => button.addEventListener('click', () => {
    if (completed[topic]) return;
    buttons.forEach(item => item.classList.remove('incorrect'));
    if (checkAnswer(topic, button.dataset.answer)) {
      completed[topic] = true;
      renderComplete();
      saveProgress();
    } else {
      button.classList.add('incorrect');
      feedback.textContent = 'Not quite. Try another answer.';
    }
  }));
});

const searchTopic = document.getElementById('search-topic');
const exact = document.getElementById('exact-match');
const site = document.getElementById('site-only');
const excludeVideo = document.getElementById('exclude-video');
const searchResult = document.getElementById('search-result');
function updateQuery() {
  searchResult.textContent = buildQuery(searchTopic.value, { exact: exact.checked, site: site.checked, excludeVideo: excludeVideo.checked }) || 'Enter a topic to build a query';
}
[searchTopic, exact, site, excludeVideo].forEach(input => input.addEventListener('input', updateQuery));
updateQuery();
document.getElementById('copy-query').addEventListener('click', async () => {
  const query = buildQuery(searchTopic.value, { exact: exact.checked, site: site.checked, excludeVideo: excludeVideo.checked });
  const status = document.getElementById('copy-status');
  if (!query) { status.textContent = 'Enter a topic first.'; return; }
  try {
    await navigator.clipboard.writeText(query);
    status.textContent = 'Query copied to clipboard!';
  } catch { status.textContent = 'Clipboard unavailable. Select and copy the query above.'; }
});

const scoreInput = document.getElementById('score-input');
const scorePreview = document.getElementById('score-preview');
scoreInput.addEventListener('input', () => { scorePreview.textContent = scoreInput.value || '?'; });
document.getElementById('run-code').addEventListener('click', () => {
  const output = getOutput(scoreInput.value);
  document.getElementById('code-result').textContent = output === null ? 'Enter a whole number from 0 to 10.' : `Console output: ${output}`;
});

document.getElementById('reset-progress').addEventListener('click', () => {
  completed = {};
  document.querySelectorAll('.quiz').forEach(quiz => {
    quiz.querySelectorAll('[data-answer]').forEach(button => {
      button.disabled = false;
      button.classList.remove('correct', 'incorrect');
    });
    quiz.querySelector('.feedback').textContent = '';
  });
  saveProgress();
});
updateProgress();
