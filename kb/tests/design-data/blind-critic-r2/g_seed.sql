-- G seed, all times relative to now(). Run as superuser.
insert into auth.users(id) select ('00000000-0000-0000-0000-0000000000'||lpad(i::text,2,'0'))::uuid from generate_series(1,40) i;
-- ids: 01 ownerA, 02 staffA, 03 staffB, 04 ownerB, 05 dual instructor (staff A and B), 11..18 members A, 19 member A+B, 20 member B only
insert into tenants(id,slug,name,currency) values
 ('aaaaaaaa-0000-0000-0000-000000000000','gym-a','Gym A','GBP'),
 ('bbbbbbbb-0000-0000-0000-000000000000','gym-b','Gym B','GBP');
insert into locations(id,tenant_id,name,address,timezone) values
 ('aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-0000-0000-0000-000000000000','Wall A','1 A St','Europe/London'),
 ('bbbbbbbb-1111-0000-0000-000000000000','bbbbbbbb-0000-0000-0000-000000000000','Wall B','1 B St','Europe/London');
create function pg_temp.u(i int) returns uuid language sql as $$ select ('00000000-0000-0000-0000-0000000000'||lpad(i::text,2,'0'))::uuid $$;
insert into tenant_users(tenant_id,user_id,role,display_name,email) values
 ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(1),'owner','Owner A','o1@x'),
 ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(2),'staff','Staff A','s2@x'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(3),'staff','Staff B','s3@x'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(4),'owner','Owner B','o4@x'),
 ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(5),'staff','Dual','d5@x'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(5),'staff','Dual','d5@x'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(19),'member','Both A and B','m19@x'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(20),'member','B only','m20@x');
insert into tenant_users(tenant_id,user_id,role,display_name,email)
 select 'aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(i),'member','Member '||i,'m'||i||'@x' from generate_series(11,19) i;
insert into tenant_users(tenant_id,user_id,role,display_name,email)
 select 'aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(i),'member','Burst '||i,'b'||i||'@x' from generate_series(21,40) i;
insert into class_types(id,tenant_id,name) values
 ('aaaaaaaa-2222-0000-0000-000000000000','aaaaaaaa-0000-0000-0000-000000000000','Intro to Bouldering'),
 ('bbbbbbbb-2222-0000-0000-000000000000','bbbbbbbb-0000-0000-0000-000000000000','Intro to Bouldering');
insert into plans(id,tenant_id,kind,name,price_amount,currency,stripe_price_id) values
 ('aaaaaaaa-3333-0000-0000-000000000000','aaaaaaaa-0000-0000-0000-000000000000','monthly_pass','Monthly',5500,'GBP','price_a'),
 ('bbbbbbbb-3333-0000-0000-000000000000','bbbbbbbb-0000-0000-0000-000000000000','monthly_pass','Monthly',5500,'GBP','price_b');
-- active pass for everyone in A except 16 (past due), 17 (no pass)
insert into subscriptions(tenant_id,member_user_id,plan_id,stripe_subscription_id,status,current_period_end)
 select 'aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(i),'aaaaaaaa-3333-0000-0000-000000000000','sub_a'||i,'active',now()+interval '20 days'
 from generate_series(11,40) i where i not in (16,17,20);
insert into subscriptions(tenant_id,member_user_id,plan_id,stripe_subscription_id,status,current_period_end,payment_failed_at,grace_until)
 values ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(16),'aaaaaaaa-3333-0000-0000-000000000000','sub_a16','past_due',now()-interval '5 days',now()-interval '5 days',now()+interval '2 days');
insert into subscriptions(tenant_id,member_user_id,plan_id,stripe_subscription_id,status,current_period_end)
 values ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(20),'bbbbbbbb-3333-0000-0000-000000000000','sub_b20','active',now()+interval '20 days');
-- sessions in A (instructor = owner 1 unless noted). sNN ids
create function pg_temp.s(i int) returns uuid language sql as $$ select ('aaaaaaaa-5555-0000-0000-0000000000'||lpad(i::text,2,'0'))::uuid $$;
insert into class_sessions(id,tenant_id,location_id,class_type_id,instructor_user_id,starts_at,ends_at,capacity,created_by) values
 (pg_temp.s(1),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '3 days',now()+interval '3 days 90 min',2,pg_temp.u(1)),   -- last place race
 (pg_temp.s(2),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '4 days',now()+interval '4 days 90 min',2,pg_temp.u(1)),   -- waitlist cancels
 (pg_temp.s(3),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '6 hours',now()+interval '7 hours 30 min',10,pg_temp.u(1)), -- late cancel
 (pg_temp.s(4),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '1 day',now()+interval '1 day 90 min',10,pg_temp.u(1)),     -- inside grace
 (pg_temp.s(5),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '5 days',now()+interval '5 days 90 min',10,pg_temp.u(1)),   -- after grace
 (pg_temp.s(6),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '2 days',now()+interval '2 days 90 min',5,pg_temp.u(1)),    -- burst 20 vs 5
 (pg_temp.s(7),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(5),now()+interval '1 day 2 hours',now()+interval '1 day 3 hours',10,pg_temp.u(1)),  -- dual instructor at A
 (pg_temp.s(8),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '6 days',now()+interval '6 days 90 min',3,pg_temp.u(1)),   -- capacity lower
 (pg_temp.s(9),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(1),now()+interval '7 days',now()+interval '7 days 90 min',1,pg_temp.u(1));   -- waitlist+cancel race
