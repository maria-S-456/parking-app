var LOGIN_URL = '/login';

function submitLogin()
{
  $('#login-button').on('click', function(e) {
    console.log('Logged in!');
    event.preventDefault();
    loginAccount({
      username: $('#username-input').val(),
      password: $('#password-input').val()
    });
  });
}


$(function(){
  submitLogin();
})