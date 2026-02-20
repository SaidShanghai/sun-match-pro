
-- Allow users to update their own verification records (e.g. mark as verified)
CREATE POLICY "Users can update own verifications"
ON public.email_verifications
FOR UPDATE
USING (user_id = auth.uid());

-- Allow users to delete their own expired/used verification codes
CREATE POLICY "Users can delete own verifications"
ON public.email_verifications
FOR DELETE
USING (user_id = auth.uid());
