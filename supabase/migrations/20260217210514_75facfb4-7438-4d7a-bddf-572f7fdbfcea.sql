
-- Table to store email OTP verification codes
CREATE TABLE public.email_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own verifications
CREATE POLICY "Users can view own verifications"
ON public.email_verifications
FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own verifications
CREATE POLICY "Users can create own verifications"
ON public.email_verifications
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access"
ON public.email_verifications
FOR ALL
USING (true)
WITH CHECK (true);

-- Auto-cleanup old verifications (optional index)
CREATE INDEX idx_email_verifications_lookup ON public.email_verifications (email, otp_code, verified);
CREATE INDEX idx_email_verifications_user ON public.email_verifications (user_id);
