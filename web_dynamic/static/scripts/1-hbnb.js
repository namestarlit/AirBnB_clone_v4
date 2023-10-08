$(document).ready(() => {
  // Get the input element with the checkbox type property
  const amenityCheckbox = $('input[type="checkbox"]');
  const checkedAmenities = [];
  const amenities = [];

  // Handle change event
  amenityCheckbox.change((event) => {
    const checkbox = $(event.target); // Get the checkbox that triggered the event
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
    // Format the list of selected amenity names
    const formattedAmenities = amenities.map((amenity) => {
      return amenity;
    }).join(', ');

    // Update the h4 tag inside the div Amenities with the formatted list
    const header4 = $('div.amenities h4');
    header4.html(formattedAmenities + '&nbsp;');
    console.log(header4.html());
  });
});
