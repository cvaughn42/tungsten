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

pool.connect(function(err, client, done) {

    if (err)
    {
        console.log('Error fetching client from pool: ' + err);
    }
    else
    {
        client.query("SELECT * FROM public.user", function(err, result) {
            if (err)
            {
                console.log('Error from query: ' + err);
            }
            else
            {
                console.dir(result);
            }
        });
    }
});

pool.on('error', function(err, client) {
    console.error('idle client error', err.message, err.stack);
});