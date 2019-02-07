$(document).ready(() => {
  const activityTab = $('#activity-tab');
  const searchTab = $('#search-tab');
  const notifsTab = $('#notifs-tab');

  const activityContainer = $('#activity-container');
  const searchContainer = $('#search-container');
  const notifsContainer = $('#notifs-container');

  const searchButton = $('#search-button');
  const searchResult = $('#search-result');

  const redColor = '#dc3545';

  // Trigger when activity-tab is clicked
  activityTab.click(() => {
    // Add 'active' class to activityTab, and remove from others
    searchTab.removeClass('active');
    notifsTab.removeClass('active');
    activityTab.addClass('active');

    // Show activityContainer, and hide others
    searchContainer.css('display', 'none');
    notifsContainer.css('display', 'none');
    activityContainer.css('display', 'block');

    return false;
  });

  // Trigger when search-tab is clicked
  searchTab.click(() => {
    // Add 'active' class to searchTab, and remove from others
    activityTab.removeClass('active');
    notifsTab.removeClass('active');
    searchTab.addClass('active');

    // Show searchContainer, and hide others
    activityContainer.css('display', 'none');
    notifsContainer.css('display', 'none');
    searchContainer.css('display', 'block');

    return false;
  });

  // Trigger when notifs-tab is clicked
  notifsTab.click(() => {
    // Add 'active' class to notifsTab, and remove from others
    activityTab.removeClass('active');
    searchTab.removeClass('active');
    notifsTab.addClass('active');

    // Show notifsContainer, and hide others
    activityContainer.css('display', 'none');
    searchContainer.css('display', 'none');
    notifsContainer.css('display', 'block');

    return false;
  });

  // Trigger when search-button is clicked
  searchButton.click(() => {
    // Get input value
    const searchInputField = $('#search-input');
    const searchInputValue = searchInputField.val();

    // If empty input
    if (!searchInputValue) {
      searchResult.css('display', 'none');
      searchInputField.css('border-color', redColor);
    } else {
      // Show Loading... card
      searchResult
        .css('display', 'block')
        .html(
          '<div class="card-body">' +
            '<h5 class="card-title">' +
            'Please wait...' +
            '</h5>' +
            '</div>'
        );

      // Remove border-color
      searchInputField.css('border-color', '');

      // Check username existence
      $.getJSON('/check/' + searchInputValue, (json) => {
        // User is registered
        if (!json.available) {
          searchResult.html(
            '<div class="card-body">' +
              '<h5 class="card-title">' +
              searchInputValue +
              '</h5>' +
              '<h6 class="card-subtitle mb-2 text-muted">' +
              'Registered User' +
              '</h6>' +
              '<a href="/' +
              searchInputValue +
              '" class="card-link">' +
              'Visit Profile' +
              '</a>' +
              '</div>'
          );
        } else {
          // User is not registered
          searchResult.html(
            '<div class="card-body">' +
              '<h5 class="card-title">' +
              searchInputValue +
              '</h5>' +
              '<h6 class="card-subtitle mb-2 text-muted">' +
              'Not Registered' +
              '</h6>' +
              '</div>'
          );
        }
      });
    }
  });
});
