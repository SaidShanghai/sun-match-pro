
-- =============================================
-- FIX 1: quote_requests — target authenticated role
-- =============================================
DROP POLICY IF EXISTS "Admins can view all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Only admins can update quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Only service role can insert quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can view own quote requests by email" ON public.quote_requests;

CREATE POLICY "Admins can view all quote requests"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update quote requests"
  ON public.quote_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "No direct insert on quote requests"
  ON public.quote_requests FOR INSERT TO authenticated
  WITH CHECK (false);

CREATE POLICY "Users can view own quote requests by email"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (client_email = (auth.jwt() ->> 'email'));

-- =============================================
-- FIX 2: kits — target authenticated role
-- =============================================
DROP POLICY IF EXISTS "Admins can view all kits" ON public.kits;
DROP POLICY IF EXISTS "Users can create own kits" ON public.kits;
DROP POLICY IF EXISTS "Users can delete own kits" ON public.kits;
DROP POLICY IF EXISTS "Users can update own kits" ON public.kits;
DROP POLICY IF EXISTS "Users can view own kits" ON public.kits;

CREATE POLICY "Admins can view all kits"
  ON public.kits FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own kits"
  ON public.kits FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own kits"
  ON public.kits FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own kits"
  ON public.kits FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own kits"
  ON public.kits FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- FIX 3: delivery_costs — target authenticated role
-- =============================================
DROP POLICY IF EXISTS "Admins can view all delivery costs" ON public.delivery_costs;
DROP POLICY IF EXISTS "Users can create own delivery costs" ON public.delivery_costs;
DROP POLICY IF EXISTS "Users can delete own delivery costs" ON public.delivery_costs;
DROP POLICY IF EXISTS "Users can update own delivery costs" ON public.delivery_costs;
DROP POLICY IF EXISTS "Users can view own delivery costs" ON public.delivery_costs;

CREATE POLICY "Admins can view all delivery costs"
  ON public.delivery_costs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own delivery costs"
  ON public.delivery_costs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own delivery costs"
  ON public.delivery_costs FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own delivery costs"
  ON public.delivery_costs FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own delivery costs"
  ON public.delivery_costs FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- FIX 4: partner_documents — target authenticated role
-- =============================================
DROP POLICY IF EXISTS "Admins can update all documents" ON public.partner_documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.partner_documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.partner_documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.partner_documents;
DROP POLICY IF EXISTS "Users can upload own documents" ON public.partner_documents;
DROP POLICY IF EXISTS "Users can view own documents" ON public.partner_documents;

CREATE POLICY "Admins can update all documents"
  ON public.partner_documents FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all documents"
  ON public.partner_documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own documents"
  ON public.partner_documents FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON public.partner_documents FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upload own documents"
  ON public.partner_documents FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own documents"
  ON public.partner_documents FOR SELECT TO authenticated
  USING (user_id = auth.uid());
