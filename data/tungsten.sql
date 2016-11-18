DROP TABLE IF EXISTS users_image;
DROP TABLE IF EXISTS image_history;
DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS relationship;
DROP TABLE IF EXISTS family_person;
DROP TABLE IF EXISTS person_alias;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS membership_request;
DROP TABLE IF EXISTS family;

/**
 * Family table tracks information about various families tracked in the
 * database.
 */
CREATE TABLE family
(
    family_id bigserial not null primary key,
    family_name varchar(32) not null
);

/*
 * This table contains membership requests to join the Tungsten website.
 */
CREATE TABLE membership_request
(
    membership_request_id bigserial not null primary key,
    first_name varchar(32) not null,
    middle_name varchar(32),
    last_name varchar(32) not null,
    nick_name varchar(32),
    email varchar(256) not null,
    comments varchar(1024),
    family_name varchar(32),
    created timestamp not null default now()
);

CREATE TABLE person
(
    person_id bigserial not null primary key,
    first_name varchar(32) not null,
    middle_name varchar(32),
    last_name varchar(32) not null,
    nick_name varchar(32),
    sex char(1) check (sex IN ('M', 'F')),
    dob date,
    dod date
);

CREATE TABLE users
(
    user_name varchar(20) not null primary key,
    password text not null,
    email varchar(256) not null unique,
    person_id bigint not null unique,
    active boolean not null default false,
    FOREIGN KEY (person_id)
        REFERENCES person (person_id)
);

CREATE TABLE person_alias
(
    person_alias_id bigserial not null primary key,
    person_id bigint not null,
    first_name varchar(20),
    middle_name varchar(20),
    last_name varchar(20),
    nick_name varchar(20),
    description varchar(256) not null,
    start_date date,
    end_date date,
    FOREIGN KEY (person_id) REFERENCES person (person_id)
);

CREATE TABLE family_person
(
    family_person_id bigserial not null primary key,
    family_id bigint not null,
    person_id bigint not null,
    FOREIGN KEY (family_id) REFERENCES family (family_id),
    FOREIGN KEY (person_id) REFERENCES person (person_id)
);

CREATE UNIQUE INDEX family_person_idx
ON family_person (family_id, person_id);

CREATE TABLE relationship 
(
    relationship_id bigserial not null primary key,
    description varchar(32) not null,
    reciprocal_description varchar(32),
    male_description varchar(32),
    female_description varchar(32),
    male_reciprocal_description varchar(32),
    female_reciprocal_description varchar(32)
);

CREATE TABLE image
(
    image_id bigserial not null primary key,
    image_data bytea not null,
    image_leader char(32) not null,
    file_name varchar(256),
    mime_type varchar(32) not null
);

CREATE TABLE image_history
(
    image_history_id bigserial not null primary key,
    image_id bigint not null,
    added timestamp not null default now(),
    added_by varchar(20) not null,
    FOREIGN KEY (added_by) REFERENCES users (user_name)
);

CREATE TABLE users_image
(
    users_image_id bigserial not null primary key,
    image_id bigint not null,
    user_name varchar(20) not null,
    FOREIGN KEY (image_id) REFERENCES image (image_id),
    FOREIGN KEY (user_name) REFERENCES users (user_name)
);

CREATE UNIQUE INDEX users_image_idx
ON users_image (image_id, user_name);

INSERT INTO relationship 
(description, reciprocal_description, male_description, female_description, male_reciprocal_description, female_reciprocal_description)
values ('parent of', 'child of', 'father of', 'mother of', 'son of', 'daughter of');

INSERT INTO relationship 
(description, male_description, female_description)
values ('sibling of', 'brother of', 'sister of');

INSERT INTO family (family_name) VALUES ('Vaughan');

INSERT INTO person (first_name, last_name, nick_name, sex) VALUES ('Joseph', 'Vaughan', 'Joe', 'M');

INSERT INTO family_person (family_id, person_id) VALUES ((SELECT currval('family_family_id_seq')), (SELECT currval('person_person_id_seq')));

INSERT INTO person (first_name, middle_name, last_name, nick_name, dob, sex) VALUES ('Christopher', 'Joseph', 'Vaughan', 'Chris', '12/11/1966', 'M');

INSERT INTO family_person (family_id, person_id) VALUES ((SELECT currval('family_family_id_seq')), (SELECT currval('person_person_id_seq')));

INSERT INTO person (first_name, last_name, nick_name, sex) VALUES ('Elizabeth', 'Murphy', 'Beth', 'F');

INSERT INTO family_person (family_id, person_id) VALUES ((SELECT currval('family_family_id_seq')), (SELECT currval('person_person_id_seq')));

INSERT INTO person_alias (person_id, last_name, description) VALUES((SELECT currval('person_person_id_seq')), 'Vaughan', 'maiden');
INSERT INTO person_alias (person_id, last_name, description) VALUES((SELECT currval('person_person_id_seq')), 'Clark', 'married');
INSERT INTO person_alias (person_id, last_name, description) VALUES((SELECT currval('person_person_id_seq')), 'Clark-Burrell', 'married');

INSERT INTO person (first_name, last_name, sex) VALUES ('Diane', 'Cole', 'F');

INSERT INTO family_person (family_id, person_id) VALUES ((SELECT currval('family_family_id_seq')), (SELECT currval('person_person_id_seq')));

INSERT INTO person_alias (person_id, last_name, description) VALUES((SELECT currval('person_person_id_seq')), 'Vaughan', 'maiden');

SELECT p.*, pa.*
FROM person AS p
INNER JOIN family_person AS fp ON p.person_id = fp.person_id
LEFT OUTER JOIN person_alias AS pa ON pa.person_id = p.person_id
INNER JOIN family AS f ON f.family_id = fp.family_id
WHERE f.family_name = 'Vaughan';