-- H seed, same people and classes as g_seed.sql, all times relative to now(). Run as superuser.
insert into auth.users(id) select ('00000000-0000-0000-0000-0000000000'||lpad(i::text,2,'0'))::uuid from generate_series(1,40) i;
create function pg_temp.u(i int) returns uuid language sql as $$ select ('00000000-0000-0000-0000-0000000000'||lpad(i::text,2,'0'))::uuid $$;
insert into profiles(id,display_name) select pg_temp.u(i), 'Person '||i from generate_series(1,40) i;
insert into gyms(id,name,slug) values
 ('aaaaaaaa-0000-0000-0000-000000000000','Gym A','gym-a'),('bbbbbbbb-0000-0000-0000-000000000000','Gym B','gym-b');
insert into gym_members(gym_id,user_id,role,member_code) values
 ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(1),'owner','A001'),
 ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(2),'staff','A002'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(3),'staff','B003'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(4),'owner','B004'),
 ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(5),'staff','A005'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(5),'staff','B005'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(19),'member','B019'),
 ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(20),'member','B020');
insert into gym_members(gym_id,user_id,role,member_code)
 select 'aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(i),'member','A0'||i from generate_series(11,40) i where i<>20;
insert into locations(id,gym_id,name,time_zone) values
 ('aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-0000-0000-0000-000000000000','Wall A','Europe/London'),
 ('bbbbbbbb-1111-0000-0000-000000000000','bbbbbbbb-0000-0000-0000-000000000000','Wall B','Europe/London');
insert into class_types(id,gym_id,name) values
 ('aaaaaaaa-2222-0000-0000-000000000000','aaaaaaaa-0000-0000-0000-000000000000','Intro to Bouldering'),
 ('bbbbbbbb-2222-0000-0000-000000000000','bbbbbbbb-0000-0000-0000-000000000000','Intro to Bouldering');
insert into passes(gym_id,user_id,kind,status,price_minor,currency,stripe_subscription_id,current_period_end)
 select 'aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(i),'monthly','active',5500,'gbp','sub_a'||i,now()+interval '20 days'
 from generate_series(11,40) i where i not in (16,17,20);
insert into passes(gym_id,user_id,kind,status,price_minor,currency,stripe_subscription_id,current_period_end,payment_failed_at,grace_ends_at)
 values ('aaaaaaaa-0000-0000-0000-000000000000',pg_temp.u(16),'monthly','past_due',5500,'gbp','sub_a16',now()-interval '5 days',now()-interval '5 days',now()+interval '2 days');
insert into passes(gym_id,user_id,kind,status,price_minor,currency,stripe_subscription_id,current_period_end)
 values ('bbbbbbbb-0000-0000-0000-000000000000',pg_temp.u(20),'monthly','active',5500,'gbp','sub_b20',now()+interval '20 days');
create function pg_temp.s(i int) returns uuid language sql as $$ select ('aaaaaaaa-5555-0000-0000-0000000000'||lpad(i::text,2,'0'))::uuid $$;
create function pg_temp.lt(i interval) returns timestamp language sql as $$ select date_trunc('second', (now()+i) at time zone 'Europe/London') $$;
insert into classes(id,gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,capacity,created_by)
select pg_temp.s(n),'aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000',pg_temp.u(ins),pg_temp.lt(st),pg_temp.lt(st+len),cap,pg_temp.u(1)
from (values (1,1,interval '3 days',interval '90 min',2),(2,1,interval '4 days',interval '90 min',2),(3,1,interval '6 hours',interval '90 min',10),
             (4,1,interval '1 day',interval '90 min',10),(5,1,interval '5 days',interval '90 min',10),(6,1,interval '2 days',interval '90 min',5),
             (7,5,interval '1 day 2 hours',interval '1 hour',10),(8,1,interval '6 days',interval '90 min',3),(9,1,interval '7 days',interval '90 min',1)) v(n,ins,st,len,cap);
