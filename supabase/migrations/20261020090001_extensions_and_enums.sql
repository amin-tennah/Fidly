-- ============================================================================
-- Migration 1 (Étape 2.2) : Extensions PostgreSQL & Types énumérés
-- ============================================================================

create schema if not exists extensions;

create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "postgis" with schema extensions;

create type public.restaurant_category as enum (
  'fast_food',
  'burger',
  'tacos',
  'pizza',
  'asian',
  'bakery',
  'coffee_shop',
  'other'
);

create type public.restaurant_member_role as enum (
  'owner',
  'staff'
);

create type public.subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'canceled'
);

-- Cf. ADR-010 : visit (+1 passage), reward_redeemed (consommation palier), reversal (annulation compensatoire)
create type public.scan_log_type as enum (
  'visit',
  'reward_redeemed',
  'reversal'
);

