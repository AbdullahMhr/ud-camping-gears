-- Phase 47 Schema Updates: Adding Support for Product Visibility Toggling and Reordering

-- 1. Add boolean flag for active/deactive status (Defaults to true so existing products stay visible)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 2. Add sort_order integer for custom drag-drop / manual reordering
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
