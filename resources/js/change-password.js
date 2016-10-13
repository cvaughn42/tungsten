app.controller('change-password-controller', function($scope, $http) {

    setTimeout(function() {

        $("#changePasswordForm").validate({
            rules: {
                oldPassword: {
                    required: true
                },
                newPassword: {
                    required: true,
                    minlength: 5
                },
                confirmPassword: {
                    required: true,
                    minlength: 5,
                    equalTo: "#newPassword"
                }
            },
            messages: {
                oldPassword: "Please enter your current password",
                newPassword: {
                    required: "Please provide a new password",
                    minlength: "Your password must be at least 5 characters long"
                },
                confirmPassword: {
                    required: "Please provide a new password",
                    minlength: "Your password must be at least 5 characters long",
                    equalTo: "Your entered values do not match"
                }
            },
            submitHandler: function(form) {
                
                $http.post('/changePassword', {
                    userName: $scope.currentUser.userName,
                    oldPassword: $('#oldPassword').val(),
                    newPassword: $('#newPassword').val()
                }).success(function() {
                    // redirect to other page
                }).error(function(err) {
                    alert(err);
                });
            }
        });

    }, 500);

});

