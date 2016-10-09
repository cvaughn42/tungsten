/* Import & configure Postgres */
var pg = require('pg');

var config = {
    user: 'postgres',
    database: 'tungsten',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

/* Import object mappings */
var mappings = require('./db-mappings');

var objectMapper = require('object-mapper');

/**
 * Data Access Object (DAO) object definition
 */
function DAO()
{

}
DAO.FIND_PERSON_BY_PERSON_ID_SQL = `SELECT first_name, middle_name, last_name, 
                                           nick_name, sex, dob, dod, person_id
                                    FROM person 
                                    WHERE person_id = $1::bigint`;
DAO.INSERT_PERSON_SQL = `INSERT INTO person 
                         (first_name, middle_name, last_name, nick_name, sex, dob, dod) 
                         VALUES ($1::varchar(20), $2::varchar(20), $3::varchar(20), $4::varchar(20),
                                 $5::char(1), $6::date, $7::date)`;
DAO.INSERT_USER_SQL = `INSERT INTO users 
                       (user_name, password, email, person_id)
                       VALUES ($1::varchar(20), $2::text, $3::varchar(256), $4::bigint)`;
DAO.AUTHENTICATE_USER_SQL = `SELECT u.user_name, p.first_name, p.middle_name, p.last_name
                             FROM public.user AS u 
                             INNER JOIN person AS p
                                ON u.person_id = p.person_id
                             WHERE u.user_name = $1::varchar(20) AND
                                   u.password = $2::varchar(20) AND
                                   u.active = true`;
DAO.CREATE_PERSON_ERR = "Error creating person: ";
DAO.FIND_PERSON_ERR = "Error finding person: ";
DAO.POOL_CONNECT_ERR = "Error fetching connection from pool: ";
/**
 * Insert the person object into the database
 * @param person Person to Insert
 * @param callback(err, personId)
 */
DAO.prototype.createPerson = function(person, callback) {

    var validatePerson = function(person) {
        return (person && person.firstName && person.lastName);
    };

    this.createEntity(person, validatePerson, DAO.INSERT_PERSON_SQL, mappings.personBusinessToDatabase, 
        DAO.CREATE_PERSON_ERR, 'person', 'person_id', callback);
};

/**
 * Find the person with the specified id
 * @param personId
 * @param callback(err, person)
 */
DAO.prototype.findPerson = function(personId, callback) {
    this.findDistinctEntity(personId, DAO.FIND_PERSON_BY_PERSON_ID_SQL, 
        mappings.personDatabaseToBusiness, "personId", DAO.FIND_PERSON_ERR, callback);
};
/**
 * Create an entity
 * @param entity
 * @param validate Validation function
 * @param createEntitySql
 * @param entityMapping
 * @param errPrefix
 * @param entityName
 * @param entityIdName
 * @param callback(err, entity)
 */
DAO.prototype.createEntity = function(entity, validate, createEntitySql, entityMapping, errPrefix, entityName, entityIdName, callback) {

    if (validate(entity))
    {
        pool.connect(function(err, client, done) {
            if (err)
            {
                callback(errPrefix + DAO.POOL_CONNECT_ERR + err);
            }
            else
            {
                var params = objectMapper(entity, entityMapping).params;
            
                client.query(createEntitySql + " RETURNING " + entityIdName, params, function(err, result) {

                    if (err)
                    {
                        callback(errPrefix + "Error inserting " + entityName + ": " + err);
                    }
                    else
                    {
                        if (result.rowCount === 1)
                        {
                            callback(null, result.rows[0][entityIdName]);
                        }
                        else if (result.rowCount === 0)
                        {
                            callback(errPrefix + "No rows were created by the statement");
                        }
                        else
                        {
                            callback(errPrefix + "Multiple rows were created by the statement");
                        }
                    }
                });
            }
        })
    }
    else
    {
        callback(errPrefix + entityName + " is not valid");
    }
};
/**
 * Find a distinct entity
 * @param entityId
 * @param findEntitySql
 * @param entityMapping (database to business)
 * @param entityIdName
 * @param errPrefix
 * @param callback(err, entity)
 */
DAO.prototype.findDistinctEntity = function(entityId, findEntitySql, entityMapping, entityIdName, errPrefix, callback) {

    if (entityId)
    {
        pool.connect(function(err, client, done) {

            if (err)
            {
                callback(errPrefix + DAO.POOL_CONNECT_ERR + err);
            }
            else
            {
                client.query(findEntitySql, [entityId], function(err, result) {

                    if (err)
                    {
                        callback(errPrefix + "Error executing query: " + err);
                    }
                    else
                    {
                        if (result.rowCount === 1)
                        {
                            callback(null, objectMapper(result.rows[0], entityMapping));
                        }
                        else if (result.rowCount === 0)
                        {
                            callback(errPrefix + 'No entity found with ID ' + entityId);
                        }
                        else
                        {
                            callback(errPrefix + "Multiple entities found with ID " + entityId);
                        }
                    }
                });
            }
        });
    }
    else
    {
        callback(errPrefix + entityIdName + " is required");
    }    
};

/**
 * Authenticate the user
 * @param userName
 * @param password
 * @param callback(err, authenticatedUser)
 */
DAO.prototype.authenticateUser = function(userName, password, callback) {

    if (userName && password)
    {
        pool.connect(function(err, client, done) {
            if (err)
            {
                callback(new Error('Unable to authenticate user: Error fetching client from pool: ' + err));
            }
            else
            {
                client.query(DAO.AUTHENTICATE_USER_SQL, [userName, password], function(err, result) {
                    if (err)
                    {
                        callback(new Error('Unable to authenticate user: Error querying user: ' + err));
                    }
                    else
                    {
                        if (result.rowCount === 1)
                        {
                            callback(null, objectMapper(result.rows[0], mappings.userDatabaseToBusiness));
                        }
                        else if (result.rowCount > 1)
                        {
                            callback(new Error("Unable to authenticate user: Multiple users matched authentication criteria"));
                        }
                        else
                        {
                            callback(null, null);
                        }
                    }
                });
            }
        });
    }
    else
    {
        callback(new Error('Unable to authenticate user: user name and password are required'));
    }
};

pool.on('error', function(err, client) {
    console.error('idle client error', err.message, err.stack);
});

module.exports = new DAO();