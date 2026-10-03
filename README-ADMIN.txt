WILPATTU SAFARI — BOOKING + WHATSAPP + ADMIN

WHAT CHANGED
1. A successful booking is saved to Supabase safari_bookings.
2. After saving, the site opens WhatsApp with the full booking details pre-filled.
3. An "Admin" page is included at admin.html.
4. Admin signs in using an existing Supabase Authentication email/password account.
5. Admin can see bookings and change status: Pending / Confirmed / Completed / Cancelled.

ONE-TIME SUPABASE STEP
Run the contents of supabase-schema.sql in Supabase SQL Editor. The important added policies are:
- Authenticated admins can view safari_bookings.
- Authenticated admins can update safari_bookings.

Then use your existing Supabase Auth admin email/password at:
https://YOUR-DOMAIN/admin.html

WHATSAPP NUMBER
Current number is the same number already shown in this site footer: +94 70 465 8975.
It is stored in supabase-config.js as WILPATTU_WHATSAPP.
