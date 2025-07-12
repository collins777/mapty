'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// allows map, mapEvent to be used in multiple event scopes
let map, mapEvent;

// ----------------------------------------------- get users current location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      //console.log(latitude, longitude);
      console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];

      // when browser gets location, update map
      map = L.map('map').setView(coords, 13);

      // display map in browser
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // handle click on map
      map.on('click', function (mapE) {
        mapEvent = mapE;
        // toggle the hidden form class on click
        form.classList.remove('hidden');
        inputDistance.focus();
      });
    },
    function (error) {
      // log potential errors to the console
      console.log('Geolocation error code:', error.code);
      console.log('Geolocation error message:', error.message);
      alert('Could not get your location');
    }
  );
}

// ----------------------------------------------- form submission event listener
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // clear input fields on submit
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';

  // display marker on submit
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  // add location pin to map, configure popup, set popup content
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

// -----------------------------------------------  listen for change on input type
inputType.addEventListener('change', function () {
  // toggle hidden class on closest parent form__row
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
