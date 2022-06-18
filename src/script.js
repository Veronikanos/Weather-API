'use strict';

function getZero(timeNum){
	if (timeNum < 10 && timeNum >= 0){
		return `0${timeNum}`;
	} else {
		return timeNum;
	}
}

function setDate(timestamp) {

	const time = new Date(timestamp);
	const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				dayOfTheWeek = time.getDay(),
				hours = getZero(time.getHours()),
				minutes = getZero(time.getMinutes());

	return(`${weekDays[dayOfTheWeek]} ${hours}:${minutes}`);
}

function getResponseWithCurrentTemp(currUrl){
	axios.get(currUrl).then((response) => {
		if (response.request.status === 200) {
			celsiusTemp = response.data.main.temp;
			const temperature = document.querySelector("#current_temperature");
			const humidity = document.querySelector("#humidity");
			const wind = document.querySelector("#wind");
			// const feelsLike = document.querySelector("#feels_like");
			const statusWeather = document.querySelector("#status_weather");
			const currentDataTime = document.querySelector("#data_time");
			const icon = document.querySelector("#icon");
			icon.setAttribute("src", `icons/${response.data.weather[0].icon}.svg`);
			icon.setAttribute("alt", `${response.data.weather[0].description}`);

			currentDataTime.innerHTML = setDate(response.data.dt * 1000);
			temperature.innerHTML = Math.round(celsiusTemp);
			humidity.innerHTML = response.data.main.humidity;
			wind.innerHTML = Math.round(Number(response.data.wind.speed) * 3.6);
			// feelsLike.innerHTML = Math.round(response.data.main.feels_like);
			statusWeather.innerHTML = response.data.weather[0].description;

			let country = response.data.sys.country;
			let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
			h1City.innerHTML = `${response.data.name}, ${regionNames.of(country)}`;

			if (fahrenheitLink.classList.contains("active")) {
				celciusLink.classList.add("active");
				fahrenheitLink.classList.remove("active");
			}
		} 
	});
}

function findPosition(position){
	const homeButton = document.querySelector("#home_button");
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

	homeButton.addEventListener("click", (event) => {
		event.preventDefault();
		getResponseWithCurrentTemp(apiUrl);
	});
}

function showSearchedCity(city){
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	getResponseWithCurrentTemp(apiUrl);
	searchingCity.value = '';
}

const apiKey = "1a393094c95cd8490917aab767379862",
			searchingCity = document.querySelector(".form_input"),
			searchCityButton = document.querySelector("form"),
			celciusLink = document.querySelector("#celcius"),
			fahrenheitLink = document.querySelector("#fahrenheit"),
			h1City = document.querySelector("h1"),
			defaultCity = "Kyiv";

let celsiusTemp;


showSearchedCity(defaultCity);
navigator.geolocation.getCurrentPosition(findPosition);

searchCityButton.addEventListener("submit", (event) => {
	event.preventDefault();
	if (searchingCity.value !== '') {
		showSearchedCity(searchingCity.value);
	}
});

// clicking on temperature icons and converting units;

celciusLink.addEventListener("click", (event) => {
	event.preventDefault();
	let temperatureElement = document.querySelector("#current_temperature");
	temperatureElement.innerHTML = Math.round(celsiusTemp);
	celciusLink.classList.add("active");
	fahrenheitLink.classList.remove("active");
});

fahrenheitLink.addEventListener("click", (event) => {
	event.preventDefault();
	let temperatureElement = document.querySelector("#current_temperature");
	temperatureElement.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
	celciusLink.classList.remove("active");
	fahrenheitLink.classList.add("active");
});


const forecastWeek = ["Fri", "Sat", "Sun", "Mon", "Tue"];const forecastElement = document.querySelector("#forecast");
let forecastHTML = `<div class="row pt-4">`;

forecastWeek.forEach((day) => {
	forecastHTML = forecastHTML + 
	`<div class="col-2 current_info forecast_week_day pt-2 pb-2">
		${day}
		<img src="icons/13n.svg" alt="">
		<div class="forecast_temperature row">
			<span class="forecast_temperature_max col-6">18°</span>
			<span class="forecast_temperature_min col-6">12°</span>
		</div>
	</div>`;
});

forecastHTML = forecastHTML + `</div>`;
forecastElement.innerHTML = forecastHTML;