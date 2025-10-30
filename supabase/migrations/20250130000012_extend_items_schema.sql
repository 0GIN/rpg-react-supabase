-- Extend items table with fields needed by app/UI and server functions
ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS clothing_slot TEXT CHECK (clothing_slot IN ('top','bottom','shoes','accessory','implant')),
  ADD COLUMN IF NOT EXISTS clothing_path TEXT,
  ADD COLUMN IF NOT EXISTS image_path TEXT,
  ADD COLUMN IF NOT EXISTS stackable BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS max_stack INTEGER,
  ADD COLUMN IF NOT EXISTS required_level INTEGER,
  ADD COLUMN IF NOT EXISTS required_stats JSONB;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_items_clothing_slot ON public.items(clothing_slot) WHERE typ = 'clothing';

-- Comments for documentation
COMMENT ON COLUMN public.items.clothing_slot IS 'Slot for clothing items: top/bottom/shoes/accessory/implant';
COMMENT ON COLUMN public.items.clothing_path IS 'Overlay PNG path used by mannequin when equipped';
COMMENT ON COLUMN public.items.image_path IS 'Item icon/image used in inventory UI';
COMMENT ON COLUMN public.items.stackable IS 'If true, multiple items can stack in one slot';
COMMENT ON COLUMN public.items.max_stack IS 'Maximum stack size when stackable=true';
COMMENT ON COLUMN public.items.required_level IS 'Minimum character level required to equip/use';
COMMENT ON COLUMN public.items.required_stats IS 'JSON object of stat requirements, e.g. {"strength": 10}'
