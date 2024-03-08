$(document).ready(() => {
  // Get the input elements with the checkbox type property for amenities
  const amenityCheckbox = $('input[type="checkbox"]');
  const checkedAmenities = [];
  const amenities = [];

  // Get the input elements with the checkbox type property for states and cities
  const stateCheckbox = $('li input[type="checkbox"]');
  const checkedStates = [];
  const states = [];

  // Handle change event for amenity checkboxes
  amenityCheckbox.change((event) => {
    const checkbox = $(event.target);
    const isChecked = checkbox.prop('checked');
    const amenityID = checkbox.data('id');
    const amenityName = checkbox.data('name');

    if (isChecked) {
      checkedAmenities.push(amenityID);
      amenities.push(amenityName);
    } else {
      const indexOfID = checkedAmenities.indexOf(amenityID);
      const indexOfAmenity = amenities.indexOf(amenityName);
      if (indexOfID !== -1 && indexOfAmenity !== -1) {
        checkedAmenities.splice(indexOfID, 1);
        amenities.splice(indexOfAmenity, 1);
      }
    }

    // Update the h4 tag inside the div Amenities with the formatted list
    const header4 = $('div.amenities h4');
    header4.html(formattedAmenities() + '&nbsp;');
  });

  // Handle change event for state and city checkboxes
  stateCheckbox.change((event) => {
    const checkbox = $(event.target);
    const isChecked = checkbox.prop('checked');
    const id = checkbox.data('id');
    const name = checkbox.data('name');

    if (isChecked) {
      checkedStates.push(id);
      states.push(name);
    } else {
      const indexOfID = checkedStates.indexOf(id);
      const indexOfState = states.indexOf(name);
      if (indexOfID !== -1 && indexOfState !== -1) {
        checkedStates.splice(indexOfID, 1);
        states.splice(indexOfState, 1);
      }
    }

    // Update the h4 tag inside the div Locations with the formatted list of States and Cities
    const header4 = $('div.locations h4');
    header4.html(formattedLocations() + '&nbsp;');
  });

  // Get API Status
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    method: 'GET',
    dataType: 'json',
    success: (data, status, xhr) => {
      const divHeader = $('#api_status');
      if (xhr.status === 200) {
        divHeader.addClass('available');
        $('#api_status.available')
          .css('background-color', '#ff545f');
      }
    },
    error: (xhr, status, error) => {
      // Handle the error here
      const divHeader = $('#api_status');
      divHeader.removeClass('available');
    }
  });

  // Handle button click event
  $('button').click(() => {
    // Send a POST request to places_search with the list of checked amenities, states, and cities
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: checkedAmenities,
        states: checkedStates
      }),
      success: (data) => {
        // Assuming data is an array of Place objects
        const placesSection = $('section.places');

        // Clear existing places
        placesSection.empty();

        data.forEach((place) => {
          // Create an article tag for each place
          const article = $('<article></article>');

          // Create the title_box div
          const titleBox = $('<div class="title_box"></div>');
          titleBox.append(`<h2>${place.name}</h2>`);
          titleBox.append(`<div class="price_by_night">$${place.price_by_night}</div>`);

          // Create the information div
          const information = $('<div class="information"></div>');
          information.append(`<div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>`);
          information.append(`<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>`);
          information.append(`<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>`);

          // Create the description div (without the Owner tag)
          const description = $('<div class="description"></div>');
          description.html(place.description);

          // Append the elements to the article
          article.append(titleBox);
          article.append(information);
          article.append(description);

          // Append the article to the places section
          placesSection.append(article);
        });
      },
      error: (xhr, status, error) => {
        // Handle the error here
        console.error('Error:', error);
      }
    });
  });

  // Function to format the list of selected amenity names
  function formattedAmenities () {
    return amenities.map((amenity) => {
      return amenity;
    }).join(', ');
  }

  // Function to format the list of selected states and cities
  function formattedLocations () {
    const formattedStates = states.map((state) => {
      return `State: ${state}`;
    });

    return formattedStates.join(', ');
  }
});
