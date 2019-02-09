$(document).ready(() => {
  const username = $('#username').text();

  const activityTab = $('#activity-tab');
  const connectionsTab = $('#connections-tab');
  const aboutTab = $('#about-tab');

  const activityContainer = $('#activity-container');
  const connectionsContainer = $('#connections-container');
  const aboutContainer = $('#about-container');

  const postForm = $('#post-form');
  const postContent = $('#content');
  const postAudience = $('#audience');

  const aboutList = $('#about-list');

  const newUsernameSmallText = $('#new-username-small-text');
  const passwordSmallText = $('#password-small-text');

  const oldPasswordSmallText = $('#old-password-small-text');
  const newPasswordSmallText = $('#new-password-small-text');

  const redColor = '#dc3545';

  // Trigger when activityTab is clicked
  activityTab.click(() => {
    // Add 'active' class to activityTab, and remove from other
    connectionsTab.removeClass('active');
    aboutTab.removeClass('active');
    activityTab.addClass('active');

    // Show activityContainer, and hide other
    connectionsContainer.css('display', 'none');
    aboutContainer.css('display', 'none');
    activityContainer.css('display', 'block');

    return false;
  });

  // Trigger on every input change in postContent
  postContent.on('input', () => {
    postContent.css('border-color', '');
  });

  // Trigger on every input change in postAudience
  postAudience.on('input', () => {
    postAudience.css('border-color', '');
  });

  // Trigger on postForm submission
  postForm.submit(() => {
    // If postContent is empty
    if (!postContent.val()) {
      postContent.css('border-color', redColor);
      return false;
    }
    // If postAudience is not selected
    else if (postAudience.val() === '0') {
      postAudience.css('border-color', redColor);
      return false;
    }
    // Submit post
    else return true;
  });

  // Trigger when connectionsTab is clicked
  connectionsTab.click(() => {
    // Add 'active' class to connectionsTab, and remove from other
    activityTab.removeClass('active');
    aboutTab.removeClass('active');
    connectionsTab.addClass('active');

    // Show connectionsContainer, and hide other
    activityContainer.css('display', 'none');
    aboutContainer.css('display', 'none');
    connectionsContainer.css('display', 'block');

    return false;
  });

  // Trigger when aboutTab is clicked
  aboutTab.click(() => {
    // Add 'active' class to aboutTab, and remove from other
    activityTab.removeClass('active');
    connectionsTab.removeClass('active');
    aboutTab.addClass('active');

    // Show aboutContainer, and hide other
    activityContainer.css('display', 'none');
    connectionsContainer.css('display', 'none');
    aboutContainer.css('display', 'block');

    return false;
  });

  // Show Loading... text while loading 'about' info
  aboutList.html(
    '<a href="#" class="list-group-item disabled" tabindex="-1">' +
      '<h6 class="mb-0">' +
      'Loading...' +
      '</h6>' +
      '</a>'
  );

  // Get 'about' info
  $.getJSON('/' + username + '/about', (json) => {
    // Populate aboutList with 'about' info
    aboutList.html(
      '<a href="#" class="list-group-item list-group-item-action" ' +
        'data-toggle="modal" data-target="#username-change-modal">' +
        '<h6 class="mb-0">' +
        'Username' +
        '</h6>' +
        '<p class="mb-0">' +
        username +
        '</p>' +
        '</a>' +
        '<a href="#" class="list-group-item list-group-item-action" ' +
        'data-toggle="modal" data-target="#password-change-modal">' +
        '<h6 class="mb-0">' +
        'Password' +
        '</h6>' +
        '<p class="mb-0">' +
        '<em>Hidden</em>' +
        '</p>' +
        '</a>' +
        '<a href="#" class="list-group-item list-group-item-action">' +
        '<h6 class="mb-0">' +
        'Shaded' +
        '</h6>' +
        '<p class="mb-0">' +
        (json.consent ? 'No' : 'Yes') +
        '</p>' +
        '</a>' +
        '<a href="#" class="list-group-item disabled" tabindex="-1">' +
        '<h6 class="mb-0">' +
        'Joined' +
        '</h6>' +
        '<p class="mb-0">' +
        new Date(json.joined)
          .toString()
          .split(' ')
          .slice(1, 4)
          .join(' ') +
        '</p>' +
        '</a>'
    );
  });

  // Function to add username check on link
  function addCheck() {
    // Trigger when check is clicked
    $('#check').click(() => {
      const newUsernameValue = $('#new-username').val();

      // Show Please Wait text
      newUsernameSmallText
        .removeClass('text-danger text-success')
        .text('Please Wait...');

      // Check if new username is available
      $.getJSON('/check/' + newUsernameValue, (json) => {
        // Available
        if (json.available)
          newUsernameSmallText
            .removeClass('text-danger')
            .addClass('text-success')
            .text('Available!');
        // Not available
        else
          newUsernameSmallText
            .removeClass('text-success')
            .addClass('text-danger')
            .text('Not Available');
      });

      return false;
    });
  }

  // Trigger on every input change in new-username field
  $('#new-username').on('input', () => {
    const newUsernameValue = $('#new-username').val();

    // If newUsername field is empty
    if (!newUsernameValue) newUsernameSmallText.text('');
    // If non-alphabet character is present
    else if (newUsernameValue.match(/[^a-z]/i))
      newUsernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Alphabet Characters Only');
    // If newUsername is short
    else if (newUsernameValue.length < 4)
      newUsernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 4 Characters');
    // Show check link
    else {
      newUsernameSmallText
        .removeClass('text-danger text-success')
        .html('<a href="#" id="check">Check</a>');

      // Add username check on link
      addCheck();
    }
  });

  // Trigger on every input in password field
  $('#password').on('input', () => {
    const passwordValue = $('#password').val();

    // If password field is empty
    if (!passwordValue) passwordSmallText.text('');
    // If password is short
    else if (passwordValue.length < 6)
      passwordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');
    // Remove small text
    else passwordSmallText.text('');
  });

  // Trigger on username-change-form submission
  $('#username-change-form').submit(() => {
    const newUsernameValue = $('#new-username').val();
    const passwordValue = $('#password').val();

    // If non-alphabet character is present
    if (newUsernameValue.match(/[^a-z]/i)) {
      newUsernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Alphabet Characters Only');

      return false;
    }
    // If newUsernameValue is short
    else if (newUsernameValue.length < 4) {
      newUsernameSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 4 Characters');

      return false;
    }
    // If password is short
    else if (passwordValue.length < 6) {
      passwordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');

      return false;
    }

    // Valid inputs
    return true;
  });

  // Trigger on every input change in old password field
  $('#old-password').on('input', () => {
    const oldPassword = $('#old-password').val();

    // If old password field is empty
    if (!oldPassword) oldPasswordSmallText.text('');
    // If old password is short
    else if (oldPassword.length < 6)
      oldPasswordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');
    // Remove small text
    else oldPasswordSmallText.text('');
  });

  // Trigger on every input change in new password field
  $('#new-password').on('input', () => {
    const newPassword = $('#new-password').val();

    // If new password field is empty
    if (!newPassword) newPasswordSmallText.text('');
    // If new password is short
    else if (newPassword.length < 6)
      newPasswordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');
    // Remove small text
    else newPasswordSmallText.text('');
  });

  // Trigger on password-change-form submission
  $('#password-change-form').submit(() => {
    const oldPassword = $('#old-password').val();
    const newPassword = $('#new-password').val();

    // If invalid old password
    if (oldPassword.length < 6) {
      oldPasswordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');

      return false;
    }
    // If invalid new password
    else if (newPassword.length < 6) {
      newPasswordSmallText
        .removeClass('text-success')
        .addClass('text-danger')
        .text('Minimum 6 Characters');

      return false;
    }

    // Valid inputs
    return true;
  });
});
