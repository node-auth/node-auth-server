/********************************** Seed data **********************************/
/*
 * Note: These are the default api, application, permission and etc.
 * these will be used to create other api, permission and etc
 * deletion to any of these record must be restricted */

/* Organization */
/* Note: this organization is default and the owner of the authentication
 * this is used for referencing only.
 * this organization must be non-modifiable
 * you can create your own separate organization
 * if you want to modify this organization and its applications
 * you can add users inside this organization */
insert into organizations (
	name,description,website,email,phone,address_line1,address_line2,city,region,postal_code,state,country,logo_url,is_default
) values (
	'Node Auth',
	'Node authentication software provider',
	'https://github.com/xreyc/node_auth',
	'nodeauth@yopmail.com',
	'phone',
	'address_line1',
	'address_line2',
	'city',
	'region',
	'0000',
	'state',
	'country',
	'logo_url',
	true
);

/* Create root user */
insert into users (
	username, first_name, last_name, email, is_active, is_email_verified, is_phone_verified, is_verified, is_two_factor_enabled, is_lockout, organization_id
) values (
	'admin',
	'John',
	'Doe',
	'admin@yopmail.com',
	true,
	true,
	false,
	true,
	false,
	false,
	1
);
insert into user_auths (password, user_id) values ('change this password', 1);
/* Here we create a token for password reset
 * use the code below
 * Token types
 * PR - Password Reset Token
 * RT - Reset Token
 * EC - Email Confirmation Token
 * PC - Phone Confirmation Token
 * 2FA - Two-Factor Auth Token
 * ST - Security Token 
 * CT - Custom Token */
insert into user_tokens (name, value, staus, user_id) values ('PR', 'XHSKSS', 'PENDING', 1);

/* Api */
/* Note: These apis are default */
insert into apis (api_name, api_identifier, api_type, is_default, organization_id) values ('Node Auth Server', 'http://localhost:9000', 'AUTH', true, 1);

/* Permission */
/* Note: These permissions are default */
insert into permissions (permission_identifier, permission_description, is_default)
values
('openid','User unique identifier', true),
('profile','User name, nickname, picture, and profile URL', true),
('email','User email', true),
('phone','User phone', true),
('address','User address', true),
('offline_access','Allow long live access by providing refresh token', true),
('roles','User roles and permissions', true),
('groups','User groups and permissions', true),
('public:read', 'Read permission for public api', true),
('public:write', 'Write permission for public api', true),
('public:delete', 'Delete permission for public api', true),
('admin:read', 'Delete permission for admin api', true),
('admin:write', 'Delete permission for admin api', true),
('admin:delete', 'Delete permission for admin api', true);

/* Api Permission */
insert into api_permissions (api_id, permission_id)
values
(1,1),(1,2),(1,3),(1,4),(1,5),
(1,6),(1,7),(1,8),(1,9),(1,10),
(1,11),(1,12),(1,13),(1,14);

/* Application */
/* Note: these applications are the default applications */
insert into applications
(name, description, domain, client_id, client_secret, application_type, is_default, organization_id)
values
('Node Auth Web', 'Web authentication', 'http://localhost:9000/v1/oauth/5xIkCPnv4X', 'QSzqp99Ow8BIGZrHmN0mtaIInpuzhewZ', 'y4oVmZrnwkudsphu5LaNEc6sL11wBT7H', 'WEB', true, 1),
('Node Auth SPA', 'Web authentication', 'http://localhost:9000/v1/oauth/LzzbZmBlzC', 'pHGK62kiClP1mDKJSMlpcNCFfdljraCP', 'AQ24vLkjCh0lg1MoFRwMRfSZaQHapE8l', 'SPA', true, 1),
('Node Auth Native', 'Web authentication', 'http://localhost:9000/v1/oauth/CrBxHdd4EQ', 'IKnvR3tA3GtLUdiu6iSHKcS9uTvhGzSD', 'o8caPwdkOGLf1jka7TWOK9mdxeS59CAy', 'NATIVE', true, 1),
('Node Auth M2M', 'Machine to machine authentication', 'http://localhost:9000/v1/oauth/8sA7XiDYMp', '2hvM1Onk4E9aM36yTvem254KXBUswY66', 'hFPF62BzybVdvTVBlqIn2DuAW9oLCQSs', 'M2M', true, 1);

/* Application Permission */
/* note: application permissions are applicable only to M2M applications */
insert into application_permissions (application_id, permission_id)
values
(4,1),(4,2),(4,3),(4,4),(4,5), /* M2M Permissions */
(4,6),(4,7),(4,8),(4,9),(4,10),
(4,11),(4,12),(4,13),(4,14);

/* Application url */
/* Note: these callback urls are default */
insert into callback_urls (url, application_id, is_default)
values
('http://localhost:9000/callback', 1, true),
('http://localhost:9000/callback', 2, true),
('http://localhost:9000/callback', 3, true),
('http://localhost:9000/callback', 4, true);

/* Role */
/* Note: these are roles default */
insert into roles (name, code, is_default, organization_id)
values
('Root', 'ROOT', true, 1),
('Administrator', 'ADMIN', true, 1),
('Registered', 'REG', true, 1),
('Anonymous', 'ANON', true, 1),
('Developer', 'DEV', true, 1);

/* Role Permissions */
insert into role_permissions (role_id, permission_id)
values
(1,1),(1,2),(1,3),(1,4),(1,5), /* Root Permissions */
(1,6),(1,7),(1,8),(1,9),(1,10),
(1,11),(1,12),(1,13),(1,14),
(2,1),(2,2),(2,3),(2,4),(2,5), /* Admin Permissions */
(2,6),(2,7),(2,8),(2,9),(2,10),
(2,11),(2,12),(2,13),(2,14),
(3,1),(3,2),(3,3),(3,4),(3,5), /* Registered Permissions */
(3,6),(3,7),(3,8),(3,9),(3,10),
(3,11),
(4,9),(4,10),(4,11), /* Registered Permissions */
(5,1),(5,2),(5,3),(5,4),(5,5), /* Registered Permissions */
(5,6),(5,7),(5,8),(5,9),(5,10),
(5,11);

/* User Roles*/
insert into user_roles (user_id, role_id) values (1, 1);