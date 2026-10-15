-- ============================================================================
-- Migration: 20261015160000_auth_profiles_and_sync.sql
-- Description: Extends profiles table with traveler attributes, documents,
--              biometric security flags, and attaches automatic auth synchronization
--              triggers for Supabase Auth (Email & Google OAuth providers).
-- ============================================================================

begin;

-- 1. Extend public.profiles with traveler identity and document attributes
alter table public.profiles
	add column if not exists gender text check (gender is null or gender in ('male', 'female', 'other')),
	add column if not exists national_id text,
	add column if not exists passport_number text,
	add column if not exists fingerprint_enabled boolean not null default false,
	add column if not exists tier text not null default 'Silver Member',
	add column if not exists discount_rate numeric(4, 2) not null default 0.10,
	add column if not exists discount_label text not null default '10% Member Rate',
	add column if not exists role text not null default 'traveler',
	add column if not exists google_linked boolean not null default false;

-- 2. Update column update grants for authenticated users
grant update (
	display_name,
	phone,
	avatar_path,
	preferred_language,
	preferred_currency,
	gender,
	national_id,
	passport_number,
	fingerprint_enabled
) on public.profiles to authenticated;

-- 3. Trigger Function: Automatically sync newly registered auth.users into public.profiles
--    Captures Google OAuth profile data (full_name, avatar_url, phone) or email signup metadata
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
declare
	v_provider text;
	v_full_name text;
	v_avatar text;
	v_phone text;
	v_is_google boolean;
begin
	-- Detect auth provider (Google vs Email/Password vs Firebase)
	v_provider := coalesce(new.raw_app_meta_data->>'provider', 'supabase');
	v_is_google := (v_provider = 'google') or exists (
		select 1 from jsonb_array_elements(coalesce(new.identities, '[]'::jsonb)) as ident
		where ident->>'provider' = 'google'
	);

	-- Extract user metadata captured from Google OAuth or email signup
	v_full_name := coalesce(
		new.raw_user_meta_data->>'full_name',
		new.raw_user_meta_data->>'name',
		split_part(new.email, '@', 1)
	);

	v_avatar := coalesce(
		new.raw_user_meta_data->>'avatar_url',
		new.raw_user_meta_data->>'picture',
		'/assets/icons/user.png'
	);

	v_phone := coalesce(
		new.raw_user_meta_data->>'phone',
		new.phone,
		null
	);

	-- Upsert into public.profiles
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
		fingerprint_enabled,
		created_at,
		updated_at
	) values (
		new.id,
		case when v_is_google then 'supabase' else 'supabase' end,
		new.id::text,
		new.email,
		v_full_name,
		v_phone,
		v_avatar,
		coalesce(new.raw_user_meta_data->>'preferred_language', 'en'),
		'BDT',
		coalesce(new.raw_user_meta_data->>'tier', 'Silver Member'),
		coalesce((new.raw_user_meta_data->>'discount_rate')::numeric, 0.10),
		coalesce(new.raw_user_meta_data->>'discount_label', '10% Member Rate'),
		coalesce(new.raw_user_meta_data->>'role', 'traveler'),
		v_is_google,
		new.raw_user_meta_data->>'gender',
		new.raw_user_meta_data->>'nationalId',
		new.raw_user_meta_data->>'passportNumber',
		coalesce((new.raw_user_meta_data->>'fingerprintEnabled')::boolean, false),
		now(),
		now()
	)
	on conflict (auth_provider, auth_subject) do update set
		email = excluded.email,
		display_name = coalesce(public.profiles.display_name, excluded.display_name),
		avatar_path = coalesce(public.profiles.avatar_path, excluded.avatar_path),
		phone = coalesce(public.profiles.phone, excluded.phone),
		google_linked = excluded.google_linked,
		updated_at = now();

	return new;
end;
$$;

-- 4. Attach trigger on auth.users (guarded for Supabase environments where auth schema exists)
do $$
begin
	if exists (select 1 from information_schema.schemata where schema_name = 'auth') then
		drop trigger if exists on_auth_user_created on auth.users;
		create trigger on_auth_user_created
			after insert on auth.users
			for each row execute function public.handle_new_auth_user();
	end if;
end;
$$;

commit;
