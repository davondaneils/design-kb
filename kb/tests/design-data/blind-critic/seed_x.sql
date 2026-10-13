-- Seed for entry X. Fixed uuids: users 0000...0NN.
insert into auth.users(id,email) select ('00000000-0000-0000-0000-0000000000'||lpad(n::text,2,'0'))::uuid, 'u'||n||'@t' from generate_series(1,20) n;
insert into public.profiles(id,display_name) select id, 'User '||right(id::text,2) from auth.users;
insert into public.gyms(id,name,slug) values
 ('a0000000-0000-0000-0000-000000000001','Basalt','basalt'),('a0000000-0000-0000-0000-000000000002','Granite','granite');
insert into public.locations(id,gym_id,name,time_zone) values
 ('b0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Eastside','America/Denver'),
 ('b0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','North','Europe/London');
-- u01 owner g1, u02 staff g1, u03 staff g2, u04 owner g2, u10..u19 members g1, u19 also member g2, u18 member g2 only? no: u18 g1
insert into public.gym_memberships(gym_id,user_id,role) values
 ('a0000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','owner'),
 ('a0000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','staff'),
 ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','staff'),
 ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004','owner'),
 ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000019','member');
insert into public.gym_memberships(gym_id,user_id,role)
 select 'a0000000-0000-0000-0000-000000000001', ('00000000-0000-0000-0000-0000000000'||n)::uuid, 'member' from generate_series(10,19) n;
-- u20 member of g2 only
insert into public.gym_memberships(gym_id,user_id,role) values ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000020','member');
insert into public.class_types(id,gym_id,name) values
 ('c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Intro to Bouldering'),
 ('c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','Lead Climbing Course');
-- monthly active passes for every member of g1 and g2 (subscription ids unique)
insert into public.passes(gym_id,user_id,kind,status,stripe_subscription_id,price_minor,currency,current_period_end)
 select gym_id,user_id,'monthly','active','sub_'||replace(gym_id::text,'-','')||right(user_id::text,2),7900,'usd',now()+interval '20 days'
 from public.gym_memberships where role='member';
