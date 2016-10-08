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
                else done();
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
                else done();
            }
        });
    });
});