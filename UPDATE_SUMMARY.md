# 🎮 RPG Inventory & Admin System - Update Summary

## ✅ Completed Changes

### 1. **Auto-refresh Inventory UI after Equip/Unequip**
**Problem:** After equipping or unequipping an item, the UI didn't update automatically - the "Załóż" / "Zdejmij" button didn't toggle without refreshing the page.

**Solution:**
- Modified `handleEquipItem` and `handleUnequipItem` in `DashboardNew.tsx` to dispatch a custom `inventory-changed` event
- Added event listener in `InventoryContext.tsx` to reload inventory when the event fires
- Now when you equip/unequip, the button label and equipped badge update immediately

**Files changed:**
- `src/pages/DashboardNew.tsx` - Added `window.dispatchEvent(new CustomEvent('inventory-changed'))` after successful equip/unequip
- `src/contexts/InventoryContext.tsx` - Added useEffect listener for `inventory-changed` event

---

### 2. **Admin Panel: Street Cred Control**
**Problem:** Admin panel had controls for credits and EXP but not for street cred.

**Solution:**
- Created new Edge Function `admin-give-street-cred`
- Added street cred input and button in admin panel UI
- Follows same pattern as credits/exp: admin check, nick lookup, update, audit log

**Files created:**
- `supabase/functions/admin-give-street-cred/index.ts` - New Edge Function for adding street cred

**Files changed:**
- `src/components/admin-modal.tsx` - Added `streetCredAmount` state, `handleGiveStreetCred` function, and UI controls

**Deployed:**
- ✅ Edge Function deployed to Supabase: `admin-give-street-cred`

---

## 🧪 Testing Checklist

### Test 1: Inventory UI Auto-refresh
1. Open the app and login
2. Go to inventory panel
3. Click on a clothing item (e.g., cyber jacket)
4. Click "Załóż" (Equip)
5. ✅ **Expected:** Button changes to "Zdejmij" and "ZAŁOŻONY" badge appears WITHOUT page refresh
6. Click "Zdejmij" (Unequip)
7. ✅ **Expected:** Button changes back to "Załóż" and badge disappears WITHOUT page refresh

### Test 2: Mannequin Rendering (if clothing column already restored)
1. Equip a top clothing item (e.g., cyber jacket)
2. Check the character mannequin/avatar
3. ✅ **Expected:** The clothing overlay should appear on the character

**If clothing doesn't render:**
- Run the migration `supabase/migrations/20250130000014_restore_clothing_column.sql` in Supabase SQL Editor
- This restores the `clothing` column and backfills it from `ekwipunek` table

### Test 3: Admin Panel - Street Cred
1. Open Admin Panel (press `~` key or access via UI)
2. Go to "Przedmioty" tab
3. Scroll to "SZYBKIE AKCJE" section
4. Enter a player nick
5. Enter street cred amount (e.g., 10)
6. Click "Dodaj Street Cred"
7. ✅ **Expected:** Success toast appears with message
8. Verify the player's street cred increased

**Potential issues:**
- ❌ **Forbidden error** → Ensure your user is in `admin_users` table with `is_admin = true`
  ```sql
  INSERT INTO admin_users (user_id, is_admin) 
  VALUES ('your-user-id-from-auth', true)
  ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
  ```
- ❌ **CORS error** → The CORS headers are configured to allow localhost and Vercel domains; check browser console

### Test 4: Admin Panel - Credits & EXP (already implemented, verify working)
- Same as street cred test but with "Dodaj kredyty" and "Dodaj EXP" buttons

---

## 🔧 Technical Details

### Event-based Inventory Sync
- **Event:** `inventory-changed` (custom DOM event)
- **Dispatched by:** `handleEquipItem`, `handleUnequipItem` in DashboardNew
- **Listened by:** `InventoryContext` (reloads inventory from DB)

### Database Flow for Equip/Unequip
1. User clicks Załóż/Zdejmij button
2. Frontend calls `secureApi.equipItem(itemId, 'equip'|'unequip')`
3. Edge Function `equip-item` updates `ekwipunek.zalozony` in DB
4. Edge Function also updates `postacie.clothing` JSON for mannequin
5. Edge Function returns updated character data
6. Frontend calls `loadData()` to reload character
7. Frontend dispatches `inventory-changed` event
8. InventoryContext reloads inventory from `ekwipunek` table
9. UI updates with new equip state

### Admin Functions Architecture
- **Pattern:** All admin functions follow same structure:
  1. Check Authorization header (Bearer token)
  2. Verify user is admin in `admin_users` table
  3. Validate input (targetNick, amount/itemId)
  4. Lookup character by nick (case-insensitive)
  5. Perform DB update
  6. Log action in `audit_log`
  7. Return success message with details

---

## 📋 Next Steps (Optional)

### 1. Clothing Column Migration
If mannequin doesn't show clothing overlays, run:
```sql
-- File: supabase/migrations/20250130000014_restore_clothing_column.sql
-- Adds clothing column if missing and backfills from ekwipunek
```

### 2. Remove Legacy JSON Inventory (Future)
Once fully stable and confident ekwipunek table is the single source of truth:
- Drop `postacie.inventory` column
- Remove fallback code in `InventoryContext.tsx`

### 3. Optimize Context Refetch
Instead of listening to custom events, could pass refetch callbacks directly to handlers:
```tsx
// In InventoryPanel
const { refetch: refetchInventory } = useInventory()

// Pass to DashboardNew
<InventoryPanel onEquipSuccess={refetchInventory} />
```

### 4. Admin Panel Enhancements
- Add bulk operations (give items to multiple players)
- Add item search/filter in admin add item dropdown
- Add logs viewer for audit_log table
- Add player search with autocomplete

---

## 🐛 Known Issues & Workarounds

### Issue: Admin functions return 403 Forbidden
**Cause:** User not in `admin_users` table or `is_admin = false`

**Fix:**
```sql
-- Check current admin users
SELECT * FROM admin_users;

-- Add yourself as admin
INSERT INTO admin_users (user_id, is_admin) 
VALUES ('your-auth-user-id', true)
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
```

### Issue: CORS errors in browser console
**Cause:** Frontend origin not in allowed list

**Fix:** Update `supabase/functions/_shared/cors.ts` to include your domain or update `ALLOWED_ORIGIN` secret in Supabase dashboard.

---

## 📦 Deployed Components

### Edge Functions (Supabase)
- ✅ `equip-item` (v8) - Equips/unequips items via ekwipunek table
- ✅ `admin-add-item` (v2) - Adds items to player inventory
- ✅ `admin-give-credits` (v1) - Gives credits to player
- ✅ `admin-give-exp` (v1) - Gives EXP to player (with level-up support)
- ✅ `admin-give-street-cred` (v1) - **NEW** Gives street cred to player

### Frontend Components
- ✅ `ItemsContext` - Loads items from DB with fallback
- ✅ `InventoryContext` - Loads ekwipunek from DB with event listener
- ✅ `InventoryPanel` - Displays inventory with auto-refresh
- ✅ `AdminModal` - Admin panel with all controls

---

## 🎉 Summary

**What works now:**
- ✅ Inventory UI updates automatically after equip/unequip
- ✅ Admin can add street cred via panel
- ✅ Admin can add items, credits, and EXP
- ✅ All inventory operations use DB (`ekwipunek` table)
- ✅ Equip/unequip enforces slot conflicts via DB
- ✅ Clothing overlays sync to mannequin (if column restored)

**What to test:**
- Auto-refresh after equip/unequip
- Admin street cred function
- Mannequin rendering (may need migration)

**What's optional:**
- Run clothing column migration if mannequin doesn't show overlays
- Remove legacy JSON inventory in future
- Enhance admin panel with more features
