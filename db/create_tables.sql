-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table 'organizations'
CREATE TABLE organizations (
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
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'organization_uuid'
CREATE UNIQUE INDEX organizations_organization_uuid_idx ON organizations (organization_uuid);


/******************************/
-- Create table 'users'
CREATE TABLE users (
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
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_phone_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_two_factor_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    is_lockout BOOLEAN DEFAULT FALSE NOT NULL,
    lockout_end DATE,
    access_failed_count INTEGER DEFAULT 0 NOT NULL,
    extended_info JSONB NOT NULL DEFAULT '{}',
    organization_id INTEGER,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'user_uuid'
CREATE UNIQUE INDEX users_user_uuid_idx ON users (user_uuid);

-- Add index on 'organization_id'
CREATE INDEX users_organization_id_idx ON users (organization_id);

-- Add foreign key constraints
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


/******************************/
-- Create table 'user_auths'
CREATE TABLE user_auths (
    user_auth_id SERIAL PRIMARY KEY,
    user_auth_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    password VARCHAR(512),
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'user_auth_uuid'
CREATE UNIQUE INDEX user_auths_user_auth_uuid_idx ON user_auths (user_auth_uuid);

-- Add index on 'user_id'
CREATE INDEX user_auths_user_id_idx ON user_auths (user_id);

-- Add foreign key constraint
ALTER TABLE user_auths
    ADD CONSTRAINT user_auths_user_id_fk
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
   
   
/******************************/
-- Create table 'roles'
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    organization_id INTEGER NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'role_uuid'
CREATE UNIQUE INDEX roles_role_uuid_idx ON roles (role_uuid);

-- Add index on 'code'
CREATE INDEX roles_code_idx ON roles (code);

-- Add index on 'organization_id'
CREATE INDEX roles_organization_id_idx ON roles (organization_id);

-- Add foreign key constraints
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

   
/******************************/
-- Create table 'user_roles'
CREATE TABLE user_roles (
    user_role_id SERIAL PRIMARY KEY,
    user_role_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'user_role_uuid'
CREATE UNIQUE INDEX user_roles_user_role_uuid_idx ON user_roles (user_role_uuid);

-- Add index on 'user_id'
CREATE INDEX user_roles_user_id_idx ON user_roles (user_id);

-- Add index on 'role_id'
CREATE INDEX user_roles_role_id_idx ON user_roles (role_id);

-- Add foreign key constraints
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
   
   
/******************************/
-- Create table 'apis'
CREATE TABLE apis (
    api_id SERIAL PRIMARY KEY,
    api_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    api_identifier VARCHAR(512) NOT NULL,
    api_type VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    organization_id INTEGER NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'api_uuid'
CREATE UNIQUE INDEX apis_api_uuid_idx ON apis (api_uuid);

-- Add index on 'api_identifier'
CREATE INDEX apis_api_identifier_idx ON apis (api_identifier);

-- Add index on 'organization_id'
CREATE INDEX apis_organization_id_idx ON apis (organization_id);

-- Add foreign key constraints
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

    
/******************************/
-- Create table 'permissions'
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    permission_identifier VARCHAR(255) NOT NULL,
    permission_description VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'permission_uuid'
CREATE UNIQUE INDEX permissions_permission_uuid_idx ON permissions (permission_uuid);

-- Add index on 'permission_identifier'
CREATE INDEX permissions_permission_identifier_idx ON permissions (permission_identifier);

-- Add foreign key constraints
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


/******************************/
-- Create table 'api_permissions'
CREATE TABLE api_permissions (
    api_permission_id SERIAL PRIMARY KEY,
    api_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    api_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'api_permission_uuid'
CREATE UNIQUE INDEX api_permissions_api_permission_uuid_idx ON api_permissions (api_permission_uuid);

-- Add index on 'api_id'
CREATE INDEX api_permissions_api_id_idx ON api_permissions (api_id);

-- Add index on 'permission_id'
CREATE INDEX api_permissions_permission_id_idx ON api_permissions (permission_id);

-- Add foreign key constraints
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
   
   
/******************************/
-- Create table 'user_permissions'
CREATE TABLE user_permissions (
    user_permission_id SERIAL PRIMARY KEY,
    user_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    user_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'user_permission_uuid'
CREATE UNIQUE INDEX user_permissions_user_permission_uuid_idx ON user_permissions (user_permission_uuid);

-- Add index on 'user_id'
CREATE INDEX user_permissions_user_id_idx ON user_permissions (user_id);

-- Add index on 'permission_id'
CREATE INDEX user_permissions_permission_id_idx ON user_permissions (permission_id);

-- Add foreign key constraints
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

   
/******************************/
-- Create table 'role_permissions'
CREATE TABLE role_permissions (
    role_permission_id SERIAL PRIMARY KEY,
    role_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'role_permission_uuid'
CREATE UNIQUE INDEX role_permissions_role_permission_uuid_idx ON role_permissions (role_permission_uuid);

-- Add index on 'role_id'
CREATE INDEX role_permissions_role_id_idx ON role_permissions (role_id);

-- Add index on 'permission_id'
CREATE INDEX role_permissions_permission_id_idx ON role_permissions (permission_id);

-- Add foreign key constraints
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


/******************************/
-- Create table 'applications'
CREATE TABLE applications (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'application_uuid'
CREATE UNIQUE INDEX applications_application_uuid_idx ON applications (application_uuid);

-- Add index on 'domain'
CREATE INDEX applications_domain_idx ON applications (domain);

-- Add index on 'client_id'
CREATE UNIQUE INDEX applications_client_id_idx ON applications (client_id);

-- Add index on 'client_secret'
CREATE UNIQUE INDEX applications_client_secret_idx ON applications (client_secret);

-- Add index on 'organization_id'
CREATE INDEX applications_organization_id_idx ON applications (organization_id);

-- Add foreign key constraint on 'organization_id'
ALTER TABLE applications
    ADD CONSTRAINT applications_organization_id_fk
    FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- Add foreign key constraint on 'created_by'
ALTER TABLE applications
    ADD CONSTRAINT applications_created_by_fk
    FOREIGN KEY (created_by)
    REFERENCES users(user_id)
    ON UPDATE SET NULL
    ON DELETE SET NULL;

-- Add foreign key constraint on 'updated_by'
ALTER TABLE applications
    ADD CONSTRAINT applications_updated_by_fk
    FOREIGN KEY (updated_by)
    REFERENCES users(user_id)
    ON UPDATE SET NULL
    ON DELETE SET NULL;
   

/******************************/
-- Create table 'application_permissions'
CREATE TABLE application_permissions (
    application_permission_id SERIAL PRIMARY KEY,
    application_permission_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    application_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'application_permission_uuid'
CREATE UNIQUE INDEX app_permissions_app_permission_uuid_idx ON application_permissions (application_permission_uuid);

-- Add index on 'application_id'
CREATE INDEX app_permissions_application_id_idx ON application_permissions (application_id);

-- Add index on 'permission_id'
CREATE INDEX app_permissions_permission_id_idx ON application_permissions (permission_id);

-- Add foreign key constraint on 'application_id'
ALTER TABLE application_permissions
    ADD CONSTRAINT app_permissions_application_id_fk
    FOREIGN KEY (application_id)
    REFERENCES applications(application_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- Add foreign key constraint on 'permission_id'
ALTER TABLE application_permissions
    ADD CONSTRAINT app_permissions_permission_id_fk
    FOREIGN KEY (permission_id)
    REFERENCES permissions(permission_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- Add foreign key constraint on 'created_by'
ALTER TABLE application_permissions
    ADD CONSTRAINT app_permissions_created_by_fk
    FOREIGN KEY (created_by)
    REFERENCES users(user_id)
    ON UPDATE SET NULL
    ON DELETE SET NULL;

-- Add foreign key constraint on 'updated_by'
ALTER TABLE application_permissions
    ADD CONSTRAINT app_permissions_updated_by_fk
    FOREIGN KEY (updated_by)
    REFERENCES users(user_id)
    ON UPDATE SET NULL
    ON DELETE SET NULL;


/******************************/
-- Create table 'authorization_codes'
CREATE TABLE authorization_codes (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'authorization_code_uuid'
CREATE UNIQUE INDEX authorization_codes_authorization_code_uuid_idx ON authorization_codes (authorization_code_uuid);

-- Add index on 'code'
CREATE INDEX authorization_codes_code_idx ON authorization_codes (code);

-- Add index on 'client_id'
CREATE INDEX authorization_codes_client_id_idx ON authorization_codes (client_id);


/******************************/
-- Create table 'user_tokens'
CREATE TABLE user_tokens (
    user_token_id SERIAL PRIMARY KEY,
    user_token_uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    name VARCHAR(10) NOT NULL,
    value VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'user_token_uuid'
CREATE UNIQUE INDEX user_tokens_user_token_uuid_idx ON user_tokens (user_token_uuid);

-- Add index on 'value'
CREATE INDEX user_tokens_value_idx ON user_tokens (value);

-- Add index on 'user_id'
CREATE INDEX user_tokens_user_id_idx ON user_tokens (user_id);

-- Add foreign key constraint
ALTER TABLE user_tokens
	ADD CONSTRAINT user_tokens_user_id_fk
	FOREIGN KEY (user_id)
	REFERENCES users(user_id)
	ON UPDATE CASCADE
	ON DELETE CASCADE;


/******************************/
-- Create table 'callback_urls'
CREATE TABLE callback_urls (
    callback_url_id SERIAL PRIMARY KEY,
    callback_url_uuid UUID DEFAULT uuid_generate_v4(),
    url VARCHAR(1024) NOT NULL,
    application_id INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT false NOT NULL,
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Add index on 'callback_url_uuid'
CREATE UNIQUE INDEX callback_urls_callback_url_uuid_idx ON callback_urls (callback_url_uuid);

-- Add index on 'application_id'
CREATE INDEX callback_urls_application_id_idx ON callback_urls (application_id);

-- Add foreign key constraint
ALTER TABLE callback_urls
	ADD CONSTRAINT callback_urls_application_id_fk
	FOREIGN KEY (application_id)
	REFERENCES applications(application_id)
	ON UPDATE CASCADE
	ON DELETE CASCADE;

-- Add foreign key constraint for 'created_by' field
ALTER TABLE callback_urls
	ADD CONSTRAINT callback_urls_created_by_fk
	FOREIGN KEY (created_by)
	REFERENCES users(user_id)
	ON UPDATE SET NULL
	ON DELETE SET NULL;

-- Add foreign key constraint for 'updated_by' field
ALTER TABLE callback_urls
	ADD CONSTRAINT callback_urls_updated_by_fk
	FOREIGN KEY (updated_by)
	REFERENCES users(user_id)
	ON UPDATE SET NULL
	ON DELETE SET NULL;
