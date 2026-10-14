export const ANSWERS = Object.freeze({ git: 'b', search: 'a', code: 'b' });
export const TOPICS = Object.freeze(['git', 'search', 'code']);

export function buildQuery(topic, { exact = false, site = false, excludeVideo = false } = {}) {
  const cleaned = String(topic ?? '').trim().replace(/\s+/g, ' ');
  if (!cleaned) return '';
  const parts = [exact ? `"${cleaned.replace(/"/g, '')}"` : cleaned];
  if (site) parts.push('site:developer.mozilla.org');
  if (excludeVideo) parts.push('-video');
  return parts.join(' ');
}

export function checkAnswer(topic, answer) {
  return Object.hasOwn(ANSWERS, topic) && ANSWERS[topic] === answer;
}

export function getOutput(score) {
  const num = Number(score);
  if (!Number.isInteger(num) || num < 0 || num > 10 || score === '') return null;
  return num >= 5 ? 'Great job!' : 'Keep practicing!';
}

export function countCompleted(progress) {
  return TOPICS.filter(topic => progress?.[topic] === true).length;
}
