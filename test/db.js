var dao = require('../db');
var assert = require('assert');

describe('Testing DbInterface', function() {

    it('can create new person with all fields', function(done) {

        dao.createPerson({
            firstName: 'Test',
            middleName: 'A',
            lastName: 'Person',
            nickName: 'Testy',
            dob: '1975/02/28',
            dod: '2015/12/14',
            sex: 'M'
        }, function(err, id) {
            if (err) done(err);
            else
            {
                if (!id) done(new Error("ID is not set"));
                else 
                {
                    console.log('New ID = ' + id);
                    done();
                }

            }
        });
    });
    
    it('can create new person with required fields', function(done) {

        dao.createPerson({
            firstName: 'Test',
            lastName: 'Person'
        }, function(err, id) {
            if (err) done(err);
            else
            {
                if (!id) done(new Error("ID is not set"));
                else 
                {
                    console.log('New ID = ' + id);
                    done();
                }
            }
        });
    });

    it('can find person by person ID', function(done) {

        dao.findPerson(2, function(err, person) {
            if (err)
            {
                done(err);
            }
            else
            {
                console.dir(person);
                done();
            }
        });
    });

    it('can create new user', function(done) {

        var userName = 'test_' + Math.floor(Math.random() * 100000);

        dao.createUser({
            userName: userName,
            password: 'tiger',
            email: userName + "@aol.com",
            person: {
                firstName: 'Test',
                lastName: 'User'
            }
        }, function(err) {
            if (err) done(err);
            else done();
        })
    });

    it ('can authenticate user', function(done) {

        dao.authenticateUser('test_872', 'tiger', function(err, user) {
            if (err) done(err);
            else 
            {
                if (user)
                {
                    console.dir(user);
                    done();
                }
                else
                {
                    done("Invalid user name or password");
                }
            }
        });
    });
});