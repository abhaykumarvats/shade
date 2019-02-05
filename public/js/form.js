$(document).ready(() => {
  let username, usernameSmallText, password, passwordSmallText;


  // Trigger on every input change in username field
  $('#username').on('input', () => {
    username = $('#username').val();
    usernameSmallText = $('#username-small-text');

    // If username field is empty
    if (!username) usernameSmallText.text('');
    // If non-alphabet character is present
    else if (username.match(/[^a-z]/i))
      usernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Alphabet Characters Only');
    // If username is short
    else if (username.length < 4)
      usernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 4 Characters');
    // Show success small text
    else
      usernameSmallText
        .removeClass('text-danger')
        .addClass('text-success')
        .text('OK');
  });

  // Trigger on every input change in password field
  $('#password').on('input', () => {
    password = $('#password').val();
    passwordSmallText = $('#password-small-text');

    // If password field is empty
    if (!password) passwordSmallText.text('');
    // If password is short
    else if (password.length < 6)
      passwordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');
    // Show success small text
    else
      passwordSmallText
        .removeClass('text-danger')
        .addClass('text-success')
        .text('OK');
  });

  // Trigger on form submission
  $('#form').submit(() => {
    username = $('#username').val();
    usernameSmallText = $('#username-small-text');
    password = $('#password').val();
    passwordSmallText = $('#password-small-text');

    // If non-alphabet character is present
    if (username.match(/[^a-z]/i)) {
      usernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Alphabet Characters Only');
      return false;
    }
    // If username is short
    else if (username.length < 4) {
      usernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 4 Characters');
      return false;
    }

    // If password is short
    if (password.length < 6) {
      passwordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');
      return false;
    }

    // Inputs are valid
    $('#submit')
      .prop('disabled', true)
      .text('Please Wait...');
    return true;
  });
});
