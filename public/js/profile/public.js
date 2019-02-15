$(document).ready(() => {
  const activityTab = $('#activity-tab');
  const aboutTab = $('#about-tab');

  const activityContainer = $('#activity-container');
  const aboutContainer = $('#about-container');

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
