-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organization
CREATE TABLE IF NOT EXISTS organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  email VARCHAR(100),
  phone VARCHAR(20),
  address_line1 VARCHAR(512),
  address_line2 VARCHAR(512),
  city VARCHAR(100),
  region VARCHAR(100),
  postal_code VARCHAR(20),
  state VARCHAR(100),
  country VARCHAR(100),
  logo_url VARCHAR(255),
  extended_info JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX organizations_organization_uuid_idx ON organizations (organization_uuid);

-- Users
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  user_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  username VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  last_name VARCHAR(50) NOT NULL,
  nickname VARCHAR(50),
  email VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  birthdate DATE,
  address VARCHAR(1024),
  gender VARCHAR(10),
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_email_verified BOOLEAN DEFAULT false NOT NULL,
  is_phone_verified BOOLEAN DEFAULT false NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  is_two_factor_enabled BOOLEAN DEFAULT false NOT NULL,
  is_lockout BOOLEAN DEFAULT false NOT NULL,
  lockout_end DATE,
  access_failed_count INTEGER DEFAULT 0 NOT NULL,
  extended_info JSONB NOT NULL DEFAULT '{}',
  organization_id INTEGER,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX users_user_uuid_idx ON users (user_uuid);
CREATE INDEX users_organization_id_idx ON users (organization_id);

ALTER TABLE users
  ADD CONSTRAINT users_organization_id_fk
  FOREIGN KEY (organization_id)
  REFERENCES organizations(organization_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE users
  ADD CONSTRAINT users_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE users
  ADD CONSTRAINT users_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- User Auth
CREATE TABLE IF NOT EXISTS user_auths (
  user_auth_id SERIAL PRIMARY KEY,
  user_auth_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  password VARCHAR(512),
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX user_auths_user_auth_uuid_idx ON user_auths (user_auth_uuid);
CREATE INDEX user_auths_user_id_idx ON user_auths (user_id);

ALTER TABLE user_auths
  ADD CONSTRAINT user_auths_user_id_fk
  FOREIGN KEY (user_id)
  REFERENCES users(user_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;


-- Roles
CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  organization_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX roles_role_uuid_idx ON roles (role_uuid);
CREATE INDEX roles_code_idx ON roles (code);
CREATE INDEX roles_organization_id_idx ON roles (organization_id);

ALTER TABLE roles
  ADD CONSTRAINT roles_organization_id_fk
  FOREIGN KEY (organization_id)
  REFERENCES organizations(organization_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE roles
  ADD CONSTRAINT roles_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE roles
  ADD CONSTRAINT roles_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- User Role
CREATE TABLE IF NOT EXISTS user_roles (
  user_role_id SERIAL PRIMARY KEY,
  user_role_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX user_roles_user_role_uuid_idx ON user_roles (user_role_uuid);
CREATE INDEX user_roles_user_id_idx ON user_roles (user_id);
CREATE INDEX user_roles_role_id_idx ON user_roles (role_id);

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_user_id_fk
  FOREIGN KEY (user_id)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_role_id_fk
  FOREIGN KEY (role_id)
  REFERENCES roles(role_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE user_roles
  ADD CONSTRAINT user_roles_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- Api
CREATE TABLE IF NOT EXISTS apis (
  api_id SERIAL PRIMARY KEY,
  api_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  api_name VARCHAR(50) NOT NULL,
  api_identifier VARCHAR(512) NOT NULL,
  api_type VARCHAR(10) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  organization_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX apis_api_uuid_idx ON apis (api_uuid);
CREATE INDEX apis_api_identifier_idx ON apis (api_identifier);
CREATE INDEX apis_organization_id_idx ON apis (organization_id);

ALTER TABLE apis
  ADD CONSTRAINT apis_organization_id_fk
  FOREIGN KEY (organization_id)
  REFERENCES organizations(organization_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE apis
  ADD CONSTRAINT apis_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE apis
  ADD CONSTRAINT apis_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
  permission_id SERIAL PRIMARY KEY,
  permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  permission_identifier VARCHAR(255) NOT NULL,
  permission_description VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX permissions_permission_uuid_idx ON permissions (permission_uuid);
CREATE INDEX permissions_permission_identifier_idx ON permissions (permission_identifier);

ALTER TABLE permissions
  ADD CONSTRAINT permissions_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE permissions
  ADD CONSTRAINT permissions_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- Api Permissions
CREATE TABLE IF NOT EXISTS api_permissions (
  api_permission_id SERIAL PRIMARY KEY,
  api_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  api_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX api_permissions_api_permission_uuid_idx ON api_permissions (api_permission_uuid);
CREATE INDEX api_permissions_api_id_idx ON api_permissions (api_id);
CREATE INDEX api_permissions_permission_id_idx ON api_permissions (permission_id);

ALTER TABLE api_permissions
  ADD CONSTRAINT api_permissions_api_id_fk
  FOREIGN KEY (api_id)
  REFERENCES apis(api_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE api_permissions
  ADD CONSTRAINT api_permissions_permission_id_fk
  FOREIGN KEY (permission_id)
  REFERENCES permissions(permission_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE api_permissions
  ADD CONSTRAINT api_permissions_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE api_permissions
  ADD CONSTRAINT api_permissions_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- User Permission
CREATE TABLE IF NOT EXISTS user_permissions (
  user_permission_id SERIAL PRIMARY KEY,
  user_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  user_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX user_permissions_permission_uuid_idx ON user_permissions (user_permission_uuid);
CREATE INDEX user_permissions_user_id_idx ON user_permissions (user_id);
CREATE INDEX user_permissions_permission_id_idx ON user_permissions (permission_id);

ALTER TABLE user_permissions
  ADD CONSTRAINT user_permissions_user_id_fk
  FOREIGN KEY (user_id)
  REFERENCES users(user_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE user_permissions
  ADD CONSTRAINT user_permissions_permission_id_fk
  FOREIGN KEY (permission_id)
  REFERENCES permissions(permission_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE user_permissions
  ADD CONSTRAINT user_permissions_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE user_permissions
  ADD CONSTRAINT user_permissions_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- Role Permission
CREATE TABLE IF NOT EXISTS role_permissions (
  role_permission_id SERIAL PRIMARY KEY,
  role_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX role_permissions_permission_uuid_idx ON role_permissions (role_permission_uuid);
CREATE INDEX role_permissions_role_id_idx ON role_permissions (role_id);
CREATE INDEX role_permissions_permission_id_idx ON role_permissions (permission_id);

ALTER TABLE role_permissions
  ADD CONSTRAINT role_permissions_role_id_fk
  FOREIGN KEY (role_id)
  REFERENCES roles(role_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE role_permissions
  ADD CONSTRAINT role_permissions_permission_id_fk
  FOREIGN KEY (permission_id)
  REFERENCES permissions(permission_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE role_permissions
  ADD CONSTRAINT role_permissions_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE role_permissions
  ADD CONSTRAINT role_permissions_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- Application
CREATE TABLE IF NOT EXISTS applications (
  application_id SERIAL PRIMARY KEY,
  application_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  domain VARCHAR(512) NOT NULL,
  client_id VARCHAR(512) UNIQUE NOT NULL,
  client_secret VARCHAR(1024) UNIQUE NOT NULL,
  application_type VARCHAR(10) NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  organization_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX applications_application_uuid_idx ON applications (application_uuid);
CREATE INDEX applications_domain_idx ON applications (domain);
CREATE UNIQUE INDEX applications_client_id_idx ON applications (client_id);
CREATE UNIQUE INDEX applications_client_secret_idx ON applications (client_secret);
CREATE INDEX applications_organization_id_idx ON applications (organization_id);

ALTER TABLE applications
  ADD CONSTRAINT applications_organization_id_fk
  FOREIGN KEY (organization_id)
  REFERENCES organizations(organization_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE applications
  ADD CONSTRAINT applications_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE applications
  ADD CONSTRAINT applications_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- Application Permission
CREATE TABLE IF NOT EXISTS application_permissions (
  application_permission_id SERIAL PRIMARY KEY,
  application_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  application_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX app_permissions_app_permission_uuid_idx ON application_permissions (application_permission_uuid);
CREATE INDEX app_permissions_application_id_idx ON application_permissions (application_id);
CREATE INDEX app_permissions_permission_id_idx ON application_permissions (permission_id);

ALTER TABLE application_permissions
  ADD CONSTRAINT app_permissions_appplication_id_fk
  FOREIGN KEY (application_id)
  REFERENCES applications(application_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE application_permissions
  ADD CONSTRAINT app_permissions_permission_id_fk
  FOREIGN KEY (permission_id)
  REFERENCES permissions(permission_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE application_permissions
  ADD CONSTRAINT app_permissions_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE application_permissions
  ADD CONSTRAINT app_permissions_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;


-- Authorization Code
CREATE TABLE IF NOT EXISTS authorization_codes (
  authorization_code_id SERIAL PRIMARY KEY,
  authorization_code_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  code VARCHAR(512) NOT NULL,
  client_id VARCHAR(512) NOT NULL,
  redirect_uri VARCHAR(1024),
  scope TEXT,
  code_challenge TEXT,
  code_challenge_method VARCHAR(5),
  response_type VARCHAR(20),
  state VARCHAR(1024),
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX authorization_codes_authorization_code_uuid_idx ON authorization_codes (authorization_code_uuid);
CREATE INDEX authorization_codes_code_idx ON authorization_codes (code);
CREATE INDEX authorization_client_id_idx ON authorization_codes (client_id);


-- User Token
CREATE TABLE IF NOT EXISTS user_tokens (
  user_token_id SERIAL PRIMARY KEY,
  user_token_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  name VARCHAR(10) NOT NULL,
  value VARCHAR(255) NOT NULL,
  status VARCHAR(10),
  user_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX user_tokens_user_token_uuid_idx ON user_tokens (user_token_uuid);
CREATE INDEX user_tokens_value_idx ON user_tokens (value);
CREATE INDEX user_tokens_user_id_idx ON user_tokens (user_id);

ALTER TABLE user_tokens
  ADD CONSTRAINT user_tokens_user_id_fk
  FOREIGN KEY (user_id)
  REFERENCES users(user_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;


-- Callback Url
CREATE TABLE IF NOT EXISTS callback_urls (
  callback_url_id SERIAL PRIMARY KEY,
  callback_url_uuid UUID DEFAULT uuid_generate_v4(),
  url VARCHAR(1024) NOT NULL,
  application_id INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT false NOT NULL,
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE UNIQUE INDEX callback_urls_callback_url_uuid_idx ON callback_urls (callback_url_uuid);
CREATE INDEX callback_urls_application_id_idx ON callback_urls (application_id);

ALTER TABLE callback_urls
  ADD CONSTRAINT callback_urls_application_id_fk
  FOREIGN KEY (application_id)
  REFERENCES applications(application_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE callback_urls
  ADD CONSTRAINT callback_urls_created_by_fk
  FOREIGN KEY (created_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

ALTER TABLE callback_urls
  ADD CONSTRAINT callback_urls_updated_by_fk
  FOREIGN KEY (updated_by)
  REFERENCES users(user_id)
  ON UPDATE SET NULL
  ON DELETE SET NULL;

-- Access Token
CREATE TABLE IF NOT EXISTS access_tokens (
  access_token_id SERIAL PRIMARY KEY,
  access_token_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  access_token TEXT,
  client_id VARCHAR(512),
  user_id INTEGER,
  scope TEXT,
  expires_at TIMESTAMP NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX access_tokens_access_token_uuid_idx ON access_tokens (access_token_uuid);
CREATE INDEX access_tokens_access_token_idx ON access_tokens (access_token);
CREATE INDEX access_tokens_client_id_idx ON access_tokens (client_id);
CREATE INDEX access_tokens_user_id_idx ON access_tokens (user_id);

ALTER TABLE access_tokens
  ADD CONSTRAINT access_tokens_user_id_fk
  FOREIGN KEY (user_id)
  REFERENCES users(user_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;


-- Refresh Token
CREATE TABLE IF NOT EXISTS refresh_tokens (
  refresh_token_id SERIAL PRIMARY KEY,
  refresh_token_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
  refresh_token TEXT,
  client_id VARCHAR(512),
  user_id INTEGER,
  scope TEXT,
  expires_at TIMESTAMP NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX refresh_tokens_refresh_token_uuid_idx ON refresh_tokens (refresh_token_uuid);
CREATE INDEX refresh_tokens_refresh_token_idx ON refresh_tokens (refresh_token);
CREATE INDEX refresh_tokens_client_id_idx ON refresh_tokens (client_id);
CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens (user_id);

ALTER TABLE refresh_tokens
  ADD CONSTRAINT refresh_tokens_user_id_fk
  FOREIGN KEY (user_id)
  REFERENCES users(user_id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;