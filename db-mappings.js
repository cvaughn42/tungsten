module.exports = {

    personBusinessToDatabase: {
        firstName: 'params[]+', 
        middleName: 'params[]+?', 
        lastName: 'params[]+', 
        nickName: 'params[]+?', 
        sex: 'params[]+?', 
        dob: 'params[]+?', 
        dod: 'params[]+?'
    },
    userDatabaseToBusiness: {
        user_name: 'userName',
        first_name: 'firstName',
        middle_name: 'middleName',
        last_name: 'lastName'
    }
};