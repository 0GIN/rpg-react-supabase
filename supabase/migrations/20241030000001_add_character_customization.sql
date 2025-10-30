-- Add appearance and clothing customization fields to postacie table
-- These fields store character appearance and equipped clothing as JSONB

ALTER TABLE postacie 
ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT '{"gender": "female", "bodyType": "athletic", "skinTone": "medium"}'::jsonb,
ADD COLUMN IF NOT EXISTS clothing JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN postacie.appearance IS 'Character base appearance (gender, bodyType, skinTone)';
COMMENT ON COLUMN postacie.clothing IS 'Equipped clothing items with PNG paths (hair, top, bottom, shoes, accessory, implant)';
