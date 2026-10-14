import languagesData from './languages.json';
import resourcesData from './locales.json';
import { dashboardMessages } from './dashboard-locales.js';

export const languages = languagesData;

export const resources = Object.fromEntries(
	languagesData.map(({ code }) => {
		const base = resourcesData[code]?.translation || {};
		const extra = dashboardMessages[code] || dashboardMessages.en || {};
		return [
			code,
			{
				translation: {
					...base,
					...extra,
					nav: {
						...(base.nav || {}),
						...(extra.nav || {})
					},
					dashboard: {
						...(base.dashboard || {}),
						...(extra.dashboard || {}),
						signOut: extra.nav?.signOut || base.nav?.signOut || 'Sign Out'
					},
					schedModal: {
						...(base.schedModal || {}),
						...(extra.schedModal || {})
					},
					payModal: {
						...(base.payModal || {}),
						...(extra.payModal || {})
					},
					locModal: {
						...(base.locModal || {}),
						...(extra.locModal || {})
					},
					hostModal: {
						...(base.hostModal || {}),
						...(extra.hostModal || {})
					},
					authModal: {
						...(base.authModal || {}),
						...(extra.authModal || {})
					}
				}
			}
		];
	})
);
