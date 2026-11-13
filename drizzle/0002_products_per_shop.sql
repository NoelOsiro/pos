ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS shop_id varchar(255);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_shop_id_shops_id_fk'
      AND conrelid = 'public.products'::regclass
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_shop_id_shops_id_fk
      FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;
  END IF;
END
$$;

-- Existing global products can only be assigned safely when there is one shop.
-- With multiple shops, legacy products remain unassigned until an administrator maps them.
UPDATE public.products
SET shop_id = (SELECT id FROM public.shops ORDER BY created_at, id LIMIT 1)
WHERE shop_id IS NULL
  AND (SELECT count(*) FROM public.shops) = 1;

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_sku_unique;

DROP INDEX IF EXISTS public.products_sku_unique;

CREATE UNIQUE INDEX IF NOT EXISTS products_shop_sku_key
  ON public.products (shop_id, sku);

CREATE INDEX IF NOT EXISTS products_shop_id_idx
  ON public.products (shop_id);
