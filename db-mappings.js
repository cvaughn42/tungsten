module.exports = {

    personBusinessToDatabase: {
        firstName: 'params[]+', 
        middleName: 'params[]+?', 
        lastName: 'params[]+', 
        nickName: 'params[]+?', 
        sex: 'params[]+?', 
        dob: 'params[]+?', 
        dod: 'params[]+?',
        id: 'params[]+'
    },
    personDatabaseToBusiness: {
        person_id: 'id',
        first_name: 'firstName',
        middle_name: 'middleName',
        last_name: 'lastName',
        nick_name: 'nickName',
        sex: 'sex',
        dob: 'dob',
        dod: 'dod'
    },
    userBusinessToDatabase: {
        userName: 'params[]+',
        password: 'params[]+',
        email: 'params[]+',
        'person.id': 'params[]+'
    },
    userDatabaseToBusiness: {
        user_name: 'userName',
        email: 'email',
        person_id: 'person.id',
        first_name: 'person.firstName',
        middle_name: 'person.middleName',
        last_name: 'person.lastName',
        nick_name: 'person.nickName',
        sex: 'person.sex',
        dob: 'person.dob',
        dod: 'person.dod'
    }
};