-- ============================================================================
-- GuesthouseBD Database Seed
-- Generated from: src/data/properties.json, src/data/services.json, src/data/home.json
-- Fully idempotent with deterministic UUIDs and ON CONFLICT handling.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. Tenants (Platform Operator & Host Tenants)
-- ----------------------------------------------------------------------------
insert into public.tenants (
	id,
	slug,
	name,
	tenant_type,
	status,
	default_currency,
	country_code,
	timezone,
	settings
) values (
	'00000000-0000-0000-0000-000000000001',
	'guesthousebd-platform',
	'GuesthouseBD Platform',
	'platform',
	'active',
	'BDT',
	'BD',
	'Asia/Dhaka',
	'{"support_email": "support@guesthousebd.com", "platform_fee_percent": 10}'::jsonb
) on conflict (slug) do update set
	name = excluded.name,
	settings = excluded.settings;

-- ----------------------------------------------------------------------------
-- 2. Profiles (Demo Travelers, VIPs, and Hosts)
-- ----------------------------------------------------------------------------
insert into public.profiles (
	id,
	auth_provider,
	auth_subject,
	email,
	display_name,
	phone,
	avatar_path,
	preferred_language,
	preferred_currency,
	tier,
	discount_rate,
	discount_label,
	role,
	google_linked,
	gender,
	national_id,
	passport_number,
	fingerprint_enabled
) values
(
	'00000000-0000-0000-0000-000000000011',
	'supabase',
	'demo-vip-001',
	'sarah.khan@example.com',
	'Sarah Khan',
	'+880 1712 345678',
	'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
	'en',
	'BDT',
	'Gold VIP',
	0.15,
	'15% VIP Club Rate',
	'vip',
	false,
	'female',
	'1992269412340001',
	'BG0942817',
	true
),
(
	'00000000-0000-0000-0000-000000000012',
	'supabase',
	'demo-traveler-002',
	'tanvir.ahmed@example.com',
	'Tanvir Ahmed',
	'+880 1819 876543',
	'/assets/icons/user-male.png',
	'en',
	'BDT',
	'Silver Member',
	0.10,
	'10% Member Rate',
	'traveler',
	false,
	'male',
	'1995269412340002',
	'BH7712349',
	false
),
(
	'00000000-0000-0000-0000-000000000013',
	'supabase',
	'demo-host-003',
	'farhana.host@guesthousebd.com',
	'Farhana Yasmin',
	'+880 1911 223344',
	'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
	'en',
	'BDT',
	'Diamond Host',
	0.20,
	'20% Host Privilege Rate',
	'host',
	false,
	'female',
	'1988269412340003',
	'A12894567',
	true
),
(
	'00000000-0000-0000-0000-000000000014',
	'supabase',
	'google-demo-user-004',
	'alex.rahman.traveler@gmail.com',
	'Alex Rahman',
	'+880 1819 889900',
	'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
	'en',
	'BDT',
	'Gold VIP',
	0.15,
	'15% VIP Club Rate',
	'vip',
	true,
	'male',
	'1990269412349988',
	'A08927163',
	true
)
on conflict (auth_provider, auth_subject) do update set
	display_name = excluded.display_name,
	phone = excluded.phone,
	avatar_path = excluded.avatar_path,
	tier = excluded.tier,
	discount_rate = excluded.discount_rate,
	gender = excluded.gender,
	national_id = excluded.national_id,
	passport_number = excluded.passport_number,
	fingerprint_enabled = excluded.fingerprint_enabled;

-- Tenant Memberships
insert into public.tenant_memberships (tenant_id, user_id, role, is_active)
values
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000013', 'owner', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'customer', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 'customer', true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000014', 'customer', true)
on conflict (tenant_id, user_id) do update set
	role = excluded.role,
	is_active = excluded.is_active;

-- ----------------------------------------------------------------------------
-- 3. Destinations
-- ----------------------------------------------------------------------------
insert into public.destinations (
	id,
	tenant_id,
	slug,
	name,
	country_code,
	region_name,
	description,
	image_path,
	latitude,
	longitude,
	is_active
) values (
	'00000000-0000-0000-0000-000000000021',
	'00000000-0000-0000-0000-000000000001',
	'dhaka',
	'Dhaka',
	'BD',
	'Dhaka Division',
	'Vibrant metropolis blending heritage Mughal architecture, bustling bazaars, and contemporary hospitality.',
	'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
	23.8103,
	90.4125,
	true
) on conflict (tenant_id, country_code, slug) do update set
	name = excluded.name,
	description = excluded.description;

-- ----------------------------------------------------------------------------
-- 4. Amenities (from amenity-filters.json and listings)
-- ----------------------------------------------------------------------------
insert into public.amenities (id, tenant_id, slug, name, category, icon, is_active)
values
('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000001', 'wifi', 'Fast High-Speed WiFi (100 Mbps)', 'connectivity', 'wifi', true),
('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000001', 'air-conditioning', 'Air Conditioning & Climate Control', 'comfort', 'wind', true),
('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000001', 'kitchen', 'Fully Equipped Chef Kitchen', 'living', 'utensils', true),
('00000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000001', 'free-parking', 'Free Secure Parking On Premises', 'facilities', 'car', true),
('00000000-0000-0000-0000-000000000035', '00000000-0000-0000-0000-000000000001', 'dedicated-workspace', 'Dedicated Ergonomic Workspace', 'work', 'laptop', true),
('00000000-0000-0000-0000-000000000036', '00000000-0000-0000-0000-000000000001', 'city-skyline-view', 'Panoramic City Skyline View', 'scenery', 'eye', true),
('00000000-0000-0000-0000-000000000037', '00000000-0000-0000-0000-000000000001', 'security-guard', '24/7 Gated Security & Concierge', 'safety', 'shield', true)
on conflict (tenant_id, slug) do update set
	name = excluded.name,
	category = excluded.category;

-- ----------------------------------------------------------------------------
-- 5. Stays Listings (from properties.json)
-- ----------------------------------------------------------------------------
insert into public.listings (
	id,
	tenant_id,
	destination_id,
	listing_type,
	status,
	slug,
	name,
	summary,
	description,
	address,
	latitude,
	longitude,
	max_guests,
	bedrooms,
	bathrooms,
	base_price_minor,
	currency_code,
	price_unit,
	cancellation_policy,
	attributes,
	published_at,
	created_by
) values
(
	'00000000-0000-0000-0000-000000000101',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'stay',
	'published',
	'mohammadapura-room',
	'Room in Mohammadapura Thana',
	'Serene private room in Mohammadpur with air conditioning, workspace, and peaceful neighborhood ambiance.',
	'Restful private room in Mohammadpur, thoughtfully furnished for business travelers or solo explorers.',
	'Block C, Mohammadpur, Dhaka 1207, Bangladesh',
	23.7658,
	90.3584,
	2,
	1,
	1.0,
	159000, -- minor units (approx ~$13.25 USD in BDT)
	'BDT',
	'night',
	'{"flexible": true, "hours_before_checkin": 24}'::jsonb,
	'{"rating": 4.89, "review_count": 18, "area": "Mohammadapura Thana"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000102',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'stay',
	'published',
	'gulshan-room',
	'Room in Gulshan Thana',
	'Chic luxury studio in prime diplomatic zone of Gulshan 2. Walk to premier cafes and embassies.',
	'Modern residential studio with designer interior, premium bedding, and 24/7 security concierge.',
	'Road 113, Gulshan-2, Dhaka 1212, Bangladesh',
	23.7925,
	90.4167,
	2,
	1,
	1.0,
	186000,
	'BDT',
	'night',
	'{"flexible": true, "hours_before_checkin": 48}'::jsonb,
	'{"rating": 4.79, "review_count": 14, "area": "Gulshan Thana"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000103',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'stay',
	'published',
	'citylights',
	'Citylights · Bashundhara Park Lane Luxe Collection',
	'Spacious 3-bedroom luxury apartment in Bashundhara with panoramic terrace, chef kitchen, and high-speed fiber WiFi.',
	'Settle into a spacious city apartment in Bashundhara. Three private bedrooms, generous shared living space, and a calm place to land between days out in Dhaka.',
	'House 24, Road 113, Bashundhara R/A, Dhaka 1229, Bangladesh',
	23.8223,
	90.4278,
	6,
	3,
	3.0,
	525000,
	'BDT',
	'night',
	'{"flexible": true, "hours_before_checkin": 24}'::jsonb,
	'{"rating": 4.86, "review_count": 28, "area": "Bashundhara", "featured": true}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000104',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'stay',
	'published',
	'dhaka-room',
	'Modern Suite in Dhanmondi',
	'Contemporary Dhanmondi lakeside stay with serene atmosphere, rooftop garden, and cultural access.',
	'Centrally located in Dhanmondi, near lakeside walkways, galleries, and top restaurants.',
	'Road 8A, Dhanmondi, Dhaka 1209, Bangladesh',
	23.7465,
	90.3760,
	3,
	1,
	1.0,
	336000,
	'BDT',
	'night',
	'{"flexible": true, "hours_before_checkin": 24}'::jsonb,
	'{"rating": 4.82, "review_count": 22, "area": "Dhanmondi"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000105',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'stay',
	'published',
	'dhaka-condo',
	'Serene Lakeview Condo in Banani',
	'Upscale condominium overlooking Banani Lake with private balcony, swimming pool, and gymnasium access.',
	'Luxury urban sanctuary in Banani 11 with designer appointments, floor-to-ceiling windows, and king bed suites.',
	'Road 11, Block D, Banani, Dhaka 1213, Bangladesh',
	23.7937,
	90.4043,
	4,
	2,
	2.0,
	624000,
	'BDT',
	'night',
	'{"flexible": true, "hours_before_checkin": 48}'::jsonb,
	'{"rating": 4.95, "review_count": 36, "area": "Banani"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000106',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'stay',
	'published',
	'mirpur-room',
	'Comfortable Family Stay in Mirpur',
	'Affordable, clean, and spacious residence close to National Botanical Garden and Sher-e-Bangla Stadium.',
	'Ideal family retreat with large living room, quiet surroundings, and dedicated vehicle parking.',
	'Section 2, Mirpur, Dhaka 1216, Bangladesh',
	23.8071,
	90.3686,
	4,
	2,
	1.5,
	180000,
	'BDT',
	'night',
	'{"flexible": true, "hours_before_checkin": 24}'::jsonb,
	'{"rating": 4.70, "review_count": 11, "area": "Mirpur"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
)
on conflict (tenant_id, slug) do update set
	name = excluded.name,
	summary = excluded.summary,
	description = excluded.description,
	base_price_minor = excluded.base_price_minor,
	attributes = excluded.attributes;

-- ----------------------------------------------------------------------------
-- 6. Listing Media Assets
-- ----------------------------------------------------------------------------
insert into public.listing_media (listing_id, storage_path, alt_text, media_type, is_cover, sort_order)
values
('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80', 'Room in Mohammadapura Thana', 'image', true, 0),
('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80', 'Room in Gulshan Thana', 'image', true, 0),
('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80', 'Citylights · Bashundhara Park Lane Luxe Collection', 'image', true, 0),
('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80', 'Modern Suite in Dhanmondi', 'image', true, 0),
('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80', 'Serene Lakeview Condo in Banani', 'image', true, 0),
('00000000-0000-0000-0000-000000000106', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&auto=format&fit=crop&q=80', 'Comfortable Family Stay in Mirpur', 'image', true, 0)
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- 7. On-Ground Services (Guides, Assistants, Chauffeurs from services.json)
-- ----------------------------------------------------------------------------
insert into public.listings (
	id,
	tenant_id,
	destination_id,
	listing_type,
	status,
	slug,
	name,
	summary,
	description,
	base_price_minor,
	currency_code,
	price_unit,
	capacity_seats,
	attributes,
	published_at,
	created_by
) values
(
	'00000000-0000-0000-0000-000000000201',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'travel_guide',
	'published',
	'guide-farzana-ahmed',
	'Old Dhaka Heritage & Culinary Food Trail',
	'Licensed Heritage Guide Farzana Ahmed offers an exploration of historic Lalbagh Fort, Ahsan Manzil Pink Palace, and authentic food tasting.',
	'Detailed guided exploration across Old Dhaka heritage monuments, historical narratives, and verified culinary tasting.',
	300000, -- minor units (approx ~$25 USD)
	'BDT',
	'trip',
	null,
	'{"provider_id": "prov-guide-01", "provider_name": "Farzana Ahmed", "phone": "+880 1711 002233", "rating": 4.98, "reviews": 84, "category_id": "tour-guide", "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000202',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'tour_assistant',
	'published',
	'assistant-nazmul-huda',
	'Dhaka City Companion & Lifestyle Concierge',
	'Bilingual Personal Assistant Nazmul Huda assists with shopping, translation, business logistics, and customized city itineraries.',
	'Full bilingual personal concierge service assisting foreign and domestic travelers with seamless city logistics.',
	360000,
	'BDT',
	'day',
	null,
	'{"provider_id": "prov-assist-01", "provider_name": "Nazmul Huda", "phone": "+880 1713 554433", "rating": 4.96, "reviews": 73, "category_id": "travel-assistant", "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000203',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'vehicle',
	'published',
	'chauffeur-rahim-uddin',
	'Premium Airport Transfer & Intercity Drive',
	'Executive Sedan Chauffeur Rahim Uddin provides punctual airport pick & drop and hourly executive rides across Dhaka.',
	'Premium air-conditioned Toyota sedan with verified chauffeur, luggage assistance, and meet & greet service.',
	420000,
	'BDT',
	'trip',
	4,
	'{"provider_id": "prov-trans-01", "provider_name": "Rahim Uddin", "phone": "+880 1817 112233", "rating": 4.95, "reviews": 112, "category_id": "transport-chauffeur", "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
),
(
	'00000000-0000-0000-0000-000000000204',
	'00000000-0000-0000-0000-000000000001',
	'00000000-0000-0000-0000-000000000021',
	'tour_assistant',
	'published',
	'wellness-ayesha-siddiqua',
	'Ayurvedic Relaxation & In-Stay Spa Therapy',
	'Certified therapist Ayesha Siddiqua provides holistic relaxation massage and aromatherapy in the comfort of your guesthouse suite.',
	'In-suite wellness therapy utilizing natural herbal oils and organic botanicals for deep muscle relief after long travel.',
	480000,
	'BDT',
	'item',
	null,
	'{"provider_id": "prov-spa-01", "provider_name": "Ayesha Siddiqua", "phone": "+880 1914 778899", "rating": 4.99, "reviews": 95, "category_id": "wellness-spa", "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"}'::jsonb,
	now(),
	'00000000-0000-0000-0000-000000000013'
)
on conflict (tenant_id, slug) do update set
	name = excluded.name,
	summary = excluded.summary,
	attributes = excluded.attributes;

commit;
