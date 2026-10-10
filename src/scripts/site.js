import i18next from 'i18next';
import { animate } from 'motion';
import { languages, resources } from '../i18n/locales.js';

function getSavedLanguage() {
	try {
		return localStorage.getItem('guesthouse-language');
	} catch {
		return null;
	}
}

const requestedLanguage = getSavedLanguage();
const initialLanguage = languages.find((language) => language.code === requestedLanguage)?.code || 'en';
const i18n = i18next.createInstance();
i18n.init({ lng: initialLanguage, fallbackLng: 'en', resources, interpolation: { escapeValue: false }, initImmediate: false });
const t = (key, options) => i18n.t(key, options);
const localeInfo = () => languages.find((language) => language.code === i18n.language) || languages[0];
const formatNumber = (value, options) => new Intl.NumberFormat(localeInfo().intl, options).format(value);
const currencyCacheKey = 'guesthouse-currency-rates';
let currencyRates = { usd: 1 };

try {
	const cachedRates = JSON.parse(localStorage.getItem(currencyCacheKey));
	if (cachedRates?.rates?.usd === 1 && Date.now() - cachedRates.fetchedAt < 7 * 24 * 60 * 60 * 1000) currencyRates = cachedRates.rates;
} catch {
	// Currency rates will be fetched for this page view.
}

function formatMoney(amount, currency) {
	const rate = currencyRates[currency.toLowerCase()];
	if (!Number.isFinite(rate)) return `${currency} —`;
	const value = amount * rate;
	return new Intl.NumberFormat(localeInfo().intl, { style: 'currency', currency, currencyDisplay: 'code', maximumFractionDigits: 0 }).format(value);
}

function currencyCodes() {
	return [...new Set(['USD', 'BDT', localeInfo().currency])];
}

function renderCurrencyAmounts(amount, excludedCurrencies = []) {
	return currencyCodes()
		.filter((currency) => !excludedCurrencies.includes(currency))
		.map((currency) => `<span>${formatMoney(amount, currency)}</span>`)
		.join('');
}

function formatCurrencyBreakdown(amount) {
	return currencyCodes().map((currency) => formatMoney(amount, currency)).join(' · ');
}

async function loadCurrencyRates() {
	try {
		const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json', { signal: AbortSignal.timeout(8000) });
		if (!response.ok) throw new Error(`Currency rates request failed: ${response.status}`);
		const data = await response.json();
		if (data.usd?.usd !== 1 || !languages.every(({ currency }) => Number.isFinite(data.usd[currency.toLowerCase()]))) throw new Error('Currency rates response is incomplete');
		currencyRates = data.usd;
		try {
			localStorage.setItem(currencyCacheKey, JSON.stringify({ fetchedAt: Date.now(), rates: currencyRates }));
		} catch {
			// The live rates still apply for this page view.
		}
		renderDestinationCards();
		renderPeopleCards();
	} catch {
		// Keep the last-known rates when the rate service is unavailable.
	}
}

function syncLanguagePicker() {
	if (!languageSelect || !languageLabel || !languageMenu) return;
	const current = languages.find((entry) => entry.code === i18n.language) || languages[0];
	languageSelect.value = i18n.language;
	languageLabel.textContent = current.label;
	[...languageMenu.querySelectorAll('.lang-option')].forEach((option) => {
		const selected = option.dataset.lang === current.code;
		option.classList.toggle('is-selected', selected);
		option.setAttribute('aria-selected', String(selected));
	});
}

function applyTranslations() {
	document.documentElement.lang = localeInfo().htmlLang;
	document.title = t('site.title');
	document.querySelectorAll('[data-i18n]').forEach((element) => {
		element.textContent = t(element.dataset.i18n);
	});
	document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
		element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
	});
	document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
		element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
	});
	if (languageSelect) languageSelect.value = i18n.language;
	syncLanguagePicker();
	const staysTitle = byId('stays-title');
	if (staysTitle && searchState?.destination) staysTitle.textContent = t('stays.inLocation', { destination: searchState.destination });
	if (themeToggle) {
		const themeKey = document.documentElement.dataset.theme === 'dark' ? 'nav.themeLight' : 'nav.themeDark';
		themeToggle.setAttribute('aria-label', t(themeKey));
		themeToggle.title = t(themeKey);
	}
}

const imageUrl = (id, width = 700) => `https://images.unsplash.com/${id}?w=${width}&q=80`;
const byId = (id) => document.getElementById(id);
const query = (selector) => document.querySelector(selector);
const reducedMotionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const ambientVideos = [...document.querySelectorAll('.ambient-video')];
function syncAmbientVideoMotion() {
	ambientVideos.forEach((video) => {
		if (reducedMotionPreference.matches || document.hidden) {
			video.pause();
			return;
		}
		video.play().catch(() => {});
	});
}
syncAmbientVideoMotion();
reducedMotionPreference.addEventListener('change', syncAmbientVideoMotion);
document.addEventListener('visibilitychange', syncAmbientVideoMotion);

const arches = byId('arches');
const fan = byId('fan');
const accordion = byId('acc');
const frameImage = byId('fr');
const paymentList = byId('pm');
const socialList = byId('sso');
const siteHeader = byId('site-header');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeIcon = themeToggle.querySelector('[data-theme-icon]');
const languageSelect = byId('language-select');
const languagePicker = byId('language-picker');
const languageTrigger = byId('language-trigger');
const languageLabel = byId('language-label');
const languageMenu = byId('language-menu');
languageSelect.value = initialLanguage;
const compactSentinel = byId('compact-sentinel');
const searchForm = byId('travel-search');
const searchPopover = byId('search-popover');
const destinationInput = byId('destination-input');
const destinationSuggestions = byId('destination-suggestions');
const calendarMonths = byId('calendar-months');
const calendarStatus = byId('calendar-status');
const searchState = { destination: '', checkIn: null, checkOut: null, guests: { adults: 1, children: 0, infants: 0 } };
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let activeSearchPanel = '';

const themePreference = matchMedia('(prefers-color-scheme: dark)');
function getSavedTheme() {
	try {
		return localStorage.getItem('guesthouse-theme');
	} catch {
		return null;
	}
}
function applyTheme(theme, save = false) {
	document.documentElement.dataset.theme = theme;
	document.querySelectorAll('[data-theme-logo-light][data-theme-logo-dark]').forEach((logo) => {
		logo.src = theme === 'dark' ? logo.dataset.themeLogoDark : logo.dataset.themeLogoLight;
	});
	themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
	themeToggle.setAttribute('aria-label', t(theme === 'dark' ? 'nav.themeLight' : 'nav.themeDark'));
	themeToggle.title = t(theme === 'dark' ? 'nav.themeLight' : 'nav.themeDark');
	if (save) {
		try {
			localStorage.setItem('guesthouse-theme', theme);
		} catch {
			return;
		}
	}
}
applyTheme(getSavedTheme() || (themePreference.matches ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));
themePreference.addEventListener('change', (event) => {
	if (!getSavedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});

function dateKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function fromDateKey(value) {
	const [year, month, day] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
}

function formatDate(date) {
	return new Intl.DateTimeFormat(localeInfo().intl, { month: 'short', day: 'numeric' }).format(date);
}

function updateSearchSummary() {
	const dates = searchState.checkIn && searchState.checkOut
		? `${formatDate(searchState.checkIn)} – ${formatDate(searchState.checkOut)}`
		: searchState.checkIn ? formatDate(searchState.checkIn) : t('search.addDates');
	const guestCount = Object.values(searchState.guests).reduce((total, count) => total + count, 0);
	const guests = guestCount ? t('search.guest', { count: guestCount }) : t('search.addGuests');
	const destination = searchState.destination || t('search.anywhere');
	document.querySelectorAll('[data-summary="destination"]').forEach((item) => { item.textContent = item.classList.contains('segment-value') ? (searchState.destination || t('search.destinations')) : destination; });
	document.querySelectorAll('[data-summary="dates"]').forEach((item) => { item.textContent = dates; });
	document.querySelectorAll('[data-summary="guests"]').forEach((item) => { item.textContent = guests; });
	for (const [type, count] of Object.entries(searchState.guests)) byId(`count-${type}`).value = count;
	document.querySelectorAll('[data-guest-step]').forEach((button) => {
		const type = button.dataset.guestType;
		const minimum = type === 'adults' ? 1 : 0;
		button.disabled = button.dataset.guestStep === '-1' ? searchState.guests[type] <= minimum : searchState.guests[type] >= 16;
	});
}

function renderSuggestions(filter = '') {
	const destinations = [
		{ value: '', label: t('search.anywhere') },
		...['Goa', 'Kerala', 'Calangute', 'Wayanad', 'Bali'].map((place) => ({ value: place, label: place })),
	];
	const normalizedFilter = filter.trim().toLocaleLowerCase(localeInfo().intl);
	const matching = destinations.filter((place) => `${place.value} ${place.label}`.toLocaleLowerCase(localeInfo().intl).includes(normalizedFilter));
	if (filter.trim() && !matching.some((place) => place.label.toLocaleLowerCase(localeInfo().intl) === normalizedFilter)) matching.unshift({ value: filter.trim(), label: filter.trim() });
	destinationSuggestions.replaceChildren();
	matching.forEach((place, index) => {
		const option = document.createElement('button');
		option.type = 'button';
		option.setAttribute('role', 'option');
		option.setAttribute('aria-selected', 'false');
		option.dataset.destination = place.value;
		option.dataset.label = place.label;
		const icon = document.createElement('span');
		icon.className = 'suggestion-icon';
		icon.setAttribute('aria-hidden', 'true');
		icon.textContent = index === 0 && !filter ? '⌖' : '↗';
		const label = document.createElement('span');
		label.textContent = place.label;
		option.append(icon, label);
		destinationSuggestions.append(option);
	});
}

function renderCalendarMonth(offset) {
	const year = calendarMonth.getFullYear();
	const month = calendarMonth.getMonth() + offset;
	const first = new Date(year, month, 1);
	const normalized = new Date(first.getFullYear(), first.getMonth(), 1);
	const monthName = new Intl.DateTimeFormat(localeInfo().intl, { month: 'long', year: 'numeric' }).format(normalized);
	const daysInMonth = new Date(normalized.getFullYear(), normalized.getMonth() + 1, 0).getDate();
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(localeInfo().intl, { weekday: 'short' }).format(new Date(2024, 0, 7 + index)))
		.map((day) => `<span class="calendar-weekday">${day}</span>`).join('');
	let days = '<span class="calendar-day is-outside" aria-hidden="true"></span>'.repeat(first.getDay());
	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(normalized.getFullYear(), normalized.getMonth(), day);
		const key = dateKey(date);
		const selected = key === (searchState.checkIn && dateKey(searchState.checkIn)) || key === (searchState.checkOut && dateKey(searchState.checkOut));
		const inRange = searchState.checkIn && searchState.checkOut && key > dateKey(searchState.checkIn) && key < dateKey(searchState.checkOut);
		const disabled = date < today;
		days += `<button type="button" class="calendar-day${selected ? ' is-selected' : ''}${inRange ? ' is-range' : ''}" data-calendar-date="${key}" aria-label="${new Intl.DateTimeFormat(localeInfo().intl, { dateStyle: 'full' }).format(date)}"${disabled ? ' disabled' : ''}>${formatNumber(day)}<\/button>`;
	}
	return `<section class="calendar-month" aria-label="${monthName}"><h3>${monthName}</h3><div class="calendar-grid">${weekdays}${days}</div></section>`;
}

function renderCalendar() {
	const now = new Date();
	const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	byId('calendar-prev').disabled = calendarMonth <= currentMonth;
	calendarMonths.innerHTML = renderCalendarMonth(0) + renderCalendarMonth(1);
}

function openSearchPanel(panelName) {
	activeSearchPanel = panelName;
	searchPopover.hidden = false;
	siteHeader.classList.add('search-open');
	document.querySelectorAll('[data-search-panel]').forEach((panel) => { panel.hidden = panel.dataset.searchPanel !== panelName; });
	document.querySelectorAll('[data-search-open]').forEach((button) => button.setAttribute('aria-expanded', String(button.dataset.searchOpen === panelName)));
	if (panelName === 'destination') {
		renderSuggestions(destinationInput.value);
		requestAnimationFrame(() => destinationInput.focus());
	}
	if (panelName === 'dates') renderCalendar();
}

function closeSearchPanel() {
	activeSearchPanel = '';
	searchPopover.hidden = true;
	siteHeader.classList.remove('search-open');
	document.querySelectorAll('[data-search-open]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
}

document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', () => openSearchPanel(button.dataset.searchOpen)));
byId('popover-close').addEventListener('click', closeSearchPanel);
destinationInput.addEventListener('input', () => renderSuggestions(destinationInput.value));
destinationInput.addEventListener('keydown', (event) => {
	if (event.key !== 'Enter' || !destinationInput.value.trim()) return;
	event.preventDefault();
	searchState.destination = destinationInput.value.trim();
	updateSearchSummary();
	openSearchPanel('dates');
});
destinationSuggestions.addEventListener('click', (event) => {
	const option = event.target.closest('[data-destination]');
	if (!option) return;
	searchState.destination = option.dataset.destination;
	destinationInput.value = option.dataset.label === t('search.anywhere') ? '' : option.dataset.label;
	updateSearchSummary();
	openSearchPanel('dates');
});

calendarMonths.addEventListener('click', (event) => {
	const dayButton = event.target.closest('[data-calendar-date]');
	if (!dayButton || dayButton.disabled) return;
	const selectedDate = fromDateKey(dayButton.dataset.calendarDate);
	if (!searchState.checkIn || searchState.checkOut || selectedDate <= searchState.checkIn) {
		searchState.checkIn = selectedDate;
		searchState.checkOut = null;
		calendarStatus.textContent = t('search.pickCheckOut');
	} else {
		searchState.checkOut = selectedDate;
		calendarStatus.textContent = `${formatDate(searchState.checkIn)} – ${formatDate(searchState.checkOut)}`;
	}
	updateSearchSummary();
	renderCalendar();
});
byId('calendar-prev').addEventListener('click', () => { calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1); renderCalendar(); });
byId('calendar-next').addEventListener('click', () => { calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1); renderCalendar(); });
document.querySelectorAll('[data-date-preset]').forEach((button) => button.addEventListener('click', () => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	if (button.dataset.datePreset === 'tomorrow') start.setDate(start.getDate() + 1);
	if (button.dataset.datePreset === 'weekend') start.setDate(start.getDate() + ((6 - start.getDay() + 7) % 7));
	const end = new Date(start);
	end.setDate(end.getDate() + (button.dataset.datePreset === 'weekend' ? 2 : 1));
	searchState.checkIn = start;
	searchState.checkOut = end;
	calendarMonth = new Date(start.getFullYear(), start.getMonth(), 1);
	calendarStatus.textContent = `${formatDate(start)} – ${formatDate(end)}`;
	updateSearchSummary();
	renderCalendar();
}));

document.querySelectorAll('[data-guest-step]').forEach((button) => button.addEventListener('click', () => {
	const type = button.dataset.guestType;
	searchState.guests[type] = Math.max(type === 'adults' ? 1 : 0, Math.min(16, searchState.guests[type] + Number(button.dataset.guestStep)));
	updateSearchSummary();
}));

byId('compact-submit').addEventListener('click', () => searchForm.requestSubmit());
byId('travel-search').addEventListener('submit', (event) => {
	event.preventDefault();
	searchState.destination = destinationInput.value.trim() || searchState.destination;
	updateSearchSummary();
	const destination = searchState.destination.trim();
	const filter = destination.toLowerCase();
	let visibleCount = 0;
	document.querySelectorAll('#fan .card').forEach((card) => {
		const matches = !filter || card.dataset.destination.toLowerCase().includes(filter) || card.textContent.toLowerCase().includes(filter);
		card.hidden = !matches;
		if (matches) visibleCount++;
	});
	byId('search-empty').hidden = visibleCount > 0;
	byId('stays-title').textContent = destination ? t('stays.inLocation', { destination }) : t('stays.popular');
	const params = new URLSearchParams();
	if (destination) params.set('destination', destination);
	if (searchState.checkIn) params.set('checkIn', dateKey(searchState.checkIn));
	if (searchState.checkOut) params.set('checkOut', dateKey(searchState.checkOut));
	params.set('guests', String(Object.values(searchState.guests).reduce((total, count) => total + count, 0)));
	history.replaceState(null, '', `${location.pathname}?${params.toString()}#stays`);
	closeSearchPanel();
	byId('stays').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});

document.addEventListener('click', (event) => { if (!event.composedPath().includes(siteHeader)) closeSearchPanel(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !searchPopover.hidden) closeSearchPanel(); });

let compactFrame = 0;
function measureExpandedHeader() {
	const wasCompact = siteHeader.classList.contains('is-compact');
	if (wasCompact) siteHeader.classList.remove('is-compact');
	const height = siteHeader.offsetHeight;
	if (wasCompact) siteHeader.classList.add('is-compact');
	return height;
}
let compactThreshold = measureExpandedHeader();
function updateCompactHeader() {
	compactFrame = 0;
	siteHeader.classList.toggle('is-compact', compactSentinel.getBoundingClientRect().top <= compactThreshold);
	if (siteHeader.classList.contains('is-compact')) closeSearchPanel();
}
addEventListener('scroll', () => {
	if (compactFrame) return;
	compactFrame = requestAnimationFrame(updateCompactHeader);
}, { passive: true });
addEventListener('resize', () => {
	compactThreshold = measureExpandedHeader();
	updateCompactHeader();
});
updateCompactHeader();

const categoryObserver = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;
		document.querySelectorAll('.category-tab').forEach((tab) => {
			const active = tab.dataset.section === entry.target.id;
			tab.classList.toggle('is-active', active);
			if (active) tab.setAttribute('aria-current', 'page');
			else tab.removeAttribute('aria-current');
		});
	}
}, { rootMargin: '-25% 0px -65% 0px' });
document.querySelectorAll('.category-tab').forEach((tab) => {
	const section = byId(tab.dataset.section);
	if (section) categoryObserver.observe(section);
	tab.addEventListener('click', closeSearchPanel);
});
renderSuggestions();
updateSearchSummary();

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
	document.body.classList.add('motion-ready');
	const revealObserver = new IntersectionObserver((entries, observer) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			entry.target.classList.add('is-visible');
			observer.unobserve(entry.target);
		}
	}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
	document.querySelectorAll('.panel:not(#top), footer').forEach((section) => revealObserver.observe(section));
}

const destinations = [
	['/assets/area/chittagong.jpg', 'Chittagong', 'Hill valley in Chittagong', '/assets/animation/areas/chittagong.mp4'],
	['/assets/area/coxbazar.jpg', "Cox's Bazar", "Beach in Cox's Bazar", '/assets/animation/areas/coxbazar.mp4'],
	['/assets/area/Dhaka.jpg', 'Dhaka', 'Dhaka city skyline at night', '/assets/animation/areas/dhaka.mp4', '/guestHouses/dhaka/'],
	['/assets/area/sylhet.jpg', 'Sylhet', 'Lake and green hills in Sylhet', '/assets/animation/areas/sylhet.mp4'],
];
arches.innerHTML = destinations.map(([image, name, alt, video, href]) => {
	const content = `<img src="${image}" alt="${alt}"><video class="area-video" muted playsinline loop preload="none" aria-hidden="true"><source src="${video}" type="video/mp4"></video><span class="area-name">${name}</span>`;
	return href
		? `<a class="area-card" href="${href}" aria-label="Guesthouses in ${name}">${content}</a>`
		: `<figure class="area-card">${content}</figure>`;
}).join('');
arches.querySelectorAll('.area-card').forEach((card) => {
	const video = card.querySelector('.area-video');
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	const playVideo = () => video.play().then(() => card.classList.add('is-playing')).catch(() => card.classList.remove('is-playing'));
	const stopVideo = () => {
		if (card.matches(':hover') || card.contains(document.activeElement)) return;
		card.classList.remove('is-playing');
		video.pause();
		video.currentTime = 0;
	};
	card.addEventListener('pointerenter', playVideo);
	card.addEventListener('pointerleave', stopVideo);
	card.addEventListener('focusin', playVideo);
	card.addEventListener('focusout', stopVideo);
});
const homes = [
	['photo-1564013799919-ab600027ffc6', 'homes.kerala', 120, 'Kerala'],
	['photo-1582719478250-c89cae4dc85b', 'homes.calangute', 85, 'Calangute'],
	['photo-1618773928121-c32242e63f39', 'homes.wayanad', 64, 'Wayanad'],
	['photo-1512917774080-9991f1c4c750', 'homes.bali', 210, 'Bali'],
	['photo-1566073771259-6a8506099945', 'homes.poolGoa', 160, 'Goa'],
	['photo-1520250497591-112f2f40a3f4', 'homes.resortGoa', 240, 'Goa'],
];
let current = 2;
let cards = [];
function placeCards() {
	const spacing = innerWidth < 700 ? 70 : 150;
	cards.forEach((card, index) => {
		const offset = index - current;
		const distance = Math.abs(offset);
		card.style.transform = `translateX(calc(-50% + ${offset * spacing}px)) translateY(${distance * 20}px) rotate(${offset * 7}deg) scale(${offset ? 0.88 : 1.06})`;
		card.style.zIndex = 10 - distance;
		card.style.opacity = distance > 2 ? 0 : 1;
		card.style.pointerEvents = distance > 2 ? 'none' : 'auto';
	});
}
function renderDestinationCards() {
	const filter = searchState.destination.trim().toLocaleLowerCase(localeInfo().intl);
	fan.innerHTML = homes.map(([id, nameKey, price, destination]) => {
		const hidden = filter && !destination.toLocaleLowerCase(localeInfo().intl).includes(filter) ? ' hidden' : '';
		return `<div class="card" data-destination="${destination.toLowerCase()}"${hidden}><img src="${imageUrl(id, 500)}" alt=""><h4>${t(nameKey)}</h4><div class="currency-breakdown">${renderCurrencyAmounts(price)}</div><span> / ${t('stays.night')} · ★ 4.6</span></div>`;
	}).join('');
	cards = [...fan.children];
	cards.forEach((card, index) => card.addEventListener('click', () => { current = index; placeCards(); }));
	placeCards();
}
byId('next').addEventListener('click', () => { current = (current + 1) % cards.length; placeCards(); });
byId('prev').addEventListener('click', () => { current = (current - 1 + cards.length) % cards.length; placeCards(); });
addEventListener('resize', placeCards);
placeCards();

const featureKeys = [
	['services.rideTitle', 'services.rideDescription', 'photo-1469854523086-cc02fe5d8800'],
	['services.assistantTitle', 'services.assistantDescription', 'photo-1488646953014-85cb44e25828'],
	['services.guideTitle', 'services.guideDescription', 'photo-1476514525535-07fb3b4ae5f1'],
];
const rideOptions = [
	{ id: 'camaro-ss', brand: 'Chevrolet', model: 'Camaro SS', image: 'photo-1492144534655-ae79c964c9d7', seats: 4, bags: 2, rate: 22, idealKey: 'services.rideCity' },
	{ id: 'porsche-911', brand: 'Porsche', model: '911 Carrera', image: 'photo-1503376780353-7e6692767b70', seats: 2, bags: 2, rate: 48, idealKey: 'services.rideAirport' },
	{ id: 'camaro-zl1', brand: 'Chevrolet', model: 'Camaro ZL1', image: 'photo-1552519507-da3b142c6e3d', seats: 4, bags: 2, rate: 26, idealKey: 'services.rideCity' },
	{ id: 'mustang-gt', brand: 'Ford', model: 'Mustang GT', image: 'photo-1494976388531-d1058494cdd8', seats: 4, bags: 2, rate: 32, idealKey: 'services.rideFamily' },
	{ id: 'bmw-m4', brand: 'BMW', model: 'M4 Competition', image: 'photo-1511919884226-fd3cad34687c', seats: 4, bags: 2, rate: 38, idealKey: 'services.rideBusiness' },
	{ id: 'range-rover', brand: 'Land Rover', model: 'Range Rover Sport', image: 'photo-1519641471654-76ce0107ad1b', seats: 5, bags: 4, rate: 45, idealKey: 'services.rideFamily' },
	{ id: 'mercedes-amg', brand: 'Mercedes-Benz', model: 'AMG GT', image: 'photo-1544829099-b9a0c07fad1a', seats: 2, bags: 2, rate: 52, idealKey: 'services.rideBusiness' },
	{ id: 'toyota-prado', brand: 'Toyota', model: 'Land Cruiser Prado', image: 'photo-1503736334956-4c8f8e92946d', seats: 7, bags: 5, rate: 36, idealKey: 'services.rideGroup' },
	{ id: 'audi-r8', brand: 'Audi', model: 'R8 V10', image: 'photo-1549317661-bd32c8ce0db2', seats: 2, bags: 2, rate: 55, idealKey: 'services.rideBusiness' },
	{ id: 'bmw-x5', brand: 'BMW', model: 'X5 xDrive', image: 'photo-1504215680853-026ed2a45def', seats: 5, bags: 4, rate: 42, idealKey: 'services.rideAirport' },
];
let selectedVehicleId = '';
let vehicleOptionsExpanded = false;

function renderVehicleCard(vehicle) {
	const picked = selectedVehicleId === vehicle.id;
	return `<article class="vehicle-card${picked ? ' is-picked' : ''}" role="group" aria-label="${vehicle.brand} ${vehicle.model}" style="--vehicle-image:url('${imageUrl(vehicle.image, 1200)}')"><div class="vehicle-card-preview"><span>${vehicle.brand}</span><h4>${vehicle.model}</h4></div><div class="vehicle-card-details"><span class="vehicle-brand">${vehicle.brand}</span><h4>${vehicle.model}</h4><p class="vehicle-specs">${formatNumber(vehicle.seats)} ${t('services.rideSeats')} · ${formatNumber(vehicle.bags)} ${t('services.rideBags')}</p><p class="vehicle-ideal"><span>${t('services.rideIdealFor')}</span><strong>${t(vehicle.idealKey)}</strong></p><p class="vehicle-hourly"><span>${t('services.rideHourlyLabel')}</span><strong>${formatMoney(vehicle.rate, localeInfo().currency)}</strong></p><button class="vehicle-pick" type="button" data-vehicle-pick="${vehicle.id}" aria-pressed="${picked}">${t(picked ? 'services.ridePicked' : 'services.ridePick')}</button></div></article>`;
}

function animateVehicleCards(container) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	container.querySelectorAll('.vehicle-card').forEach((card, index) => {
		animate(card, {
			opacity: [0, 1],
			transform: ['translateY(18px) scale(.98)', 'translateY(0px) scale(1)'],
		}, { duration: 0.55, delay: index * 0.07, ease: 'easeOut' });
	});
}

function setupVehicleShowcase(row) {
	const track = row.querySelector('[data-vehicle-track]');
	const previous = row.querySelector('[data-vehicle-step="-1"]');
	const next = row.querySelector('[data-vehicle-step="1"]');
	const count = row.querySelector('[data-vehicle-count]');
	const updateControls = () => {
		const firstCard = track.querySelector('.vehicle-card');
		const step = firstCard ? firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap) : track.clientWidth;
		const index = step ? Math.round(track.scrollLeft / step) : 0;
		previous.disabled = track.scrollLeft <= 1;
		next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
		count.textContent = `${formatNumber(Math.min(index + 1, 7))} / ${formatNumber(7)}`;
	};
	const scrollTrack = (direction) => {
		const firstCard = track.querySelector('.vehicle-card');
		if (!firstCard) return;
		const step = firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
		track.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
	};
	previous.addEventListener('click', () => scrollTrack(-1));
	next.addEventListener('click', () => scrollTrack(1));
	track.addEventListener('scroll', () => requestAnimationFrame(updateControls), { passive: true });
	updateControls();

	const moreButton = row.querySelector('[data-vehicle-explore]');
	const moreVehicles = row.querySelector('#vehicle-more');
	moreButton.addEventListener('click', () => {
		vehicleOptionsExpanded = !vehicleOptionsExpanded;
		moreVehicles.hidden = !vehicleOptionsExpanded;
		moreButton.setAttribute('aria-expanded', String(vehicleOptionsExpanded));
		moreButton.textContent = t(vehicleOptionsExpanded ? 'services.rideShowLess' : 'services.rideExploreMore');
		if (vehicleOptionsExpanded) animateVehicleCards(moreVehicles);
	});

	row.addEventListener('click', (event) => {
		const pickButton = event.target.closest('[data-vehicle-pick]');
		if (!pickButton) return;
		selectedVehicleId = pickButton.dataset.vehiclePick;
		const selectedVehicle = rideOptions.find((vehicle) => vehicle.id === selectedVehicleId);
		row.querySelectorAll('[data-vehicle-pick]').forEach((button) => {
			const picked = button.dataset.vehiclePick === selectedVehicleId;
			button.setAttribute('aria-pressed', String(picked));
			button.textContent = t(picked ? 'services.ridePicked' : 'services.ridePick');
			button.closest('.vehicle-card').classList.toggle('is-picked', picked);
		});
		row.querySelector('[data-vehicle-selection]').textContent = t('services.rideSelected', { vehicle: `${selectedVehicle.brand} ${selectedVehicle.model}` });
	});
}

function renderFeatureRows() {
	accordion.innerHTML = featureKeys.map(([titleKey, descriptionKey, image], index) => {
		const detail = index === 0
			? `<div class="more vehicle-showcase"><div class="vehicle-showcase-heading"><p>${t(descriptionKey)}</p><div class="vehicle-carousel-controls"><output data-vehicle-count aria-live="polite">${formatNumber(1)} / ${formatNumber(7)}</output><button type="button" data-vehicle-step="-1" aria-label="${t('common.previous')}">‹</button><button type="button" data-vehicle-step="1" aria-label="${t('common.next')}">›</button></div></div><div class="vehicle-track" data-vehicle-track role="region" aria-label="${t(titleKey)}" tabindex="0">${rideOptions.slice(0, 7).map(renderVehicleCard).join('')}</div><button class="vehicle-explore" type="button" data-vehicle-explore aria-expanded="${vehicleOptionsExpanded}" aria-controls="vehicle-more">${t(vehicleOptionsExpanded ? 'services.rideShowLess' : 'services.rideExploreMore')}</button><div class="vehicle-more" id="vehicle-more"${vehicleOptionsExpanded ? '' : ' hidden'}>${rideOptions.slice(7).map(renderVehicleCard).join('')}</div><p class="sr-only" data-vehicle-selection aria-live="polite"></p></div>`
			: `<div class="more"><img src="${imageUrl(image, 400)}" alt=""><p>${t(descriptionKey)}</p></div>`;
		return `<div class="row${index ? '' : ' open ride-feature'}"><button class="row-trigger" type="button" aria-expanded="${index === 0}"><span class="num">${formatNumber(index + 1)}</span><h3>${t(titleKey)}</h3><span class="dot" aria-hidden="true">↗</span></button>${detail}</div>`;
	}).join('');
	[...accordion.children].forEach((row) => {
		const trigger = row.querySelector('.row-trigger');
		const openRow = () => {
			[...accordion.children].forEach((item) => {
				const isOpen = item === row;
				item.classList.toggle('open', isOpen);
				item.querySelector('.row-trigger').setAttribute('aria-expanded', String(isOpen));
			});
			if (row.classList.contains('ride-feature')) animateVehicleCards(row);
		};
		trigger.addEventListener('click', openRow);
		if (row.classList.contains('ride-feature')) setupVehicleShowcase(row);
	});
	const openRideRow = accordion.querySelector('.ride-feature.open');
	if (openRideRow) animateVehicleCards(openRideRow);
}

const people = {
	a: [
		{ name: 'Aarav', gender: 'm', age: 32, rating: 4.9, price: 30, image: 'photo-1507003211169-0a1dd7228f2d' },
		{ name: 'Meera', gender: 'f', age: 29, rating: 4.8, price: 38, image: 'photo-1494790108377-be9c29b29330' },
		{ name: 'Kabir', gender: 'm', age: 36, rating: 4.7, price: 45, image: 'photo-1500648767791-00dcc994a43e' },
		{ name: 'Isha', gender: 'f', age: 27, rating: 4.6, price: 50, image: 'photo-1438761681033-6461ffad8d80' },
	],
	g: [
		{ name: 'Rohan', gender: 'm', age: 34, rating: 4.9, price: 35, image: 'photo-1500648767791-00dcc994a43e' },
		{ name: 'Anaya', gender: 'f', age: 28, rating: 4.8, price: 42, image: 'photo-1438761681033-6461ffad8d80' },
		{ name: 'Vikram', gender: 'm', age: 41, rating: 4.7, price: 48, image: 'photo-1507003211169-0a1dd7228f2d' },
		{ name: 'Diya', gender: 'f', age: 26, rating: 4.5, price: 55, image: 'photo-1494790108377-be9c29b29330' },
	],
};
function applyPeopleFilter(kind) {
	const grid = byId(`g${kind}`);
	const toggle = query(`.tog[data-t=${kind}]`);
	const panel = document.querySelector(`.filter-panel[data-filter-kind="${kind}"]`);
	if (!grid || !toggle || !panel) return;

	const activeGender = toggle.querySelector('[aria-pressed="true"]')?.dataset.v || 'all';
	const maxPrice = Number(document.getElementById(`price-${kind}`).value);
	const maxAge = Number(document.getElementById(`age-${kind}`).value);
	const minRating = Number(document.getElementById(`rating-${kind}`).value);

	document.getElementById(`price-value-${kind}`).textContent = `Up to ${formatCurrencyBreakdown(maxPrice)} / day`;
	document.getElementById(`age-value-${kind}`).textContent = `Up to ${maxAge}`;
	document.getElementById(`rating-value-${kind}`).textContent = `${minRating.toFixed(1)}+`;

	[...grid.children].forEach((card) => {
		const matchesGender = activeGender === 'all' || card.dataset.g === activeGender;
		const matchesPrice = Number(card.dataset.price) <= maxPrice;
		const matchesAge = Number(card.dataset.age) <= maxAge;
		const matchesRating = Number(card.dataset.rating) >= minRating;
		card.classList.toggle('hide', !(matchesGender && matchesPrice && matchesAge && matchesRating));
	});
}
function renderPeopleCards() {
	['a', 'g'].forEach((kind) => {
		const grid = byId(`g${kind}`);
		const roleKey = kind === 'a' ? 'people.assistantRole' : 'people.guideRole';
		grid.innerHTML = people[kind].map((person) => `<article class="p" data-g="${person.gender}" data-price="${person.price}" data-age="${person.age}" data-rating="${person.rating}"><img src="${imageUrl(person.image, 500)}" alt=""><h4>${person.name}</h4><span>${t(roleKey)} · ★ ${person.rating.toFixed(1)}</span><div class="row2"><div class="person-price"><span class="price-label">${t('people.fromDay', { price: formatMoney(person.price, localeInfo().currency) })}</span><div class="currency-breakdown">${renderCurrencyAmounts(person.price, [localeInfo().currency])}</div></div><button class="btn">${t('people.book')} <i>↗</i></button></div></article>`).join('');
		const toggle = query(`.tog[data-t=${kind}]`);
		const activeValue = toggle.querySelector('[aria-pressed="true"]')?.dataset.v || 'all';
		const filters = [['all', 'people.all'], ['f', 'people.female'], ['m', 'people.male']];
		toggle.innerHTML = filters.map(([value, key]) => `<button data-v="${value}" aria-pressed="${value === activeValue}">${t(key)}</button>`).join('');
		const sliderEls = [
			document.getElementById(`price-${kind}`),
			document.getElementById(`age-${kind}`),
			document.getElementById(`rating-${kind}`),
		];
		sliderEls.forEach((slider) => slider.addEventListener('input', () => applyPeopleFilter(kind)));
		applyPeopleFilter(kind);
	});
}

document.querySelectorAll('.tog').forEach((toggle) => toggle.addEventListener('click', (event) => {
	const button = event.target.closest('button');
	if (!button) return;
	[...toggle.children].forEach((item) => item.setAttribute('aria-pressed', item === button));
	applyPeopleFilter(toggle.dataset.t);
}));

const paymentMethods = [
	['payments.card', 'payments.cardDescription', 'atmcard.png'],
	['payments.bkash', 'payments.bkashDescription', 'bkash.png'],
	['payments.googlePay', 'payments.googlePayDescription', 'gpay.png'],
	['payments.applePay', 'payments.applePayDescription', 'applepay.png'],
	['payments.arrival', 'payments.arrivalDescription', 'cash.png'],
];
function renderPaymentOptions() {
	const activeIndex = [...paymentList.children].findIndex((item) => item.getAttribute('aria-pressed') === 'true');
	paymentList.innerHTML = paymentMethods.map(([nameKey, descriptionKey, icon], index) => `<button class="pm" aria-pressed="${index === (activeIndex < 0 ? 0 : activeIndex)}"><div class="ic"><img src="/assets/icons/payment/${icon}" alt="" aria-hidden="true"></div><b>${t(nameKey)}</b><span>${t(descriptionKey)}</span></button>`).join('');
}
renderPaymentOptions();
paymentList.addEventListener('click', (event) => {
	const button = event.target.closest('.pm');
	if (button) [...paymentList.children].forEach((item) => item.setAttribute('aria-pressed', item === button));
});
socialList.innerHTML = [['WhatsApp', 'WA'], ['Google', 'G'], ['Facebook', 'f'], ['Telegram', 'T']].map(([name, icon]) => `<button><span class="ic">${icon}</span>${name}</button>`).join('');

addEventListener('scroll', () => {
	const position = frameImage.parentElement.getBoundingClientRect();
	const progress = Math.min(1, Math.max(0, 1 - position.top / innerHeight));
	frameImage.style.transform = `scale(${1 + progress * 0.15})`;
}, { passive: true });
document.querySelectorAll('img[src*="unsplash"]').forEach((image) => {
	image.onerror = () => image.removeAttribute('src');
});

languageTrigger.addEventListener('click', () => {
	const isOpen = !languageMenu.hidden;
	languageMenu.hidden = isOpen;
	languageTrigger.setAttribute('aria-expanded', String(!isOpen));
});

document.addEventListener('click', (event) => {
	if (!languageMenu || !languageTrigger) return;
	if (!languagePicker.contains(event.target)) {
		languageMenu.hidden = true;
		languageTrigger.setAttribute('aria-expanded', 'false');
	}
});

languageMenu.addEventListener('click', (event) => {
	const option = event.target.closest('.lang-option');
	if (!option) return;
	languageSelect.value = option.dataset.lang;
	languageSelect.dispatchEvent(new Event('change'));
	languageMenu.hidden = true;
	languageTrigger.setAttribute('aria-expanded', 'false');
});

languageSelect.addEventListener('change', () => {
	const language = languageSelect.value;
	try {
		localStorage.setItem('guesthouse-language', language);
	} catch {
		// The selected language still applies for this page view.
	}
	i18n.changeLanguage(language);
});
i18n.on('languageChanged', () => {
	applyTranslations();
	updateSearchSummary();
	renderSuggestions(destinationInput.value);
	if (!searchPopover.hidden && activeSearchPanel === 'dates') renderCalendar();
	renderDestinationCards();
	renderFeatureRows();
	renderPeopleCards();
	renderPaymentOptions();
});

applyTranslations();
renderDestinationCards();
renderFeatureRows();
renderPeopleCards();
loadCurrencyRates();