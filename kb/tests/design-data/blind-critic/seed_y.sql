insert into auth.users(id,email) select ('00000000-0000-0000-0000-0000000000'||lpad(n::text,2,'0'))::uuid, 'u'||n||'@t' from generate_series(1,20) n;
insert into public.tenants(id,slug,name,currency) values
 ('a0000000-0000-0000-0000-000000000001','basalt','Basalt','USD'),('a0000000-0000-0000-0000-000000000002','granite','Granite','GBP');
insert into public.locations(id,tenant_id,name,address,timezone) values
 ('b0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Eastside','1 Main','America/Denver'),
 ('b0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','North','2 High St','Europe/London');
insert into public.tenant_users(tenant_id,user_id,role,display_name,email) values
 ('a0000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','owner','Owner1','u1@t'),
 ('a0000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','staff','Staff2','u2@t'),
 ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','staff','Staff3','u3@t'),
 ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004','owner','Owner4','u4@t'),
 ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000019','member','U19 at Granite','u19@t'),
 ('a0000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000020','member','U20','u20@t');
insert into public.tenant_users(tenant_id,user_id,role,display_name,email)
 select 'a0000000-0000-0000-0000-000000000001', ('00000000-0000-0000-0000-0000000000'||n)::uuid, 'member','U'||n,'u'||n||'@t' from generate_series(10,19) n;
insert into public.class_types(id,tenant_id,name) values
 ('c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Intro to Bouldering'),
 ('c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','Lead Climbing Course');
insert into public.plans(id,tenant_id,kind,name,price_amount,currency,stripe_price_id) values
 ('d0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','monthly_pass','Monthly',7900,'USD','price_1'),
 ('d0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','monthly_pass','Monthly',5500,'GBP','price_2');
insert into public.subscriptions(tenant_id,member_user_id,plan_id,stripe_subscription_id,status,current_period_end)
 select tu.tenant_id,tu.user_id, case when tu.tenant_id='a0000000-0000-0000-0000-000000000001' then 'd0000000-0000-0000-0000-000000000001'::uuid else 'd0000000-0000-0000-0000-000000000002'::uuid end,
   'sub_'||replace(tu.tenant_id::text,'-','')||right(tu.user_id::text,2),'active',now()+interval '20 days'
 from public.tenant_users tu where role='member';
