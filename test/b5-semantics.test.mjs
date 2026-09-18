import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const header = read('src/components/Layout/Header.js');
const navbar = read('src/components/NavBar.js');
const hamburger = read('src/components/HamburgerMenu.js');
const filterIcon = read('src/components/FilterIcon.js');
const characterFilter = read('src/components/CharacterFilter.js');
const pagination = read('src/components/Pagination.js');
const paginationButton = read('src/components/ButtonPagination.js');
const carousel = read('src/components/Carousel.js');
const social = read('src/components/SocialMedia.js');
const simpleCharacter = read('src/components/SimpleCharacterCard.js');
const transparent = read('src/components/ButtonTransparent.js');

test('maintained responsive navigation no longer branches on window size', () => {
  for (const [path, source] of [
    ['Header', header],
    ['Navbar', navbar],
    ['Carousel', carousel],
  ]) {
    assert.ok(!source.includes('useWindowSize'), `${path} must not use useWindowSize`);
    assert.ok(!source.includes('window.innerWidth'), `${path} must not read window.innerWidth`);
  }

  assert.match(header, /className="hidden lg:flex/);
  assert.match(header, /className="lg:hidden"/);
  assert.match(header, /id="mobile-navigation"/);
});

test('navigation and language controls use non-nested native semantics', () => {
  assert.ok(!/<Link[^>]*>\s*<button/s.test(navbar), 'navigation links must not wrap buttons');
  assert.match(navbar, /aria-current=/);
  assert.match(navbar, /aria-pressed=/);
  assert.match(navbar, /aria-label=\{t\('primaryNavigation'\)\}/);
  assert.match(hamburger, /aria-expanded=\{isOpen\}/);
  assert.match(hamburger, /aria-controls="mobile-navigation"/);
});

test('character filters expose keyboard-native buttons and relationships', () => {
  assert.match(filterIcon, /<button/);
  assert.match(filterIcon, /aria-controls="character-filters"/);
  assert.ok(!/<img[^>]*onClick=/s.test(filterIcon), 'filter image must not own click behavior');
  assert.ok(!/<li[^>]*onClick=/s.test(characterFilter), 'filter list items must not own click behavior');
  assert.match(characterFilter, /<button/);

  for (const asset of [
    'public/images/icons/filterIcon.png',
    'public/images/icons/Vision.png',
    'public/images/icons/gender.png',
    'public/images/icons/SortDown.png',
    'public/images/icons/cross.png',
  ]) {
    assert.ok(fs.existsSync(asset), `case-sensitive filter asset must exist: ${asset}`);
  }
});

test('pagination exposes current page, labelled controls and non-button ellipsis', () => {
  assert.match(pagination, /<nav/);
  assert.match(pagination, /paginationLabel/);
  assert.match(pagination, /previousPage/);
  assert.match(pagination, /nextPage/);
  assert.match(pagination, /<span key=\{page\.key\} aria-hidden="true"/);
  assert.match(paginationButton, /aria-current=\{isActive \? 'page' : undefined\}/);
});

test('carousel uses percentage-based SSR-safe layout and direct links', () => {
  assert.ok(!carousel.includes('useEffect'));
  assert.ok(!carousel.includes('window.innerWidth'));
  assert.match(carousel, /aria-roledescription="carousel"/);
  assert.match(carousel, /translateX\(-\$\{activeIndex \* 100\}%\)/);
  assert.ok(!carousel.includes('ButtonTransparent'));
  assert.ok(!/<Link[^>]*>\s*<button/s.test(carousel));
  assert.match(carousel, /tabIndex=\{index === activeIndex \? 0 : -1\}/);
  assert.ok(!transparent.includes('<button'));
});

test('social and character-card accessible names match real content/assets', () => {
  assert.match(social, /onFocus=/);
  assert.match(social, /onBlur=/);
  assert.match(simpleCharacter, /alt=\{character\.name\}/);

  for (const asset of [
    'public/images/icons/GitHub.png',
    'public/images/icons/GitHub_relleno.png',
    'public/images/icons/LinkedIn.png',
    'public/images/icons/LinkedIn_relleno.png',
    'public/images/icons/Figma.png',
    'public/images/icons/Figma_relleno.png',
  ]) {
    assert.ok(fs.existsSync(asset), `case-sensitive social asset must exist: ${asset}`);
  }
});
