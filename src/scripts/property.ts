import i18next from 'i18next';
import { animate } from 'motion';
import { languages, resources } from '../i18n/locales.js';
import { propertyMessages } from '../i18n/property-locales.js';

const localizedResources = Object.fromEntries(languages.map(({ code }) => {
	const languageCode = code as keyof typeof resources;
	return [languageCode, {
	translation: {
		...resources[languageCode].translation,
		property: propertyMessages[languageCode] || propertyMessages.en,
	},
}];
})) as unknown as typeof resources;
const propertyI18n = i18next.createInstance();
let savedLanguage: string | null = null;
try {
	savedLanguage = localStorage.getItem('guesthouse-language');
} catch {
	// Language selection still works for the current page view.
}
const initialLanguage = languages.find(({ code }) => code === savedLanguage)?.code || 'en';
propertyI18n.init({ lng: initialLanguage, fallbackLng: 'en', resources: localizedResources, interpolation: { escapeValue: false }, initAsync: false });
const tProperty = (key: string, options?: Record<string, unknown>) => {
	const normalizedKey = key.replace(/^property\./, '');
	return String(propertyI18n.t(`property.${normalizedKey}`, options));
};

function getElement<T extends HTMLElement>(selector: string): T {
	const element = document.querySelector<T>(selector);
	if (!element) throw new Error(`Missing property page element: ${selector}`);
	return element;
}

const getElements = <T extends HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const languageSelect = getElement<HTMLSelectElement>('[data-property-language]');

function translationOptions(element: HTMLElement): Record<string, unknown> {
	const options: Record<string, unknown> = {};
	if (element.dataset.propertyCount) options.count = Number(element.dataset.propertyCount);
	if (element.dataset.propertyName) options.name = element.dataset.propertyName;
	if (element.dataset.propertyCity) options.city = element.dataset.propertyCity;
	if (element.dataset.propertyArea) options.area = element.dataset.propertyArea;
	if (element.dataset.propertyAlt) options.alt = element.dataset.propertyAlt;
	return options;
}

function applyPropertyLanguage() {
	const locale = languages.find(({ code }) => code === propertyI18n.language) || languages[0];
	document.documentElement.lang = locale.htmlLang;
	languageSelect.value = locale.code;
	document.querySelectorAll<HTMLElement>('[data-property-i18n]').forEach((element) => {
		element.textContent = tProperty(element.dataset.propertyI18n || '', translationOptions(element));
	});
	document.querySelectorAll<HTMLElement>('[data-property-aria]').forEach((element) => {
		element.setAttribute('aria-label', tProperty(element.dataset.propertyAria || '', translationOptions(element)));
	});
	const page = document.querySelector<HTMLElement>('.property-page');
	if (page) {
		if (page.dataset.currentName) document.title = `${page.dataset.currentName} | GuesthouseBD`;
		const capacity = Number(page.dataset.guestCapacity);
		const bedrooms = Number(page.dataset.bedrooms);
		const bathrooms = Number(page.dataset.bathrooms);
		const facts = [
			capacity ? tProperty(capacity === 1 ? 'guestsOne' : 'guestsOther', { count: capacity }) : '',
			bedrooms ? tProperty('bedroomsCount', { count: bedrooms }) : '',
			bathrooms ? tProperty('bathsCount', { count: bathrooms }) : '',
		].filter(Boolean);
		setText('[data-stay-facts]', facts.join(' · ') || tProperty('askSleeping'));
		if (capacity || bedrooms) setText('[data-stay-room-summary]', capacity && bedrooms
			? tProperty('roomSummary', { bedrooms, guests: capacity })
			: bedrooms ? tProperty('bedroomsCount', { count: bedrooms }) : tProperty('guestsOther', { count: capacity }));
	}
	document.querySelectorAll<HTMLElement>('[data-review-count]').forEach((element) => {
		const count = Number(element.dataset.reviewCount);
		element.textContent = element.hasAttribute('data-rating-summary')
			? tProperty('ratingSummary', { rating: element.dataset.rating, count })
			: tProperty(count === 1 ? 'reviewsOne' : 'reviewsOther', { count });
	});
	const saveButton = document.querySelector<HTMLButtonElement>('[data-save]');
	if (saveButton) {
		const saved = saveButton.getAttribute('aria-pressed') === 'true';
		saveButton.setAttribute('aria-label', tProperty(saved ? 'removeSaved' : 'saveStay'));
		setText('[data-save-label]', tProperty(saved ? 'saved' : 'save'));
	}
}

languageSelect.addEventListener('change', () => {
	const nextLanguage = languages.find(({ code }) => code === languageSelect.value);
	if (!nextLanguage) return;
	try {
		localStorage.setItem('guesthouse-language', nextLanguage.code);
	} catch {
		// The selected language still applies for this page view.
	}
	propertyI18n.changeLanguage(nextLanguage.code).then(() => {
		applyPropertyLanguage();
		updateBooking();
	});
});

const animateIn = (element: Element | null, options: { duration?: number; delay?: number } = {}) => {
	if (reducedMotion.matches || !element) return;
	animate(element, { opacity: [0, 1], y: [14, 0] }, { duration: 0.45, ease: 'easeOut', ...options });
};

const revealObserver = new IntersectionObserver((entries, observer) => {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;
		animateIn(entry.target);
		observer.unobserve(entry.target);
	}
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('[data-reveal]').forEach((section) => revealObserver.observe(section));
animateIn(document.querySelector('.property-heading'), { duration: 0.5 });
animateIn(document.querySelector('.photo-gallery'), { delay: 0.08, duration: 0.6 });

const galleryDialog = getElement<HTMLDialogElement>('#gallery-dialog');
const galleryImage = getElement<HTMLImageElement>('#gallery-image');
const galleryCaption = getElement<HTMLElement>('#gallery-caption');
const galleryCount = getElement<HTMLElement>('#gallery-count');
const galleryPhotos = getElements<HTMLButtonElement>('.photo-tile').map((tile) => {
	const image = tile.querySelector('img');
	if (!image) throw new Error('A property gallery tile is missing its image.');
	return { src: image.src, alt: image.alt };
});
const galleryThumbs = getElements<HTMLButtonElement>('[data-gallery-select]');
let activePhoto = 0;

function selectPhoto(index: number) {
	activePhoto = (index + galleryPhotos.length) % galleryPhotos.length;
	const photo = galleryPhotos[activePhoto];
	galleryImage.src = photo.src;
	galleryImage.alt = photo.alt;
	galleryCaption.textContent = photo.alt;
	galleryCount.textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${galleryPhotos.length}`;
	galleryThumbs.forEach((button, buttonIndex) => button.setAttribute('aria-current', String(buttonIndex === activePhoto)));
	animateIn(galleryImage, { duration: 0.25 });
}

getElements<HTMLButtonElement>('[data-open-gallery]').forEach((button) => button.addEventListener('click', () => {
	selectPhoto(Number(button.dataset.galleryIndex));
	galleryDialog.showModal();
	animateIn(galleryDialog.querySelector('.gallery-stage'), { duration: 0.3 });
}));
getElement<HTMLButtonElement>('[data-close-gallery]').addEventListener('click', () => galleryDialog.close());
getElement<HTMLButtonElement>('[data-gallery-prev]').addEventListener('click', () => selectPhoto(activePhoto - 1));
getElement<HTMLButtonElement>('[data-gallery-next]').addEventListener('click', () => selectPhoto(activePhoto + 1));
galleryThumbs.forEach((button) => button.addEventListener('click', () => selectPhoto(Number(button.dataset.gallerySelect))));
galleryDialog.addEventListener('click', (event) => { if (event.target === galleryDialog) galleryDialog.close(); });
galleryDialog.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowRight') selectPhoto(activePhoto + 1);
	if (event.key === 'ArrowLeft') selectPhoto(activePhoto - 1);
});

const amenitiesDialog = document.querySelector<HTMLDialogElement>('#amenities-dialog');
const openAmenitiesButton = document.querySelector<HTMLButtonElement>('[data-open-amenities]');
const closeAmenitiesButton = document.querySelector<HTMLButtonElement>('[data-close-amenities]');
if (amenitiesDialog && openAmenitiesButton && closeAmenitiesButton) {
	openAmenitiesButton.addEventListener('click', () => amenitiesDialog.showModal());
	closeAmenitiesButton.addEventListener('click', () => amenitiesDialog.close());
	amenitiesDialog.addEventListener('click', (event) => { if (event.target === amenitiesDialog) amenitiesDialog.close(); });
}

const savedButton = getElement<HTMLButtonElement>('[data-save]');
savedButton.addEventListener('click', () => {
	const saved = savedButton.getAttribute('aria-pressed') !== 'true';
	savedButton.setAttribute('aria-pressed', String(saved));
	savedButton.setAttribute('aria-label', tProperty(saved ? 'removeSaved' : 'saveStay'));
	getElement<HTMLElement>('[data-save-label]').textContent = tProperty(saved ? 'saved' : 'save');
	getElement<HTMLElement>('.save-heart').textContent = saved ? '♥' : '♡';
	if (!reducedMotion.matches) animate(savedButton, { scale: [1, 0.92, 1.08, 1] }, { duration: 0.35, ease: 'easeOut' });
});

const toast = getElement<HTMLElement>('#toast-message');
let toastTimer: ReturnType<typeof setTimeout> | undefined;
function announce(message: string) {
	toast.textContent = message;
	toast.classList.add('is-visible');
	if (toastTimer) clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

getElement<HTMLButtonElement>('[data-share]').addEventListener('click', async () => {
	try {
		if (navigator.share) await navigator.share({ title: document.title, url: location.href });
		else if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(location.href);
			announce('Link copied');
		} else announce('Share this page using your browser controls');
	} catch (error) {
		if (!(error instanceof Error) || error.name !== 'AbortError') announce('Share this page using your browser controls');
	}
});

const descriptionToggle = getElement<HTMLButtonElement>('[data-description-toggle]');
const descriptionLabel = getElement<HTMLElement>('[data-description-label]');
const extraDescription = getElement<HTMLParagraphElement>('[data-description-extra]');
descriptionToggle.addEventListener('click', () => {
	const expanded = descriptionToggle.getAttribute('aria-expanded') !== 'true';
	descriptionToggle.setAttribute('aria-expanded', String(expanded));
	extraDescription.hidden = !expanded;
	descriptionLabel.textContent = tProperty(expanded ? 'showLess' : 'readMore');
	descriptionToggle.lastElementChild?.replaceChildren(expanded ? '↑' : '↓');
	if (expanded) animateIn(extraDescription, { duration: 0.3 });
});

const checkIn = getElement<HTMLInputElement>('#check-in');
const checkOut = getElement<HTMLInputElement>('#check-out');
const dateError = getElement<HTMLParagraphElement>('#date-error');
const guestNumber = getElement<HTMLOutputElement>('#guest-number');
const bookingConfig = getElement<HTMLElement>('.property-page');
const bookingPanel = getElement<HTMLElement>('.reservation-card');
const headerDateSummary = document.querySelector<HTMLElement>('[data-header-dates]');
const nightlyPrice = Number(bookingConfig.dataset.propertyRate);
const originalNightlyPrice = Number(bookingConfig.dataset.propertyOriginalRate);
const defaultNights = Number(bookingConfig.dataset.defaultNights);
const maxGuests = Number(bookingConfig.dataset.maxGuests);
let guests = Number(bookingConfig.dataset.defaultGuests);
const localeInfo = () => languages.find(({ code }) => code === propertyI18n.language) || languages[0];
const money = (amount: number) => new Intl.NumberFormat(localeInfo().intl, { style: 'currency', currency: 'USD', maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
const setText = (selector: string, value: string) => {
	document.querySelectorAll<HTMLElement>(selector).forEach((element) => { element.textContent = value; });
};
const dateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const addDays = (dateString: string, days: number) => {
	const date = new Date(`${dateString}T12:00:00`);
	date.setDate(date.getDate() + days);
	return dateValue(date);
};
const today = dateValue(new Date());
checkIn.min = today;
if (checkIn.value < today) {
	checkIn.value = addDays(today, 1);
	checkOut.value = addDays(checkIn.value, defaultNights);
}

const scrollToElement = (element: Element) => element.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
document.querySelector('[data-focus-location]')?.addEventListener('click', () => scrollToElement(getElement('#location')));
document.querySelector('[data-focus-checkin]')?.addEventListener('click', () => {
	scrollToElement(bookingPanel);
	checkIn.focus({ preventScroll: true });
});
document.querySelector('[data-focus-guests]')?.addEventListener('click', () => {
	scrollToElement(bookingPanel);
	document.querySelector<HTMLButtonElement>('[data-guest-step="1"]')?.focus({ preventScroll: true });
});
document.querySelector('[data-jump-booking]')?.addEventListener('click', () => {
	scrollToElement(bookingPanel);
	checkIn.focus({ preventScroll: true });
});

function updateBooking() {
	checkOut.min = checkIn.value ? addDays(checkIn.value, 1) : today;
	const start = new Date(`${checkIn.value}T00:00:00`);
	const end = new Date(`${checkOut.value}T00:00:00`);
	const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
	const original = nights * originalNightlyPrice;
	const total = nights * nightlyPrice;
	const discount = original - total;
	const guestLabel = tProperty(guests === 1 ? 'guestsOne' : 'guestsOther', { count: guests });
	const locale = localeInfo().intl;
	setText('[data-price-total]', money(total));
	setText('[data-price-nights]', tProperty('nightsSummary', { count: nights, unit: tProperty(nights === 1 ? 'nightOne' : 'nightOther') }));
	setText('[data-price-original]', money(original));
	setText('[data-nightly-price]', money(originalNightlyPrice));
	setText('[data-night-count]', String(nights));
	setText('[data-night-unit]', tProperty(nights === 1 ? 'nightOne' : 'nightOther'));
	setText('[data-subtotal]', money(original));
	setText('[data-discount]', `−${money(discount)}`);
	setText('#guest-count', guestLabel);
	guestNumber.textContent = String(guests);
	setText('[data-header-guests]', guestLabel);
	if (headerDateSummary) {
		const shortDate = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' });
		setText('[data-header-dates]', `${shortDate.format(start)} – ${shortDate.format(end)}`);
	}
	setText('[data-confirm-dates]', `${new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(start)} – ${new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(end)} · ${nights} ${tProperty(nights === 1 ? 'nightOne' : 'nightOther')}`);
	setText('[data-confirm-guests]', guestLabel);
	setText('[data-confirm-total]', money(total));
	dateError.hidden = end > start;
}

checkIn.addEventListener('change', () => {
	if (checkOut.value <= checkIn.value) checkOut.value = addDays(checkIn.value, 1);
	updateBooking();
});
checkOut.addEventListener('change', updateBooking);
getElements<HTMLButtonElement>('[data-guest-step]').forEach((button) => button.addEventListener('click', () => {
	guests = Math.max(1, Math.min(maxGuests, guests + Number(button.dataset.guestStep)));
	updateBooking();
}));
applyPropertyLanguage();
updateBooking();

const reserveDialog = getElement<HTMLDialogElement>('#reserve-dialog');
getElements<HTMLButtonElement>('[data-reserve]').forEach((button) => button.addEventListener('click', () => {
	if (new Date(`${checkOut.value}T00:00:00`) <= new Date(`${checkIn.value}T00:00:00`)) {
		dateError.hidden = false;
		checkOut.focus();
		return;
	}
	reserveDialog.showModal();
	animateIn(reserveDialog.querySelector('.reserve-confirmation'), { duration: 0.35 });
}));
getElements<HTMLButtonElement>('[data-close-reservation]').forEach((button) => button.addEventListener('click', () => reserveDialog.close()));
reserveDialog.addEventListener('click', (event) => { if (event.target === reserveDialog) reserveDialog.close(); });
document.querySelector<HTMLButtonElement>('[data-fee-note]')?.addEventListener('click', () => announce('The displayed total includes the stay discount and fees.'));