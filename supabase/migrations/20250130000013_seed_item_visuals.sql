-- Seed clothing visuals and icons for known items
UPDATE public.items SET clothing_slot='top', clothing_path='/clothing/female/tops/cyber_jacket_f.png', image_path='/clothing/female/tops/cyber_jacket_f.png' WHERE item_id='cyber_jacket_f';
UPDATE public.items SET clothing_slot='top', clothing_path='/clothing/female/tops/tactical_vest.png', image_path='/clothing/female/tops/tactical_vest.png' WHERE item_id='tactical_vest';
UPDATE public.items SET clothing_slot='bottom', clothing_path='/clothing/female/bottoms/cargo_pants.png', image_path='/clothing/female/bottoms/cargo_pants.png' WHERE item_id='cargo_pants';
UPDATE public.items SET clothing_slot='bottom', clothing_path='/clothing/female/bottoms/armored_jeans.png', image_path='/clothing/female/bottoms/armored_jeans.png' WHERE item_id='armored_jeans';
UPDATE public.items SET clothing_slot='bottom', clothing_path='/clothing/female/bottoms/cyber_pants_f.png', image_path='/clothing/female/bottoms/cyber_pants_f.png' WHERE item_id='cyber_pants_f';
UPDATE public.items SET clothing_slot='shoes', clothing_path='/clothing/female/shoes/combat_boots.png', image_path='/clothing/female/shoes/combat_boots.png' WHERE item_id='combat_boots';
UPDATE public.items SET clothing_slot='shoes', clothing_path='/clothing/female/shoes/stealth_sneakers.png', image_path='/clothing/female/shoes/stealth_sneakers.png' WHERE item_id='stealth_sneakers';
UPDATE public.items SET clothing_slot='accessory', clothing_path='/clothing/female/accessories/smart_glasses.png', image_path='/clothing/female/accessories/smart_glasses.png' WHERE item_id='smart_glasses';
UPDATE public.items SET clothing_slot='accessory', clothing_path='/clothing/female/accessories/neural_link.png', image_path='/clothing/female/accessories/neural_link.png' WHERE item_id='neural_link';
UPDATE public.items SET clothing_slot='implant', clothing_path='/clothing/female/implants/basic_cyberarm.png', image_path='/clothing/female/implants/basic_cyberarm.png' WHERE item_id='basic_cyberarm';
UPDATE public.items SET clothing_slot='implant', clothing_path='/clothing/female/implants/military_cyberarm.png', image_path='/clothing/female/implants/military_cyberarm.png' WHERE item_id='military_cyberarm';

-- Basic icons for non-clothing where available
UPDATE public.items SET image_path='/weapons/pistol_9mm.png' WHERE item_id='pistol_9mm' AND image_path IS NULL;
UPDATE public.items SET image_path='/weapons/plasma_rifle.png' WHERE item_id='plasma_rifle' AND image_path IS NULL;
UPDATE public.items SET image_path='/consumables/medkit.png' WHERE item_id='medkit' AND image_path IS NULL;
UPDATE public.items SET image_path='/consumables/energy_drink.png' WHERE item_id='energy_drink' AND image_path IS NULL;
UPDATE public.items SET image_path='/consumables/stimpack.png' WHERE item_id='stimpack' AND image_path IS NULL;
