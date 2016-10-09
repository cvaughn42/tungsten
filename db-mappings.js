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
    userDatabaseToBusiness: {
        user_name: 'userName',
        first_name: 'firstName',
        middle_name: 'middleName',
        last_name: 'lastName'
    }
};