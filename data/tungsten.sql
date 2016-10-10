DROP TABLE IF EXISTS relationship;
DROP TABLE IF EXISTS family_person;
DROP TABLE IF EXISTS person_alias;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS family;

/**
 * Family table tracks information about various families tracked in the
 * database.
 */
CREATE TABLE family
(
    family_id bigserial not null primary key,
    family_name varchar(20) not null
);

CREATE TABLE person
(
    person_id bigserial not null primary key,
    first_name varchar(20) not null,
    middle_name varchar(20),
    last_name varchar(20) not null,
    nick_name varchar(20),
    sex char(1) check (sex IN ('M', 'F')),
    dob date,
    dod date
);

CREATE TABLE users
(
    user_name varchar(20) not null primary key,
    password text not null,
    email varchar(255) not null unique,
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