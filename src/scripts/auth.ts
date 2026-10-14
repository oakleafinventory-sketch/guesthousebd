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
	categoryId: 'tour-guide' | 'travel-assistant' | 'wellness-spa' | 'transport-chauffeur';
	categoryName: string;
	title: string;
	providerName: string;
	providerPhone: string;
	providerAvatar: string;
	date: string; // YYYY-MM-DD
	timeSlotId: 'morning' | 'afternoon' | 'evening' | 'fullday';
	timeSlotLabel: string; // e.g. "Morning (09:00 – 13:00)"
	price: number;
	currency: string;
	status: 'confirmed' | 'pending_payment' | 'pending_acknowledgement' | 'cancelled';
	paymentStatus: 'unpaid' | 'paid';
	acknowledgedByProvider: boolean;
	acknowledgedAt?: string;
	bookedAt: string;
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
		tier: 'Gold VIP',
		discountRate: 0.15,
		discountLabel: '15% VIP Club Discount',
		memberSince: 'March 2024',
		phone: '+880 1712 345678',
		role: 'vip'
	},
	traveler: {
		id: 'demo-traveler-002',
		email: 'tanvir.ahmed@example.com',
		name: 'Tanvir Ahmed',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
		tier: 'Silver Member',
		discountRate: 0.10,
		discountLabel: '10% Member Rate',
		memberSince: 'August 2024',
		phone: '+880 1819 876543',
		role: 'traveler'
	},
	host: {
		id: 'demo-host-003',
		email: 'farhana.host@guesthousebd.com',
		name: 'Farhana Yasmin',
		avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
		tier: 'Diamond Host',
		discountRate: 0.20,
		discountLabel: '20% Host Privilege Rate',
		memberSince: 'January 2023',
		phone: '+880 1911 223344',
		role: 'host'
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
					avatar:
						u.user_metadata?.avatar_url ||
						'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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
					const userProfile: UserProfile = {
						id: u.id,
						email: u.email || '',
						name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Traveler',
						avatar:
							u.user_metadata?.avatar_url ||
							'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
						tier: (u.user_metadata?.tier as any) || 'Silver Member',
						discountRate: 0.10,
						discountLabel: '10% Member Rate',
						memberSince: new Date(u.created_at).toLocaleDateString('en-US', {
							month: 'short',
							year: 'numeric'
						}),
						role: 'traveler'
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
				avatar:
					data.user.user_metadata?.avatar_url ||
					'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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
				avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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

	// ---------------- Multi-Service Scheduler with Conflict Prevention ---------------- //
	public checkServiceConflict(
		existingServices: StayBookedService[] = [],
		newDate: string,
		newSlotId: 'morning' | 'afternoon' | 'evening' | 'fullday'
	): { hasConflict: boolean; conflictingService?: StayBookedService; message?: string } {
		const activeServices = existingServices.filter((s) => s.status !== 'cancelled');
		for (const s of activeServices) {
			if (s.date === newDate) {
				// Conflict occurs if either service is full-day, or both share the exact same slot
				if (s.timeSlotId === 'fullday' || newSlotId === 'fullday' || s.timeSlotId === newSlotId) {
					return {
						hasConflict: true,
						conflictingService: s,
						message: `Schedule Collision: "${s.title}" (${s.timeSlotLabel}) is already booked on ${newDate}. Please choose a different date or time slot.`
					};
				}
			}
		}
		return { hasConflict: false };
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
		const conflict = this.checkServiceConflict(existing, service.date, service.timeSlotId);
		if (conflict.hasConflict) {
			return { success: false, error: conflict.message };
		}

		const paymentStatus = service.paymentStatus || 'unpaid';
		const acknowledgedByProvider = service.acknowledgedByProvider ?? false;
		let status: StayBookedService['status'] = 'pending_payment';
		if (paymentStatus === 'paid') {
			status = acknowledgedByProvider ? 'confirmed' : 'pending_acknowledgement';
		}

		const newService: StayBookedService = {
			...service,
			id: 'srv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
			paymentStatus,
			acknowledgedByProvider,
			acknowledgedAt: acknowledgedByProvider ? new Date().toISOString() : undefined,
			status,
			bookedAt: new Date().toISOString()
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
						let nextStatus: StayBookedService['status'] = 'pending_payment';
						if (s.paymentStatus === 'paid') {
							nextStatus = nextAck ? 'confirmed' : 'pending_acknowledgement';
						}
						return {
							...s,
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

	public removeServiceFromStay(bookingId: string, serviceId: string): boolean {
		const all = this.getBookings();
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
			return false;
		}

		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('guesthouse:bookings-changed', { detail: { bookings: updatedBookings } }));
		}

		return true;
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
							providerId: 'prov-ride-01',
							categoryId: 'transport-chauffeur',
							categoryName: 'Chauffeur & Airport Ride',
							title: 'Executive Airport Pick & Drop',
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
							bookedAt: '2026-10-10T14:35:00Z'
						},
						{
							id: 'srv_demo_02',
							providerId: 'prov-guide-01',
							categoryId: 'tour-guide',
							categoryName: 'Tour Guide',
							title: 'Old Dhaka Heritage & Culinary Food Trail',
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
							bookedAt: '2026-10-10T14:36:00Z'
						},
						{
							id: 'srv_demo_03',
							providerId: 'prov-spa-01',
							categoryId: 'wellness-spa',
							categoryName: 'Spa & Wellness',
							title: 'In-Suite Aromatherapy & Hot Stone Massage',
							providerName: 'Suraiya Parvin',
							providerPhone: '+880 1819 112233',
							providerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
							date: '2026-10-22',
							timeSlotId: 'evening',
							timeSlotLabel: 'Evening (18:30 – 22:30)',
							price: Math.round(35 * (1 - profile.discountRate)),
							currency: 'USD',
							status: 'pending_payment',
							paymentStatus: 'unpaid',
							acknowledgedByProvider: false,
							bookedAt: '2026-10-10T14:40:00Z'
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
