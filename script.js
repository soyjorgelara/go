'use strict';

// Datos recuperados de las variantes de Figma. Negocios reutiliza en el
// prototipo el componente Deporte: se conservan sus opciones originales.
const baseCategories = [
  { name: 'Administración', options: ['Economía', 'Administración pública', 'Gobierno', 'Leyes y política', 'Gestión pública', 'Legislación estatal', 'Organismos y ONGS', 'Política pública', 'Fecha inicio'] },
  { name: 'Agronomía', options: ['Economía', 'Ganado y conservación', 'Campo industrial', 'Técnicas de agronomía aplicada'] },
  { name: 'Danza', options: ['Rap', 'Rock', 'Ballet', 'Bambo'] },
  { name: 'Deporte', options: ['Futbol', 'Golf', 'Básquetbol'] },
  { name: 'Negocios', options: ['Futbol', 'Golf', 'Básquetbol'] },
  { name: 'Deporte', options: ['Futbol', 'Golf', 'Básquetbol'] }
];

// 60 tarjetas independientes: se repite el catálogo sin compartir sus referencias.
const categories = Array.from({ length: 60 }, (_, index) => {
  const category = baseCategories[index % baseCategories.length];
  return { name: category.name, options: [...category.options] };
});

// Identificadores por categoría + opción evitan colisiones entre nombres iguales.
const selected = new Set();
const list = document.querySelector('#accordions');
const tags = document.querySelector('#tags');
const empty = document.querySelector('#empty');
const clear = document.querySelector('#clear');
const next = document.querySelector('#continue');
const status = document.querySelector('#status');
const keyFor = (category, option) => `${category}:${option}`;

// Se crean una sola vez: actualizar tags no cierra los accordions ni pierde el foco.
categories.forEach((category, categoryIndex) => {
  const details = document.createElement('details');
  details.className = 'accordion';
  const summary = document.createElement('summary');
  const title = document.createElement('strong');
  title.textContent = category.name;
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.innerHTML = '<img src="assets/imgBb62.svg" alt=""><span></span>';
  const mobileTotal = document.createElement('span');
  mobileTotal.className = 'mobile-total';
  mobileTotal.textContent = `Sub categorías: ${category.options.length}`;
  const mobileSelected = document.createElement('span');
  mobileSelected.className = 'mobile-selected';
  summary.append(title, mobileTotal, badge, mobileSelected);
  category.mobileSelected = mobileSelected;
  category.details = details;
  const options = document.createElement('div');
  options.className = 'options';
  const heading = document.createElement('label');
  heading.className = 'option table-heading';
  const all = document.createElement('input');
  all.type = 'checkbox';
  all.setAttribute('aria-label', `Seleccionar todas las opciones de ${category.name}`);
  const headingText = document.createElement('span');
  headingText.textContent = 'SUB CATEGORÍAS';
  heading.append(all, headingText);
  options.append(heading);
  category.inputs = [];
  category.options.forEach((name, optionIndex) => {
    const key = keyFor(categoryIndex, optionIndex);
    const label = document.createElement('label');
    label.className = 'option';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `interest-${categoryIndex}-${optionIndex}`;
    input.value = key;
    const text = document.createElement('span');
    text.textContent = name;
    label.append(input, text);
    options.append(label);
    category.inputs.push(input);
    input.addEventListener('change', () => {
      if (input.checked) selected.add(key);
      else selected.delete(key);
      render();
    });
  });
  all.addEventListener('change', () => {
    category.options.forEach((_, index) => {
      const key = keyFor(categoryIndex, index);
      if (all.checked) selected.add(key);
      else selected.delete(key);
    });
    render();
  });
  category.badge = badge;
  category.all = all;
  details.append(summary, options);
  list.append(details);
});

// Una única función deriva toda la interfaz del mismo conjunto de selección.
function render() {
  tags.replaceChildren();
  categories.forEach((category, categoryIndex) => {
    const chosen = category.options.map((name, index) => ({ name, index }))
      .filter(option => selected.has(keyFor(categoryIndex, option.index)));
    category.inputs.forEach((input, index) => {
      input.checked = selected.has(keyFor(categoryIndex, index));
    });
    category.all.checked = chosen.length === category.options.length;
    category.all.indeterminate = chosen.length > 0 && chosen.length < category.options.length;
    category.badge.lastElementChild.textContent = `${chosen.length} de ${category.options.length} seleccionadas`;
    category.badge.classList.toggle('active', chosen.length > 0);
    category.mobileSelected.textContent = `●  ${chosen.length} seleccionadas`;
    if (!chosen.length) return;
    const group = document.createElement('section');
    group.className = 'tag-group';
    const title = document.createElement('h4');
    title.textContent = `${category.name} (${chosen.length})`;
    const row = document.createElement('div');
    row.className = 'tag-row';
    chosen.forEach(({ name, index }) => {
      const tag = document.createElement('button');
      tag.type = 'button';
      tag.className = 'tag';
      tag.setAttribute('aria-label', `Quitar ${name} de ${category.name}`);
      const text = document.createElement('span');
      text.textContent = name;
      const close = document.createElement('span');
      close.className = 'close';
      close.textContent = '×';
      close.setAttribute('aria-hidden', 'true');
      tag.append(text, close);
      tag.addEventListener('click', () => {
        selected.delete(keyFor(categoryIndex, index));
        const position = [...tags.querySelectorAll('.tag')].indexOf(tag);
        render();
        // Tras eliminar el botón activo, el teclado conserva un destino útil.
        const remaining = tags.querySelectorAll('.tag');
        (remaining[Math.min(position, remaining.length - 1)] || (interestsDialog.open ? interestsDialog.querySelector('[data-close]') : document.querySelector('#filters-open'))).focus({ preventScroll: true });
      });
      row.append(tag);
    });
    group.append(title, row);
    tags.append(group);
  });
  const hasSelection = selected.size > 0;
  document.querySelector('#count').textContent = selected.size;
  empty.hidden = hasSelection;
  tags.hidden = !hasSelection;
  clear.disabled = !hasSelection;
  document.querySelector('#clear-modal').disabled = !hasSelection;
  document.querySelector('#selected-count').textContent = selected.size;
  next.disabled = !hasSelection;
  status.textContent = `${selected.size} intereses seleccionados`;
}

clear.addEventListener('click', () => {
  selected.clear();
  render();
  (interestsDialog.open ? interestsDialog.querySelector('[data-close]') : document.querySelector('#filters-open')).focus({ preventScroll: true });
});

// Punto de integración, sin inventar una pantalla posterior al flujo solicitado.
next.addEventListener('click', () => {
  const interests = [...selected].map(key => {
    const [category, option] = key.split(':').map(Number);
    return { id: key, category: categories[category].name, name: categories[category].options[option] };
  });
  document.dispatchEvent(new CustomEvent('interests:continue', { detail: { interests } }));
  status.textContent = 'Selección lista para continuar.';
});
// Se mueve el MISMO panel entre desktop y modal: no se duplican tags ni estado.
const interestsPanel = document.querySelector('#interests-panel');
const interestsHome = document.querySelector('#interests-home');
const interestsDialog = document.querySelector('#interests-dialog');
const filtersDialog = document.querySelector('#filters-dialog');
const responsive = window.matchMedia('(max-width: 1024px)');
function placeInterests() {
  if (responsive.matches) document.querySelector('#interests-slot').append(interestsPanel);
  else {
    if (interestsDialog.open) interestsDialog.close();
    interestsHome.after(interestsPanel);
  }
}
responsive.addEventListener('change', placeInterests);
placeInterests();

// Cierre por botón, Escape nativo y clic real en el fondo (no dentro del modal).
[filtersDialog, interestsDialog].forEach(dialog => {
  let backdropDown = false;
  const outside = event => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropDown = outside(event); });
  dialog.addEventListener('click', event => { if (event.target === dialog && backdropDown && outside(event)) dialog.close(); });
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]'));
  });
});
function openModal(dialog) {
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelector('#filters-open').addEventListener('click', () => {
  openModal(filtersDialog);
  document.querySelector('#search').focus();
});
document.querySelector('#interests-open').addEventListener('click', () => openModal(interestsDialog));
document.querySelector('#clear-modal').addEventListener('click', () => clear.click());

// Búsqueda en vivo sin acentos ni diferencias entre mayúsculas y minúsculas.
const search = document.querySelector('#search');
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
let previousOpen = null;
function filterCategories() {
  const query = normalize(search.value);
  if (query && previousOpen === null) previousOpen = categories.map(category => category.details.open);
  let matches = 0;
  categories.forEach((category, index) => {
    const match = !query || category.options.some(option => normalize(option).includes(query));
    category.details.hidden = !match;
    if (query && match) { category.details.open = true; matches++; }
    if (!query && previousOpen) category.details.open = previousOpen[index];
  });
  if (!query) previousOpen = null;
  document.querySelector('#search-results').hidden = !query;
  document.querySelector('#search-term').textContent = search.value.trim();
  document.querySelector('#no-results').hidden = !query || matches > 0;
  document.querySelector('#apply-filters').disabled = !query;
  list.scrollTop = 0;
}
function resetSearch() { search.value = ''; filterCategories(); }
search.addEventListener('input', filterCategories);
document.querySelector('#search-clear').addEventListener('click', () => { resetSearch(); search.focus(); });
document.querySelector('#reset-filters').addEventListener('click', () => { resetSearch(); search.focus(); });
document.querySelector('#show-all').addEventListener('click', () => { resetSearch(); document.querySelector('#filters-open').focus(); });
document.querySelector('#filters-form').addEventListener('submit', event => {
  event.preventDefault();
  filterCategories();
  filtersDialog.close();
});
render();
