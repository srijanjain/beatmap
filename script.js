const loadPlaces = function (coords) {
  const method = "api"; // COMMENT LINE IF STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY

  const PLACES = [
    {
      name: "Your place name",
      location: {
        lat: 0, // latitude if using static data
        lng: 0, // longitude if using static data
      },
    },
  ];

  if (method === "api") {
    return loadPlaceFromAPIs(coords);
  }

  return PLACES;
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
  const params = {
    radius: 10, // search places not farther than this value (in meters)
    clientId: "D3AOLPGR40ZWOHZ54XKXJGORGFHZY31U5FRSXRUHHMKRXHKD",
    clientSecret: "2UM3SJVRFCJK4KQ43H1VADXYBAVUB0AVIVRXGMGTQOWJMJKX",
    version: "20300101", // foursquare versioning
  };

  // CORS Proxy
  const corsProxy = "https://cors-anywhere.herokuapp.com/";

  // Foursquare API for locations of interest
  const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
  return fetch(endpoint)
    .then((res) => {
      return res.json().then((resp) => {
        return resp.response.venues;
      });
    })
    .catch((err) => {
      console.error("Error with places API", err);
    });
}

window.onload = () => {
  const scene = document.querySelector("a-scene");

  // Getting current user location
  return navigator.geolocation.getCurrentPosition(
    function (position) {
      // Using current location to load from remote APIs some places nearby
      loadPlaces(position.coords).then((places) => {
        places.forEach((place) => {
          const latitude = place.location.lat;
          const longitude = place.location.lng;
          //77.23,88.55 as a string (key)=> string(value) 
          console.log(longitude);
          console.log(latitude);

          // add place name
          const text = document.createElement("a-link");
          text.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          text.setAttribute("title", place.name);
          text.setAttribute(
            "href",
            "https://srijanja.in/beatmap/beatbuilder/"
          );
          text.setAttribute("scale", "25 25 25");
          text.addEventListener("loaded", () => {
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
          });
          scene.appendChild(text);
        });
      });
    },
    (err) => console.error("Error in retrieving position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000,
    }
  );
};
