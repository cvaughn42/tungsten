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

var mappings = require('./db-mappings');

var objectMapper = require('object-mapper');

/**
 * Data Access Object (DAO) object definition
 */
function DAO()
{

}
/* AUTHENTICATE USER SQL */
DAO.AUTHENTICATE_USER_SQL = `SELECT u.user_name, p.first_name, p.middle_name, p.last_name
                             FROM public.user AS u 
                             INNER JOIN person AS p
                                ON u.person_id = p.person_id
                             WHERE u.user_name = $1::varchar(20) AND
                                   u.password = $2::varchar(20) AND
                                   u.active = true`;
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