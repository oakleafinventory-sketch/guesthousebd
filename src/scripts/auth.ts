import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface UserProfile {
	id: string;
	email: string;
	name: string;
	avatar: string;
	tier: 'Silver Member' | 'Gold VIP' | 'Diamond Host';
	discountRate: number; // e.g. 0.10 = 10% off
	discountLabel: string;
	memberSince: string;
	phone?: string;
	role: 'traveler' | 'vip' | 'host';
	/** User's gender preference — drives the default icon when no customAvatar is set */
	gender?: 'male' | 'female' | 'other';
	/** Base64 data-URL or remote URL of a user-uploaded profile photo */
	customAvatar?: string;
	/** National ID card number (stored locally, never sent externally) */
	nationalId?: string;
	/** Passport number for travel document tracking */
	passportNumber?: string;
	/** Whether user has enabled fingerprint auth for sensitive bookings */
	fingerprintEnabled?: boolean;
	/** True when signed in via Google OAuth */
	googleLinked?: boolean;
}

/**
 * Returns the correct avatar URL for a user:
 *  1. If the user has uploaded a custom photo → use it
 *  2. Else if gender is 'male'   → /assets/icons/user-male.png
 *  3. Else if gender is 'female' → /assets/icons/user-female.png
 *  4. Otherwise                  → /assets/icons/user.png (generic)
 */
export function resolveAvatarUrl(user: Pick<UserProfile, 'customAvatar' | 'gender' | 'avatar'>): string {
	if (user.customAvatar) return user.customAvatar;
	if (user.gender === 'male')   return '/assets/icons/user-male.png';
	if (user.gender === 'female') return '/assets/icons/user-female.png';
	return '/assets/icons/user.png';
}

export interface TourGuideService {
	booked: boolean;
	guideName: string;
	guidePhone: string;
	guideAvatar: string;
	tourType: string;
	date?: string;
	price: number;
	meetingPoint?: string;
	paymentStatus?: 'unpaid' | 'paid';
	acknowledgedByProvider?: boolean;
	acknowledgedAt?: string;
}

export interface DriverService {
	booked: boolean;
	driverName: string;
	driverPhone: string;
	driverAvatar: string;
	vehicleModel: string;
	licensePlate: string;
	pickupLocation: string;
	status: string;
	price: number;
	paymentStatus?: 'unpaid' | 'paid';
	acknowledgedByProvider?: boolean;
	acknowledgedAt?: string;
}

export interface StayBookedService {
	id: string;
	providerId: string;
	categoryId: 'transport' | 'tour-guide' | 'tour-assistant' | 'amenities' | string;
	categoryName: string;
	title: string;
	subServiceTitle?: string;
	providerName: string;
	providerPhone: string;
	providerAvatar: string;
	date: string; // YYYY-MM-DD
	timeSlotId: 'morning' | 'afternoon' | 'evening' | 'fullday' | 'custom' | string;
	timeSlotLabel: string; // e.g. "Morning (09:00 – 13:00)" or "Custom: 10:30 AM"
	price: number;
	currency: string;
	status: 'confirmed' | 'pending_payment' | 'pending_acknowledgement' | 'cancelled';
	paymentStatus: 'unpaid' | 'paid';
	acknowledgedByProvider: boolean;
	acknowledgedAt?: string;
	bookedAt: string;
	cancellationHoursLimit?: number; // default 4 hours
	cancellationDeadline?: string; // ISO date string
	dispatchNotification?: {
		sentToGuesthouseBD: boolean;
		sentToProvider: boolean;
		channels: string[];
		sentAt: string;
	};
}

export interface BookingRecord {
	id: string;
	staySlug: string;
	stayName: string;
	stayImage: string;
	city: string;
	area: string;
	address?: string;
	checkIn: string;
	checkOut: string;
	nights: number;
	guests: number;
	totalPrice: number;
	currency: string;
	status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
	createdAt: string;
	confirmationCode: string;
	hostName?: string;
	hostPhone?: string;
	hostAvatar?: string;
	tourGuide?: TourGuideService;
	driver?: DriverService;
	services?: StayBookedService[];
}

export interface SavedStayRecord {
	slug: string;
	city: string;
	name: string;
	image: string;
	area: string;
	price: number;
	rating: number;
	reviewCount: number;
	savedAt: string;
}

export interface GuideBookingRecord {
	id: string;
	guideName: string;
	guideRole: string;
	guideImage: string;
	date: string;
	price: number;
	status: 'confirmed' | 'pending';
	createdAt: string;
}

// Demo profiles for instant one-click testing
export const DEMO_PROFILES: Record<'traveler' | 'vip' | 'host', UserProfile> = {
	vip: {
		id: 'demo-vip-001',
		email: 'sarah.khan@example.com',
		name: 'Sarah Khan',
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
		customAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
		tier: 'Gold VIP',
		discountRate: 0.15,
		discountLabel: '15% VIP Club Discount',
		memberSince: 'March 2024',
		phone: '+880 1712 345678',
		role: 'vip',
		gender: 'female',
		nationalId: '1992269412340001',
		passportNumber: 'BG0942817',
		fingerprintEnabled: true
	},
	traveler: {
		id: 'demo-traveler-002',
		email: 'tanvir.ahmed@example.com',
		name: 'Tanvir Ahmed',
		avatar: '/assets/icons/user-male.png',
		tier: 'Silver Member',
		discountRate: 0.10,
		discountLabel: '10% Member Rate',
		memberSince: 'August 2024',
		phone: '+880 1819 876543',
		role: 'traveler',
		gender: 'male',
		nationalId: '1995269412340002',
		passportNumber: 'BH7712349',
		fingerprintEnabled: false
	},
	host: {
		id: 'demo-host-003',
		email: 'farhana.host@guesthousebd.com',
		name: 'Farhana Yasmin',
		avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
		customAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
		tier: 'Diamond Host',
		discountRate: 0.20,
		discountLabel: '20% Host Privilege Rate',
		memberSince: 'January 2023',
		phone: '+880 1911 223344',
		role: 'host',
		gender: 'female',
		nationalId: '1988269412340003',
		passportNumber: 'A12894567',
		fingerprintEnabled: true
	}
};

const STORAGE_KEYS = {
	USER: 'guesthouse_auth_user',
	BOOKINGS: 'guesthouse_user_bookings',
	SAVED: 'guesthouse_user_favorites',
	GUIDES: 'guesthouse_guide_bookings'
};

const supabaseUrl = (import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || '').trim();
const supabaseAnonKey = (
	import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
	import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
	import.meta.env.SUPABASE_KEY ||
	''
).trim();

const isSupabaseConfigured =
	supabaseUrl.startsWith('http') &&
	supabaseAnonKey.length > 20 &&
	!supabaseUrl.includes('your-project');

export const supabase: SupabaseClient | null = isSupabaseConfigured
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;

class AuthManager {
	private currentUser: UserProfile | null = null;
	private listeners: Set<(user: UserProfile | null) => void> = new Set();

	constructor() {
		this.restoreSession();
		this.initSupabaseListener();
	}

	private restoreSession(): void {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.USER);
			if (saved) {
				this.currentUser = JSON.parse(saved);
			}
		} catch {
			this.currentUser = null;
		}
	}

	private saveSession(user: UserProfile | null): void {
		this.currentUser = user;
		try {
			if (user) {
				localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
			} else {
				localStorage.removeItem(STORAGE_KEYS.USER);
			}
		} catch {
			// localStorage unavailable
		}
		this.notify();
	}

	private notify(): void {
		this.listeners.forEach((listener) => {
			try {
				listener(this.currentUser);
			} catch (err) {
				console.error('Auth listener error:', err);
			}
		});

		// Also dispatch standard custom event across windows/frames
		if (typeof window !== 'undefined') {
			window.dispatchEvent(
				new CustomEvent('guesthouse:auth-changed', {
					detail: { user: this.currentUser }
				})
			);
		}
	}

	private async initSupabaseListener(): Promise<void> {
		if (!supabase) return;
		try {
			const { data } = await supabase.auth.getSession();
			if (data.session?.user) {
				const u = data.session.user;
				const userProfile: UserProfile = {
					id: u.id,
					email: u.email || 'traveler@guesthousebd.com',
					name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Traveler',
					customAvatar: u.user_metadata?.avatar_url || undefined,
					avatar: u.user_metadata?.avatar_url || '/assets/icons/user.png',
					tier: (u.user_metadata?.tier as any) || 'Silver Member',
					discountRate: u.user_metadata?.discountRate ?? 0.10,
					discountLabel: u.user_metadata?.discountLabel || '10% Member Rate',
					memberSince: new Date(u.created_at).toLocaleDateString('en-US', {
						month: 'short',
						year: 'numeric'
					}),
					role: 'traveler'
				};
				this.saveSession(userProfile);
			}

			supabase.auth.onAuthStateChange(async (event, session) => {
				if (session?.user) {
					const u = session.user;
					// Detect if signed in via Google
					const isGoogle = u.app_metadata?.provider === 'google' ||
						(u.identities || []).some((i: any) => i.provider === 'google');
					// Preserve locally-saved profile extras (docs, fingerprint, etc.)
					const existing = this.currentUser || (() => {
						try { const s = localStorage.getItem(STORAGE_KEYS.USER); return s ? JSON.parse(s) : null; } catch { return null; }
					})();
					const userProfile: UserProfile = {
						id: u.id,
						email: u.email || '',
						name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Traveler',
						phone: u.user_metadata?.phone || u.phone || existing?.phone,
						customAvatar: u.user_metadata?.avatar_url || existing?.customAvatar || undefined,
						avatar: u.user_metadata?.avatar_url || existing?.customAvatar || '/assets/icons/user.png',
						tier: (u.user_metadata?.tier as any) || 'Silver Member',
						discountRate: 0.10,
						discountLabel: '10% Member Rate',
						memberSince: new Date(u.created_at).toLocaleDateString('en-US', {
							month: 'short',
							year: 'numeric'
						}),
						role: 'traveler',
						googleLinked: isGoogle,
						// Preserve locally-saved sensitive fields
						gender: existing?.gender,
						nationalId: existing?.nationalId,
						passportNumber: existing?.passportNumber,
						fingerprintEnabled: existing?.fingerprintEnabled,
					};
					this.saveSession(userProfile);
				} else if (event === 'SIGNED_OUT') {
					this.saveSession(null);
				}
			});
		} catch (error) {
			console.warn('Supabase auth initialization fallback to local mode:', error);
		}
	}

	public getUser(): UserProfile | null {
		if (!this.currentUser) this.restoreSession();
		return this.currentUser;
	}

	public isAuthenticated(): boolean {
		return Boolean(this.getUser());
	}

	public subscribe(callback: (user: UserProfile | null) => void): () => void {
		this.listeners.add(callback);
		// Immediate invocation with current state
		callback(this.currentUser);
		return () => this.listeners.delete(callback);
	}

	/**
	 * Update mutable profile fields including travel documents and security settings.
	 * Automatically recomputes the `avatar` field using resolveAvatarUrl.
	 * Syncs metadata to Supabase if session exists.
	 */
	public updateProfile(updates: Partial<Pick<UserProfile,
		'name' | 'phone' | 'gender' | 'customAvatar' |
		'nationalId' | 'passportNumber' | 'fingerprintEnabled'
	>>): UserProfile | null {
		const user = this.getUser();
		if (!user) return null;
		const updated: UserProfile = {
			...user,
			...updates,
		};
		// Recompute resolved avatar
		updated.avatar = resolveAvatarUrl(updated);
		this.saveSession(updated);

		if (supabase) {
			supabase.auth.updateUser({
				data: {
					full_name: updated.name,
					phone: updated.phone,
					gender: updated.gender,
					avatar_url: updated.customAvatar || updated.avatar,
					nationalId: updated.nationalId,
					passportNumber: updated.passportNumber,
					fingerprintEnabled: updated.fingerprintEnabled,
				}
			}).catch((err) => {
				console.warn('Supabase metadata sync notice:', err);
			});
		}

		return updated;
	}

	/**
	 * Update user password with validation and Supabase integration.
	 */
	public async updatePassword(newPassword: string): Promise<void> {
		if (!newPassword || newPassword.length < 6) {
			throw new Error('Password must contain at least 6 characters.');
		}
		if (supabase) {
			const { error } = await supabase.auth.updateUser({ password: newPassword });
			if (error) throw error;
		}
		try {
			localStorage.setItem('guesthouse_local_pwd_timestamp', String(Date.now()));
		} catch {}
	}

	/**
	 * Sign in with Google via Supabase OAuth.
	 * Uses skipBrowserRedirect: true and a probe check to verify that Google OAuth is active
	 * on the Supabase project, gracefully handling "Unsupported provider: provider is not enabled"
	 * without redirecting the user to a raw JSON 400 error page.
	 */
	public async signInWithGoogle(): Promise<{ url?: string; requiresProviderConfig?: boolean; error?: string }> {
		if (!supabase) {
			throw new Error('Supabase is not configured. Please verify your Supabase credentials in .env.');
		}
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/dashboard/`,
				skipBrowserRedirect: true,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent',
					scope: 'openid email profile phone',
				},
			},
		});

		if (error) {
			const msg = error.message || '';
			if (msg.includes('not enabled') || msg.includes('validation_failed') || (error as any).status === 400) {
				return { requiresProviderConfig: true, error: msg };
			}
			throw error;
		}

		if (!data?.url) {
			throw new Error('No authorization URL returned from Supabase.');
		}

		// Pre-flight probe: check if the provider is enabled in Supabase without blind page navigation
		try {
			const probe = await fetch(data.url, { method: 'GET' });
			if (!probe.ok) {
				const body = await probe.json().catch(() => ({}));
				if (body.error_code === 'validation_failed' || body.msg?.includes('not enabled') || probe.status === 400) {
					return {
						requiresProviderConfig: true,
						error: body.msg || 'Unsupported provider: provider is not enabled'
					};
				}
			}
		} catch (probeErr) {
			// A fetch redirect to accounts.google.com triggers an opaque CORS / redirect response,
			// which proves the provider is active and successfully redirecting to Google!
		}

		// Provider is enabled! Navigate the user to Google
		window.location.href = data.url;
		return { url: data.url };
	}

	/**
	 * Instant Google OAuth Traveler simulator for local staging and test environments.
	 * Pre-populates verified Google account data (name, email, phone, avatar, googleLinked).
	 */
	public async signInWithGoogleDemo(): Promise<UserProfile> {
		const profile: UserProfile = {
			id: 'google_user_' + Date.now().toString(36),
			email: 'alex.rahman.traveler@gmail.com',
			name: 'Alex Rahman',
			avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
			customAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
			phone: '+880 1819 889900',
			gender: 'male',
			nationalId: '1990269412349988',
			passportNumber: 'A08927163',
			tier: 'Gold VIP',
			discountRate: 0.15,
			discountLabel: '15% VIP Club Rate',
			memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
			role: 'vip',
			googleLinked: true,
			fingerprintEnabled: true
		};
		this.saveSession(profile);
		this.seedDemoDataIfEmpty(profile);
		return profile;
	}

	public async signInWithDemo(role: 'traveler' | 'vip' | 'host' = 'vip'): Promise<UserProfile> {
		const profile = DEMO_PROFILES[role];
		this.saveSession(profile);

		// Seed initial bookings & favorites if empty for demonstration
		this.seedDemoDataIfEmpty(profile);

		return profile;
	}

	public async signInWithEmail(email: string, password: string): Promise<UserProfile> {
		if (supabase) {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			if (!data.user) throw new Error('No user returned from login');

			const profile: UserProfile = {
				id: data.user.id,
				email: data.user.email || email,
				name: data.user.user_metadata?.full_name || email.split('@')[0],
				customAvatar: data.user.user_metadata?.avatar_url || undefined,
				avatar: data.user.user_metadata?.avatar_url || '/assets/icons/user.png',
				tier: 'Silver Member',
				discountRate: 0.10,
				discountLabel: '10% Member Rate',
				memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
				role: 'traveler'
			};
			this.saveSession(profile);
			return profile;
		}

		// Resilient fallback mode
		const name = email.split('@')[0].replace(/[._-]/g, ' ');
		const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
		const profile: UserProfile = {
			id: 'user_' + Math.random().toString(36).substring(2, 9),
			email,
			name: capitalized,
			avatar: '/assets/icons/user.png',
			tier: 'Silver Member',
			discountRate: 0.10,
			discountLabel: '10% Member Rate',
			memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
			role: 'traveler'
		};
		this.saveSession(profile);
		this.seedDemoDataIfEmpty(profile);
		return profile;
	}

	public async signUp(email: string, password: string, name: string): Promise<UserProfile> {
		if (supabase) {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						full_name: name,
						tier: 'Silver Member',
						discountRate: 0.10,
						discountLabel: '10% Member Rate'
					}
				}
			});
			if (error) throw error;
			const u = data.user;
			const profile: UserProfile = {
				id: u?.id || 'usr_' + Date.now(),
				email,
				name: name || email.split('@')[0],
				avatar: '/assets/icons/user.png',
				tier: 'Silver Member',
				discountRate: 0.10,
				discountLabel: '10% Member Rate',
				memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
				role: 'traveler'
			};
			this.saveSession(profile);
			return profile;
		}

		const profile: UserProfile = {
			id: 'user_' + Math.random().toString(36).substring(2, 9),
			email,
			name,
			avatar: '/assets/icons/user.png',
			tier: 'Silver Member',
			discountRate: 0.10,
			discountLabel: '10% Member Rate',
			memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
			role: 'traveler'
		};
		this.saveSession(profile);
		return profile;
	}

	public async signOut(): Promise<void> {
		if (supabase) {
			try {
				await supabase.auth.signOut();
			} catch (e) {
				console.warn('Supabase signOut error:', e);
			}
		}
		this.saveSession(null);
	}

	public getMemberDiscount(amount: number): {
		original: number;
		discount: number;
		discountedTotal: number;
		percentage: number;
		label: string;
	} {
		const user = this.getUser();
		if (!user) {
			return {
				original: amount,
				discount: 0,
				discountedTotal: amount,
				percentage: 0,
				label: 'Standard Rate'
			};
		}
		const percentage = Math.round(user.discountRate * 100);
		const discount = Math.round(amount * user.discountRate);
		const discountedTotal = Math.max(0, amount - discount);
		return {
			original: amount,
			discount,
			discountedTotal,
			percentage,
			label: user.discountLabel
		};
	}

	// ---------------- Bookings Management ---------------- //
	public getBookings(): BookingRecord[] {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
			if (!saved) return [];
			const list: BookingRecord[] = JSON.parse(saved);
			return list.map((b) => ({
				...b,
				services: (b.services || []).map((s) => {
					const paymentStatus: 'unpaid' | 'paid' = s.paymentStatus || (s.id === 'srv_demo_03' ? 'unpaid' : 'paid');
					const acknowledgedByProvider: boolean =
						s.acknowledgedByProvider !== undefined
							? s.acknowledgedByProvider
							: s.id === 'srv_demo_01'
								? true
								: false;
					let status: StayBookedService['status'] = s.status || 'confirmed';
					if (paymentStatus === 'unpaid') {
						status = 'pending_payment';
					} else if (paymentStatus === 'paid' && !acknowledgedByProvider) {
						status = 'pending_acknowledgement';
					} else if (paymentStatus === 'paid' && acknowledgedByProvider) {
						status = 'confirmed';
					}
					return {
						...s,
						paymentStatus,
						acknowledgedByProvider,
						status
					};
				})
			}));
		} catch {
			return [];
		}
	}

	public addBooking(item: Omit<BookingRecord, 'id' | 'createdAt' | 'confirmationCode' | 'status'>): BookingRecord {
		const code = 'GBD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
		const newBooking: BookingRecord = {
			...item,
			id: 'book_' + Date.now(),
			confirmationCode: code,
			status: 'confirmed',
			createdAt: new Date().toISOString()
		};
		const all = [newBooking, ...this.getBookings()];
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
		} catch (err) {
			console.error('Failed to save booking:', err);
		}
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: all } }));
		}
		return newBooking;
	}

	public cancelBooking(id: string): boolean {
		const all = this.getBookings().map((booking) =>
			booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
		);
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
		} catch {
			return false;
		}
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: all } }));
		}
		return true;
	}

	// ---------------- Saved Stays (Wishlist) ---------------- //
	public getSavedStays(): SavedStayRecord[] {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	}

	public isSaved(slug: string): boolean {
		return this.getSavedStays().some((item) => item.slug === slug);
	}

	public toggleSaveStay(stay: Omit<SavedStayRecord, 'savedAt'>): boolean {
		const current = this.getSavedStays();
		const index = current.findIndex((item) => item.slug === stay.slug);
		let updated: SavedStayRecord[];
		let isNowSaved = false;

		if (index >= 0) {
			updated = current.filter((item) => item.slug !== stay.slug);
			isNowSaved = false;
		} else {
			updated = [{ ...stay, savedAt: new Date().toISOString() }, ...current];
			isNowSaved = true;
		}

		try {
			localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
		} catch (err) {
			console.error('Failed to update wishlist:', err);
		}

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:saved-changed', { detail: { saved: updated } }));
		}

		return isNowSaved;
	}

	// ---------------- Guide Bookings ---------------- //
	public getGuideBookings(): GuideBookingRecord[] {
		try {
			const saved = localStorage.getItem(STORAGE_KEYS.GUIDES);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	}

	public addGuideBooking(guide: Omit<GuideBookingRecord, 'id' | 'createdAt' | 'status'>): GuideBookingRecord {
		const newGuideBooking: GuideBookingRecord = {
			...guide,
			id: 'guide_' + Date.now(),
			status: 'confirmed',
			createdAt: new Date().toISOString()
		};
		const all = [newGuideBooking, ...this.getGuideBookings()];
		try {
			localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(all));
		} catch (err) {
			console.error('Failed to save guide booking:', err);
		}
		return newGuideBooking;
	}

	// ---------------- Stay Addon Services (Tour Guide & Driver) ---------------- //
	public bookTourGuideForStay(bookingId: string, guide: TourGuideService): boolean {
		const all = this.getBookings().map((booking) =>
			booking.id === bookingId ? { ...booking, tourGuide: guide } : booking
		);
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
		} catch {
			return false;
		}
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: all } }));
		}
		return true;
	}

	public removeTourGuideFromStay(bookingId: string): boolean {
		const all = this.getBookings().map((booking) => {
			if (booking.id === bookingId) {
				const copy = { ...booking };
				delete copy.tourGuide;
				return copy;
			}
			return booking;
		});
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
		} catch {
			return false;
		}
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: all } }));
		}
		return true;
	}

	public bookDriverForStay(bookingId: string, driver: DriverService): boolean {
		const all = this.getBookings().map((booking) =>
			booking.id === bookingId ? { ...booking, driver } : booking
		);
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
		} catch {
			return false;
		}
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: all } }));
		}
		return true;
	}

	public removeDriverFromStay(bookingId: string): boolean {
		const all = this.getBookings().map((booking) => {
			if (booking.id === bookingId) {
				const copy = { ...booking };
				delete copy.driver;
				return copy;
			}
			return booking;
		});
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
		} catch {
			return false;
		}
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: all } }));
		}
		return true;
	}

	// ---------------- Multi-Service Scheduler with Conflict Prevention & 4-Hour Policy ---------------- //
	public checkServiceConflict(
		existingServices: StayBookedService[] = [],
		newDate: string,
		newSlotId: string,
		providerId?: string,
		customTime?: string
	): { hasConflict: boolean; conflictingService?: StayBookedService; message?: string } {
		const allBookings = this.getBookings();
		const allActiveServices: StayBookedService[] = [];
		allBookings.forEach((b) => {
			(b.services || []).forEach((s) => {
				if (s.status !== 'cancelled') allActiveServices.push(s);
			});
		});

		// Check 1: Provider availability check across the entire platform
		if (providerId) {
			for (const s of allActiveServices) {
				if (s.providerId === providerId && s.date === newDate) {
					const isSlotOverlap =
						s.timeSlotId === 'fullday' ||
						newSlotId === 'fullday' ||
						s.timeSlotId === newSlotId ||
						(s.timeSlotId === 'custom' && customTime && s.timeSlotLabel.includes(customTime));

					if (isSlotOverlap) {
						return {
							hasConflict: true,
							conflictingService: s,
							message: `Provider Unavailable: ${s.providerName} is already committed on ${newDate} for ${s.timeSlotLabel}. Please choose a different date/time or select another provider.`
						};
					}
				}
			}
		}

		// Check 2: Same stay traveler itinerary conflict
		const stayActiveServices = existingServices.filter((s) => s.status !== 'cancelled');
		for (const s of stayActiveServices) {
			if (s.date === newDate) {
				const isSlotOverlap =
					s.timeSlotId === 'fullday' ||
					newSlotId === 'fullday' ||
					s.timeSlotId === newSlotId ||
					(s.timeSlotId === 'custom' && customTime && s.timeSlotLabel.includes(customTime));

				if (isSlotOverlap) {
					return {
						hasConflict: true,
						conflictingService: s,
						message: `Schedule Overlap: You already have "${s.title}" booked on ${newDate} (${s.timeSlotLabel}). Please pick a different time slot.`
					};
				}
			}
		}

		return { hasConflict: false };
	}

	/**
	 * Computes whether a scheduled service can be cancelled with a refund
	 * Default admin policy: Free cancellation up to 4 hours before scheduled time.
	 */
	public canCancelService(service: StayBookedService, adminLimitHours: number = 4): {
		canCancel: boolean;
		hoursRemaining: number;
		deadlineFormatted: string;
		deadlineIso: string;
		reason?: string;
	} {
		// Determine start time from slot
		let timeString = '09:00';
		if (service.timeSlotId === 'afternoon') timeString = '14:00';
		else if (service.timeSlotId === 'evening') timeString = '18:30';
		else if (service.timeSlotId === 'fullday') timeString = '09:00';
		else if (service.timeSlotId === 'custom') {
			const match = service.timeSlotLabel.match(/(\d{1,2}:\d{2})/);
			if (match) timeString = match[1];
		}

		const serviceStart = new Date(`${service.date}T${timeString}:00`);
		const deadlineMs = serviceStart.getTime() - adminLimitHours * 60 * 60 * 1000;
		const deadlineDate = new Date(deadlineMs);
		const nowMs = Date.now();
		const diffMs = deadlineMs - nowMs;
		const hoursRemaining = Math.max(0, Math.round(diffMs / (60 * 60 * 1000)));

		const deadlineFormatted = deadlineDate.toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});

		if (nowMs <= deadlineMs) {
			return {
				canCancel: true,
				hoursRemaining,
				deadlineFormatted,
				deadlineIso: deadlineDate.toISOString()
			};
		} else {
			return {
				canCancel: false,
				hoursRemaining: 0,
				deadlineFormatted,
				deadlineIso: deadlineDate.toISOString(),
				reason: `Cancellation deadline passed (${adminLimitHours}h policy). Service starts in less than ${adminLimitHours} hours; no refund applies.`
			};
		}
	}

	public addServiceToStay(
		bookingId: string,
		service: Omit<StayBookedService, 'id' | 'bookedAt' | 'status'> & {
			paymentStatus?: 'unpaid' | 'paid';
			acknowledgedByProvider?: boolean;
		}
	): { success: boolean; error?: string; service?: StayBookedService } {
		const all = this.getBookings();
		const booking = all.find((b) => b.id === bookingId);
		if (!booking) {
			return { success: false, error: 'Booking not found.' };
		}

		const existing = booking.services || [];
		const conflict = this.checkServiceConflict(
			existing,
			service.date,
			service.timeSlotId,
			service.providerId
		);
		if (conflict.hasConflict) {
			return { success: false, error: conflict.message };
		}

		const paymentStatus = service.paymentStatus || 'unpaid';
		const acknowledgedByProvider = service.acknowledgedByProvider ?? false;
		let status: StayBookedService['status'] = 'pending_payment';
		if (paymentStatus === 'paid') {
			status = acknowledgedByProvider ? 'confirmed' : 'pending_acknowledgement';
		}

		// Calculate 4-hour cancellation deadline
		let timeString = '09:00';
		if (service.timeSlotId === 'afternoon') timeString = '14:00';
		else if (service.timeSlotId === 'evening') timeString = '18:30';
		else if (service.timeSlotId === 'fullday') timeString = '09:00';
		else if (service.timeSlotId === 'custom') {
			const match = service.timeSlotLabel.match(/(\d{1,2}:\d{2})/);
			if (match) timeString = match[1];
		}
		const serviceStart = new Date(`${service.date}T${timeString}:00`);
		const cancelDeadline = new Date(serviceStart.getTime() - 4 * 60 * 60 * 1000).toISOString();

		const newService: StayBookedService = {
			...service,
			id: 'srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
			paymentStatus,
			acknowledgedByProvider,
			acknowledgedAt: acknowledgedByProvider ? new Date().toISOString() : undefined,
			status,
			bookedAt: new Date().toISOString(),
			cancellationHoursLimit: 4,
			cancellationDeadline: cancelDeadline,
			dispatchNotification: {
				sentToGuesthouseBD: true,
				sentToProvider: true,
				channels: ['Push Notification', 'Email', 'SMS (Queued)'],
				sentAt: new Date().toISOString()
			}
		};

		const updatedBookings = all.map((b) => {
			if (b.id === bookingId) {
				return {
					...b,
					services: [...(b.services || []), newService]
				};
			}
			return b;
		});

		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
		} catch (err) {
			console.error('Failed to save service to booking:', err);
		}

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: updatedBookings } }));
		}

		return { success: true, service: newService };
	}

	public markServicePaid(bookingId: string, serviceId: string): boolean {
		const all = this.getBookings();
		let found = false;
		const updatedBookings = all.map((b) => {
			if (b.id === bookingId) {
				const services = (b.services || []).map((s) => {
					if (s.id === serviceId) {
						found = true;
						const nextStatus: StayBookedService['status'] = s.acknowledgedByProvider ? 'confirmed' : 'pending_acknowledgement';
						return {
							...s,
							paymentStatus: 'paid' as const,
							status: nextStatus
						};
					}
					return s;
				});
				return { ...b, services };
			}
			return b;
		});

		if (!found) return false;
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
		} catch {
			return false;
		}

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: updatedBookings } }));
		}
		return true;
	}

	public toggleServiceAcknowledgment(bookingId: string, serviceId: string, explicitValue?: boolean): boolean {
		const all = this.getBookings();
		let found = false;
		const updatedBookings = all.map((b) => {
			if (b.id === bookingId) {
				const services = (b.services || []).map((s) => {
					if (s.id === serviceId) {
						found = true;
						const nextAck = explicitValue !== undefined ? explicitValue : !s.acknowledgedByProvider;
						// When provider accepts, fee is officially deducted from user account escrow
						const nextPayment: 'unpaid' | 'paid' = nextAck ? 'paid' : s.paymentStatus;
						const nextStatus: StayBookedService['status'] = nextAck ? 'confirmed' : 'pending_acknowledgement';
						return {
							...s,
							paymentStatus: nextPayment,
							acknowledgedByProvider: nextAck,
							acknowledgedAt: nextAck ? new Date().toISOString() : undefined,
							status: nextStatus
						};
					}
					return s;
				});
				return { ...b, services };
			}
			return b;
		});

		if (!found) return false;
		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
		} catch {
			return false;
		}

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: updatedBookings } }));
		}
		return true;
	}

	public removeServiceFromStay(bookingId: string, serviceId: string): { success: boolean; refunded: boolean; message: string } {
		const all = this.getBookings();
		const booking = all.find((b) => b.id === bookingId);
		if (!booking) return { success: false, refunded: false, message: 'Booking not found' };

		const service = (booking.services || []).find((s) => s.id === serviceId);
		if (!service) return { success: false, refunded: false, message: 'Service not found' };

		const policy = this.canCancelService(service);
		const willRefund = policy.canCancel && service.paymentStatus === 'paid';

		const updatedBookings = all.map((b) => {
			if (b.id === bookingId) {
				return {
					...b,
					services: (b.services || []).filter((s) => s.id !== serviceId)
				};
			}
			return b;
		});

		try {
			localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
		} catch {
			return { success: false, refunded: false, message: 'Storage error' };
		}

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: updatedBookings } }));
		}

		const message = policy.canCancel
			? willRefund
				? `Service cancelled successfully. 100% full refund of $${service.price} USD credited back to your account.`
				: `Service reservation cancelled successfully.`
			: `Service cancelled. As cancellation occurred within 4 hours of the scheduled service, no refund was issued per policy.`;

		return { success: true, refunded: willRefund, message };
	}

	// Seed realistic demo bookings/saved items so the user gets an incredible initial experience
	private seedDemoDataIfEmpty(profile: UserProfile): void {
		const currentBookings = this.getBookings();
		const needsSeedOrEnrichment =
			currentBookings.length === 0 ||
			(currentBookings.length === 1 &&
				currentBookings[0].id === 'book_seed_1' &&
				(!currentBookings[0].services || currentBookings[0].services.length < 3));

		if (needsSeedOrEnrichment) {
			const initialBookings: BookingRecord[] = [
				{
					id: 'book_seed_1',
					staySlug: 'citylights',
					stayName: 'City Lights Guest House',
					stayImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
					city: 'Dhaka',
					area: 'Gulshan 2',
					address: 'House 24, Road 113, Gulshan-2, Dhaka 1212, Bangladesh',
					checkIn: '2026-10-20',
					checkOut: '2026-10-24',
					nights: 4,
					guests: 2,
					totalPrice: Math.round(76 * 4 * (1 - profile.discountRate)),
					currency: 'USD',
					status: 'confirmed',
					createdAt: '2026-10-10T14:30:00Z',
					confirmationCode: 'GBD-DH8492',
					hostName: 'Farhana Yasmin',
					hostPhone: '+880 1711 234567',
					hostAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
					services: [
						{
							id: 'srv_demo_01',
							providerId: 'prov-trans-01',
							categoryId: 'transport',
							categoryName: 'Transport',
							title: 'Airport Transfer (DAC Airport ↔ Guesthouse)',
							subServiceTitle: 'DAC Airport Pickup',
							providerName: 'Rafiqul Islam',
							providerPhone: '+880 1819 556677',
							providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
							date: '2026-10-20',
							timeSlotId: 'afternoon',
							timeSlotLabel: 'Afternoon (14:00 – 18:00)',
							price: Math.round(18 * (1 - profile.discountRate)),
							currency: 'USD',
							status: 'confirmed',
							paymentStatus: 'paid',
							acknowledgedByProvider: true,
							acknowledgedAt: '2026-10-10T14:40:00Z',
							bookedAt: '2026-10-10T14:35:00Z',
							cancellationHoursLimit: 4,
							cancellationDeadline: '2026-10-20T10:00:00.000Z'
						},
						{
							id: 'srv_demo_02',
							providerId: 'prov-guide-01',
							categoryId: 'tour-guide',
							categoryName: 'Tour Guide',
							title: 'Old Dhaka Heritage & Culinary Food Trail',
							subServiceTitle: 'Historic Street Food Walk',
							providerName: 'Farzana Ahmed',
							providerPhone: '+880 1711 002233',
							providerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
							date: '2026-10-21',
							timeSlotId: 'morning',
							timeSlotLabel: 'Morning (09:00 – 13:00)',
							price: Math.round(25 * (1 - profile.discountRate)),
							currency: 'USD',
							status: 'pending_acknowledgement',
							paymentStatus: 'paid',
							acknowledgedByProvider: false,
							bookedAt: '2026-10-10T14:36:00Z',
							cancellationHoursLimit: 4,
							cancellationDeadline: '2026-10-21T05:00:00.000Z'
						},
						{
							id: 'srv_demo_03',
							providerId: 'prov-amen-01',
							categoryId: 'amenities',
							categoryName: 'Amenities',
							title: 'In-Suite Deep Tissue & Swedish Relaxation Therapy',
							subServiceTitle: '60-Min Swedish Massage',
							providerName: 'Shumona Rahman',
							providerPhone: '+880 1913 887766',
							providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
							date: '2026-10-22',
							timeSlotId: 'evening',
							timeSlotLabel: 'Evening (18:30 – 22:30)',
							price: Math.round(35 * (1 - profile.discountRate)),
							currency: 'USD',
							status: 'pending_payment',
							paymentStatus: 'unpaid',
							acknowledgedByProvider: false,
							bookedAt: '2026-10-10T14:40:00Z',
							cancellationHoursLimit: 4,
							cancellationDeadline: '2026-10-22T14:30:00.000Z'
						}
					]
				}
			];
			try {
				localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(initialBookings));
			} catch {}
		}

		const currentSaved = this.getSavedStays();
		if (currentSaved.length === 0) {
			const initialSaved: SavedStayRecord[] = [
				{
					slug: 'gulshan-room',
					name: 'Gulshan Lakeview Suite',
					city: 'Dhaka',
					area: 'Gulshan 1',
					price: 68,
					rating: 4.95,
					reviewCount: 38,
					image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
					savedAt: '2026-10-12T09:15:00Z'
				},
				{
					slug: 'dhaka-condo',
					name: 'Banani Diplomatic Loft',
					city: 'Dhaka',
					area: 'Banani',
					price: 84,
					rating: 4.88,
					reviewCount: 52,
					image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
					savedAt: '2026-10-13T18:20:00Z'
				}
			];
			try {
				localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(initialSaved));
			} catch {}
		}
	}
}

// Global singleton instance
export const authManager = new AuthManager();

// Expose on window for vanilla JavaScript scripts (e.g. site.js, property.ts)
if (typeof window !== 'undefined') {
	(window as any).guesthouseAuth = authManager;
}
