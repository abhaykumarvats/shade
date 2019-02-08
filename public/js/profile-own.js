$(document).ready(() => {
  const activityTab = $('#activity-tab');
  const connectionsTab = $('#connections-tab');
  const aboutTab = $('#about-tab');

  const activityContainer = $('#activity-container');
  const connectionsContainer = $('#connections-container');
  const aboutContainer = $('#about-container');

  const postForm = $('#post-form');
  const postContent = $('#content');
  const postAudience = $('#audience');

  const username = $('#username').text();
  const aboutList = $('#about-list');

  const redColor = '#dc3545';

  $.getJSON('/' + username + '/about', (json) => {
    aboutList.html(
      '<a href="#" class="list-group-item list-group-item-action">' +
        '<h6 class="mb-1">Username</h6>' +
        '<p class="mb-1">' +
        username +
        '</p>' +
        '</a>' +
        '<a href="#" class="list-group-item list-group-item-action">' +
        '<h6 class="mb-1">Password</h6>' +
        '<p class="mb-1"><em>Hidden</em>' +
        '</p>' +
        '</a>' +
        '<a href="#" class="list-group-item list-group-item-action">' +
        '<h6 class="mb-1">Shaded</h6>' +
        '<p class="mb-1">' +
        (json.consent ? 'No' : 'Yes') +
        '</p>' +
        '</a>' +
        '<a href="#" class="list-group-item list-group-item-action disabled" tabindex="-1">' +
        '<h6 class="mb-1">Joined</h6>' +
        '<p class="mb-1">' +
        new Date(json.joined)
          .toString()
          .split(' ')
          .slice(1, 4)
          .join(' ') +
        '</p>' +
        '</a>'
    );
  });

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
    // Post update
    else return true;
  });
});
