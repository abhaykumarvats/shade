$(document).ready(() => {
  const username = $('#username').text();

  const activityTab = $('#activity-tab');
  const aboutTab = $('#about-tab');

  const activityContainer = $('#activity-container');
  const aboutContainer = $('#about-container');

  const aboutList = $('#about-list');

  // Trigger when activity tab is clicked
  activityTab.click(() => {
    aboutTab.removeClass('active');
    activityTab.addClass('active');

    aboutContainer.css('display', 'none');
    activityContainer.css('display', 'block');

    return false;
  });

  // Trigger when about tab is clicked
  aboutTab.click(() => {
    activityTab.removeClass('active');
    aboutTab.addClass('active');

    activityContainer.css('display', 'none');
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
      '<a href="#" class="list-group-item disabled" tabindex="-1">' +
        '<h6 class="mb-0">' +
        'Username' +
        '<small class="text-muted float-right">' +
        username +
        '</small>' +
        '</h6>' +
        '</a>' +
        '<a href="#" class="list-group-item disabled" tabindex="-1">' +
        '<h6 class="mb-0">' +
        'Consent' +
        '<small class="text-muted float-right">' +
        (json.consent ? 'Yes' : 'No') +
        '</small>' +
        '</h6>' +
        '</a>' +
        '<a href="#" class="list-group-item disabled" tabindex="-1">' +
        '<h6 class="mb-0">' +
        'Joined' +
        '<small class="text-muted float-right">' +
        new Date(json.joined)
          .toString()
          .split(' ')
          .slice(1, 4)
          .join(' ') +
        '</small>' +
        '</h6>' +
        '</a>'
    );
  });
});
