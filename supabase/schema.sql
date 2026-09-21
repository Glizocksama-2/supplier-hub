-- Supplier Hub PWA - Database Schema
-- Run in Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- User roles
CREATE TYPE user_role AS ENUM ('retailer', 'wholesaler', 'farmer', 'boda_rider', 'admin');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'retailer',
  full_name TEXT,
  phone TEXT,
  business_name TEXT,
  location GEOGRAPHY(POINT, 4326),
  address TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  elevenlabs_voice_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Retailer inventory
CREATE TABLE retailer_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  low_stock_threshold DECIMAL(10,2) NOT NULL DEFAULT 10,
  reorder_quantity DECIMAL(10,2) NOT NULL DEFAULT 50,
  last_updated TIMESTAMPTZ DEFAULT now(),
  UNIQUE(retailer_id, product_id)
);

-- Supplier listings (wholesalers/farmers)
CREATE TABLE supplier_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_per_unit DECIMAL(10,2) NOT NULL,
  available_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order_quantity DECIMAL(10,2) DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'kg',
  is_active BOOLEAN DEFAULT true,
  location GEOGRAPHY(POINT, 4326),
  delivery_radius_km DECIMAL(5,2) DEFAULT 50,
  delivery_fee_per_km DECIMAL(10,2) DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price + delivery_fee) STORED,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'disputed')),
  delivery_address TEXT NOT NULL,
  delivery_location GEOGRAPHY(POINT, 4326),
  delivery_notes TEXT,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Boda assignments
CREATE TABLE boda_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  boda_rider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offered' CHECK (status IN ('offered', 'accepted', 'declined', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
  pickup_location GEOGRAPHY(POINT, 4326),
  delivery_location GEOGRAPHY(POINT, 4326),
  distance_km DECIMAL(5,2),
  delivery_fee DECIMAL(10,2),
  offered_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Voice commands log
CREATE TABLE voice_commands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  intent TEXT,
  entities JSONB,
  action_taken TEXT,
  success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE boda_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_commands ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: users can read/update their own, admins can read all
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products: all authenticated can read
CREATE POLICY "Authenticated can read products" ON products FOR SELECT USING (auth.role() = 'authenticated');

-- Retailer inventory: retailer owns their inventory
CREATE POLICY "Retailer owns inventory" ON retailer_inventory FOR ALL USING (retailer_id = auth.uid());

-- Supplier listings: supplier owns their listings, retailers can read active ones
CREATE POLICY "Supplier owns listings" ON supplier_listings FOR ALL USING (supplier_id = auth.uid());
CREATE POLICY "Retailers can view active listings" ON supplier_listings FOR SELECT USING (is_active = true);

-- Orders: retailer/supplier/boda involved can read
CREATE POLICY "Order participants can read" ON orders FOR SELECT USING (
  retailer_id = auth.uid() OR supplier_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM boda_assignments WHERE order_id = orders.id AND boda_rider_id = auth.uid())
);
CREATE POLICY "Retailer can create orders" ON orders FOR INSERT WITH CHECK (retailer_id = auth.uid());
CREATE POLICY "Supplier can update own orders" ON orders FOR UPDATE USING (supplier_id = auth.uid());

-- Boda assignments: boda rider or order participants
CREATE POLICY "Boda can view assignments" ON boda_assignments FOR SELECT USING (
  boda_rider_id = auth.uid() OR
  EXISTS (SELECT 1 FROM orders WHERE id = boda_assignments.order_id AND (retailer_id = auth.uid() OR supplier_id = auth.uid()))
);
CREATE POLICY "Boda can update own assignments" ON boda_assignments FOR UPDATE USING (boda_rider_id = auth.uid());

-- Notifications: user owns their notifications
CREATE POLICY "User owns notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- Voice commands: user owns their commands
CREATE POLICY "User owns voice commands" ON voice_commands FOR ALL USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_supplier_listings_product ON supplier_listings(product_id);
CREATE INDEX idx_supplier_listings_location ON supplier_listings USING GIST(location);
CREATE INDEX idx_orders_retailer ON orders(retailer_id);
CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_boda_assignments_rider ON boda_assignments(boda_rider_id);
CREATE INDEX idx_boda_assignments_order ON boda_assignments(order_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_retailer_inventory_retailer ON retailer_inventory(retailer_id);

-- Function to calculate distance
CREATE OR REPLACE FUNCTION calculate_distance(point1 GEOGRAPHY, point2 GEOGRAPHY)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN ROUND(ST_Distance(point1, point2) / 1000.0, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger for low stock notifications
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
DECLARE
  retailer_profile RECORD;
BEGIN
  IF NEW.current_stock <= NEW.low_stock_threshold THEN
    SELECT * INTO retailer_profile FROM profiles WHERE id = NEW.retailer_id;
    
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.retailer_id,
      'low_stock',
      'Low Stock Alert',
      'Your stock of ' || (SELECT name FROM products WHERE id = NEW.product_id) || ' is running low (' || NEW.current_stock || ' ' || (SELECT unit FROM products WHERE id = NEW.product_id) || ' remaining)',
      jsonb_build_object(
        'product_id', NEW.product_id,
        'current_stock', NEW.current_stock,
        'threshold', NEW.low_stock_threshold
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_low_stock_check
  AFTER UPDATE ON retailer_inventory
  FOR EACH ROW
  WHEN (OLD.current_stock > NEW.low_stock_threshold AND NEW.current_stock <= NEW.low_stock_threshold)
  EXECUTE FUNCTION check_low_stock();

-- Seed products
INSERT INTO products (name, category, unit) VALUES
  ('Maize', 'Grains', 'kg'),
  ('Beans', 'Grains', 'kg'),
  ('Rice', 'Grains', 'kg'),
  ('Wheat', 'Grains', 'kg'),
  ('Tomatoes', 'Vegetables', 'kg'),
  ('Onions', 'Vegetables', 'kg'),
  ('Potatoes', 'Vegetables', 'kg'),
  ('Cabbage', 'Vegetables', 'kg'),
  ('Bananas', 'Fruits', 'kg'),
  ('Avocados', 'Fruits', 'kg'),
  ('Milk', 'Dairy', 'litres'),
  ('Eggs', 'Dairy', 'trays'),
  ('Cooking Oil', 'Essentials', 'litres'),
  ('Sugar', 'Essentials', 'kg'),
  ('Salt', 'Essentials', 'kg')
ON CONFLICT DO NOTHING;