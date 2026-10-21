/* Click a module to expand PDF subtopics. PDF files must be uploaded separately. */
document.addEventListener('DOMContentLoaded', () => {
  const catalog = window.MODULE_RESOURCES || {};
  const buttons = [...document.querySelectorAll('[data-module-button]')];
  for (const button of buttons) {
    const code = button.dataset.moduleButton;
    const row = button.closest('tr');
    const detail = document.querySelector(`[data-module-detail="${code}"]`);
    const panel = detail.querySelector('.module-subtopics');
    const topics = catalog[code] || [];
    const heading = document.createElement('div');
    heading.className = 'module-subtopics-heading';
    const title = document.createElement('strong');
    title.textContent = 'Subtopics & PDF Notes';
    const meta = document.createElement('span');
    meta.textContent = `${topics.length} topic${topics.length===1?'':'s'}`;
    heading.append(title, meta);
    panel.append(heading);
    if (!topics.length) {
      const empty = document.createElement('p');
      empty.className = 'module-topic-empty';
      empty.textContent = 'PDF notes have not been added for this module yet. Add topics in module-resources.js.';
      panel.append(empty);
    } else {
      const list = document.createElement('div');
      list.className = 'module-topic-list';
      topics.forEach((topic, i) => {
        const entry = document.createElement('div');
        entry.className = 'module-topic-item';
        const left = document.createElement('div');
        left.className = 'module-topic-title';
        const dot = document.createElement('span');
        dot.className = 'module-topic-icon';
        dot.textContent = 'PDF';
        const label = document.createElement('span');
        label.textContent = topic.title;
        left.append(dot,label);
        const link = document.createElement('a');
        link.className = 'module-topic-link';
        link.textContent = 'Open PDF ↗';
        // Only accept local pdf paths or HTTP(S) links.
        if (/^(https?:\/\/|pdfs\/)/i.test(topic.url || '')) {
          link.href = topic.url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        } else {
          link.removeAttribute('href');
          link.textContent = 'No PDF link';
        }
        entry.append(left,link);
        list.append(entry);
      });
      panel.append(list);
    }
    const toggle = () => {
      const opening = detail.hidden;
      // Close other opened modules so the page stays tidy.
      document.querySelectorAll('[data-module-detail]').forEach(r => r.hidden = true);
      buttons.forEach(b => {b.setAttribute('aria-expanded','false');b.textContent='View Topics ▾';});
      if (opening) {
        detail.hidden = false;
        button.setAttribute('aria-expanded','true');
        button.textContent = 'Hide Topics ▴';
      }
    };
    button.addEventListener('click',toggle);
    row.querySelector('td:nth-child(2)').classList.add('module-clickable');
    row.querySelector('td:nth-child(2)').addEventListener('click',toggle);
  }
});
