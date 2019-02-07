$(document).ready(() => {
  const activityTab = $('#activity-tab');
  const searchTab = $('#search-tab');
  const notifsTab = $('#notifs-tab');

  const searchButton = $('#search-button');

  // Trigger when activity-tab is clicked
  activityTab.click(() => {
    const activityContainer = $('#activity-container');
    const searchContainer = $('#search-container');
    const notifsContainer = $('#notifs-container');

    searchTab.removeClass('active');
    notifsTab.removeClass('active');
    activityTab.addClass('active');

    searchContainer.css('display', 'none');
    notifsContainer.css('display', 'none');
    activityContainer.css('display', 'block');

    return false;
  });

  // Trigger when search-tab is clicked
  searchTab.click(() => {
    const activityContainer = $('#activity-container');
    const searchContainer = $('#search-container');
    const notifsContainer = $('#notifs-container');

    activityTab.removeClass('active');
    notifsTab.removeClass('active');
    searchTab.addClass('active');

    activityContainer.css('display', 'none');
    notifsContainer.css('display', 'none');
    searchContainer.css('display', 'block');

    return false;
  });

  // Trigger when notifs-tab is clicked
  notifsTab.click(() => {
    const activityContainer = $('#activity-container');
    const searchContainer = $('#search-container');
    const notifsContainer = $('#notifs-container');

    activityTab.removeClass('active');
    searchTab.removeClass('active');
    notifsTab.addClass('active');

    activityContainer.css('display', 'none');
    searchContainer.css('display', 'none');
    notifsContainer.css('display', 'block');

    return false;
  });

  // Trigger when search-button is clicked
  searchButton.click(() => {
    const searchInput = $('#search-input');
    const searchResult = $('#search-result');

    $.getJSON('/check/' + searchInput.val(), (json) => {
      searchResult.css('display', 'block');

      if (!json.available) {
        searchResult.html(
          '<div class="card-body"><h5 class="card-title">' +
            searchInput.val() +
            '</h5><h6 class="card-subtitle mb-2 text-muted">Registered User</h6><a href="/' +
            searchInput.val() +
            '" class="card-link">Visit Profile</a></div>'
        );
      } else {
        searchResult.html(
          '<div class="card-body"><h5 class="card-title">' +
            searchInput.val() +
            '</h5><h6 class="card-subtitle mb-2 text-muted">Not Registered</h6></div>'
        );
      }
    });
  });
});
