$(document).ready(() => {
  const activityTab = $('#activity-tab');
  const aboutTab = $('#about-tab');

  const activityContainer = $('#activity-container');
  const aboutContainer = $('#about-container');

  activityTab.click(() => {
    aboutTab.removeClass('active');
    activityTab.addClass('active');

    aboutContainer.css('display', 'none');
    activityContainer.css('display', 'block');

    return false;
  });

  aboutTab.click(() => {
    activityTab.removeClass('active');
    aboutTab.addClass('active');

    activityContainer.css('display', 'none');
    aboutContainer.css('display', 'block');

    return false;
  });
});
