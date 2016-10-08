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
/* INSERT PERSON SQL */
DAO.INSERT_PERSON_SQL = `INSERT INTO person 
                         (first_name, middle_name, last_name, nick_name, sex, dob, dod) 
                         VALUES ($1::varchar(20), $2::varchar(20), $3::varchar(20), $4::varchar(20),
                                 $5::char(1), $6::date, $7::date)`;
/* INSERT USER SQL */
DAO.INSERT_USER_SQL = `INSERT INTO users 
                       (user_name, password, email, person_id)
                       VALUES ($1::varchar(20), $2::text, $3::varchar(256), $4::bigint)`;
/* AUTHENTICATE USER SQL */
DAO.AUTHENTICATE_USER_SQL = `SELECT u.user_name, p.first_name, p.middle_name, p.last_name
                             FROM public.user AS u 
                             INNER JOIN person AS p
                                ON u.person_id = p.person_id
                             WHERE u.user_name = $1::varchar(20) AND
                                   u.password = $2::varchar(20) AND
                                   u.active = true`;

/**
 * Insert the person object into the database
 * @param person Person to Insert
 * @param callback(err, personId)
 */
DAO.prototype.createPerson = function(person, callback) {

    // TODO Validate person?
    pool.connect(function(err, client, done) {
        if (err)
        {
            callback("Unable to create person: Error fetching client from pool: " + err);
        }
        else
        {
            var params = objectMapper(person, mappings.personBusinessToDatabase).params;
            console.dir(person);
            console.dir(params);

            client.query(DAO.INSERT_PERSON_SQL, params, function(err, result) {

                if (err)
                {
                    callback("Unable to create person: Error inserting user: " + err);
                }
                else
                {
                    console.dir(result);
                    callback(null, 1);
                }
            });
        }
    })
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