'use strict';

function getResponseWithCurrentTemp(currUrl){
	axios.get(currUrl).then((response) => {
		if (response.request.status === 200) {
			const celsiusTemp = Math.round(response.data.main.temp);
			const temperature = document.querySelector("#current_temperature");
			const humidity = document.querySelector("#humidity");
			const wind = document.querySelector("#wind");
			const feelsLike = document.querySelector("#feels_like");
			const statusWeather = document.querySelector("#status_weather");

			console.log(response);

			temperature.innerHTML = celsiusTemp;
			humidity.innerHTML = response.data.main.humidity;
			wind.innerHTML = Math.round(Number(response.data.wind.speed) * 3.6);
			feelsLike.innerHTML = Math.round(response.data.main.feels_like);
			statusWeather.innerHTML = response.data.weather[0].description;
			// statusWeather.innerHTML = response.data.weather[0].main;

			let country = response.data.sys.country;
			let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
			h1City.innerHTML = `${response.data.name}, ${regionNames.of(country)}`;

			// if (regionNames.of(country) === "Russia"){
			// 		h1City.innerHTML = `${response.data.name}, Раша-параша`;
			// 	} 
			// 	else if (regionNames.of(country) === "Ukraine"){
			// 		h1City.innerHTML = `${response.data.name}, Слава Україні! Смерть ворогам! Батько наш - Бандера!`;
			// 	} else {
			// 		h1City.innerHTML = `${response.data.name}, ${regionNames.of(country)}`;
			// 	}
		} 
	});
}

function findPosition(position){
	const homeButton = document.querySelector("#home_button");
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

	homeButton.addEventListener("click", (event) => {
		event.preventDefault();

		getResponseWithCurrentTemp(apiUrl);
		currentDataTime.innerHTML = setDate(new Date());
	});
}

function showSearchedCity(city){
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	getResponseWithCurrentTemp(apiUrl);
	// console.log(searchingCity.value);
	searchingCity.value = '';
}

function getZero(timeNum){
	if (timeNum < 10 && timeNum >= 0){
		return `0${timeNum}`;
	} else {
		return timeNum;
	}
}

function setDate(time) {
	const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				dayOfTheWeek = time.getDay(),
				hours = getZero(time.getHours()),
				minutes = getZero(time.getMinutes());

	return(`${weekDays[dayOfTheWeek]} ${hours}:${minutes}`);
}

const currentDataTime = document.querySelector("#data_time");
currentDataTime.innerHTML = setDate(new Date());


// сhange city from search line
const apiKey = "1a393094c95cd8490917aab767379862",
			searchingCity = document.querySelector(".form_input"),
			searchCityButton = document.querySelector("form"),
			h1City = document.querySelector("h1");

const defaultCity = "Kyiv";
showSearchedCity(defaultCity);
navigator.geolocation.getCurrentPosition(findPosition);


searchCityButton.addEventListener("submit", (event) => {
	if (searchingCity.value !== '') {
		showSearchedCity(searchingCity.value);
		event.preventDefault();
	}
	currentDataTime.innerHTML = setDate(new Date());
});


// switch temperature

// function convertToFahrenheit(event) {
// 	event.preventDefault();
// 	if (celcius.classList.contains("active")){
// 		temperature.innerHTML = Math.round((Number(temperature.innerText) * 9/5) + 32);
// 		celcius.classList.remove("active");
// 		fahrenheit.classList.add("active");
// 	}
// }

// function convertToCelcius(event) {
// 	event.preventDefault();
// 	temperature.innerHTML = constantTempCelsius;
// 	if (fahrenheit.classList.contains("active")){
// 		fahrenheit.classList.remove("active");
// 		celcius.classList.add("active");
// 	}
// }

// const celcius = document.querySelector("#celcius"),
// 			fahrenheit = document.querySelector("#fahrenheit"),
// 			temperature = document.querySelector("#current_temperature"),
// 			constantTempCelsius = Number(temperature.innerHTML);

// 	fahrenheit.addEventListener("click", convertToFahrenheit);
// 	celcius.addEventListener("click", convertToCelcius);

