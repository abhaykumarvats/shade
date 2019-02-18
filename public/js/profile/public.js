$(document).ready(() => {
  const username = $('#username').text();

  const activityTab = $('#activity-tab');
  const aboutTab = $('#about-tab');

  const activityContainer = $('#activity-container');
  const aboutContainer = $('#about-container');

  const activityList = $('#activity-list');
  const activitySmallText = $('#activity-small-text');

  let skip = 0;
  const limit = 10;

  // Show Loading... small text
  activitySmallText.addClass('text-muted').html('<small>Loading...</small>');

  // Get user's public posts
  $.getJSON(username + '/posts/public/' + skip + '/' + limit, (json) => {
    const jsonLength = json.length;

    // No initial posts found
    if (!jsonLength) {
      activitySmallText
        .addClass('text-muted')
        .html('<small>Nothing to see here!</small>');
    } else {
      // For each public post
      for (let i = 0; i < jsonLength; i++) {
        // Append a list group item
        activityList.append(
          '<li class="list-group-item">' +
            '<h6 class="mb-0">' +
            json[i].username +
            '<small class="text-muted float-right">' +
            new Date(json[i].date)
              .toString()
              .split(' ')
              .slice(1, 4)
              .join(' ') +
            '</small>' +
            '</h6>' +
            '<p class="mb-0">' +
            json[i].content +
            '</p>' +
            '</li>'
        );
      }

      // If less than 10 posts were found
      if (jsonLength < 10) {
        activitySmallText
          .addClass('text-muted')
          .html("<small>That's it, folks!</small>");
      } else {
        // Show 'More' link
        activitySmallText
          .removeClass('text-muted')
          .html('<a href="#" id="more"><small>More</small></a>');

        // TODO
      }
    }
  });

  // Trigger when activityTab is clicked
  activityTab.click(() => {
    // Add 'active' class to activityTab, and remove from other
    aboutTab.removeClass('active');
    activityTab.addClass('active');

    // Show activityContainer, and hide other
    aboutContainer.css('display', 'none');
    activityContainer.css('display', 'block');

    return false;
  });

  // Trigger when aboutTab is clicked
  aboutTab.click(() => {
    // Add 'active' class to aboutTab, and remove from other
    activityTab.removeClass('active');
    aboutTab.addClass('active');

    // Show aboutContainer, and hide other
    activityContainer.css('display', 'none');
    aboutContainer.css('display', 'block');

    return false;
  });
});
