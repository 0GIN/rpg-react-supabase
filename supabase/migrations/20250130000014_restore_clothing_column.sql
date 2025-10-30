-- Restore clothing column for mannequin rendering and backfill from ekwipunek

-- 1) Add column if missing
ALTER TABLE public.postacie
  ADD COLUMN IF NOT EXISTS clothing JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 2) Backfill clothing JSON from currently equipped items
WITH eq AS (
  SELECT e.postac_id, i.clothing_slot, i.clothing_path
  FROM public.ekwipunek e
  JOIN public.items i ON i.item_id = e.item_id
  WHERE e.zalozony = TRUE
    AND i.clothing_slot IS NOT NULL
    AND i.clothing_path IS NOT NULL
)
UPDATE public.postacie p
SET clothing = COALESCE(
  (
    SELECT jsonb_object_agg(clothing_slot, clothing_path)
    FROM eq
    WHERE eq.postac_id = p.id
  ),
  '{}'::jsonb
);

COMMENT ON COLUMN public.postacie.clothing IS 'JSON map of equipped clothing overlays (top/bottom/shoes/accessory/implant -> image path) used by the mannequin UI';
