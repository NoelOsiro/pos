CREATE TABLE IF NOT EXISTS public.shops (
  id varchar(255) PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  business_type varchar(64) NOT NULL,
  contact_email text,
  contact_phone text,
  invite_code_hash varchar(64) NOT NULL UNIQUE,
  created_by varchar(255) NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shops_created_by_idx ON public.shops (created_by);

CREATE TABLE IF NOT EXISTS public.shop_members (
  id varchar(255) PRIMARY KEY,
  shop_id varchar(255) NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  user_id varchar(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role varchar(32) NOT NULL DEFAULT 'cashier',
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT shop_members_shop_user_key UNIQUE (shop_id, user_id)
);

CREATE INDEX IF NOT EXISTS shop_members_user_id_idx ON public.shop_members (user_id);
