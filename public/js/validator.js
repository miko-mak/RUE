const cityInput = document.querySelector('.city-input');
const button = document.querySelector('.explore-button')
const form = document.querySelector('form');
var isLoading = false;

button.disabled = true;
button.style.cursor = "not-allowed";


function handleButton(state) {
    button.textContent = state === 'loading' ? 'SEARCHING' : 'EXPLORE';

    if (state === 'loading' || state === 'disallowed') {
        button.disabled = true;
        button.style.cursor = 'not-allowed';
        
    } else if (state === 'allowed') {
        button.disabled = false;
        button.style.cursor = "pointer";
    }
}


async function getCityDataFromInput(input) {
    input = input.trim().toLowerCase();
    var city = null;

    const url = `https://nominatim.openstreetmap.org/search?city=${input}&format=json&limit=1&addressdetails=1`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
 
        const result = await response.json();
        city = result.find(place =>
            place.type === "city" ||
            place.type === "town" ||
            place.type === "village" ||
            place.type === "administrative");
        
    } catch(error) {
        console.error(error);
    }

    return city ? {name:city.name, bbox:city.boundingbox} : null;
}


async function checkInput() {
    const cityData = await getCityDataFromInput(cityInput.value)
    if (cityData == null) {
        alert('No city found');
        return;
    }

    isLoading = true;
    handleButton('loading');

    const response = await fetch(`/places?city=${cityData.name}&bbox=${cityData.bbox}`)
    if (!response.ok) {
        alert('An error occured. Try again');
        return;
    }

    const place = await response.json();
    isLoading = false;
    handleButton('allowed');
    showPlaceOnMap(place);
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
});


button.addEventListener('click', () => {
    checkInput()
});


cityInput.addEventListener("input", () => {
    if (isLoading) return;
    
    if (cityInput.value != "") {
        handleButton('allowed');
        
    } else {
        handleButton('disallowed');
    }
});


cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && isLoading == false) {
        checkInput();
    }
});