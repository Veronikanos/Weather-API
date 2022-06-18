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
			const celsiusTemp = Math.round(response.data.main.temp);
			const temperature = document.querySelector("#current_temperature");
			const humidity = document.querySelector("#humidity");
			const wind = document.querySelector("#wind");
			const feelsLike = document.querySelector("#feels_like");
			const statusWeather = document.querySelector("#status_weather");
			const currentDataTime = document.querySelector("#data_time");

			const icon = document.querySelector("#icon");
			icon.setAttribute("src", `icons/${response.data.weather[0].icon}.svg`);
			icon.setAttribute("alt", `${response.data.weather[0].description}`);

			currentDataTime.innerHTML = setDate(response.data.dt * 1000);
			temperature.innerHTML = celsiusTemp;
			humidity.innerHTML = response.data.main.humidity;
			wind.innerHTML = Math.round(Number(response.data.wind.speed) * 3.6);
			feelsLike.innerHTML = Math.round(response.data.main.feels_like);
			statusWeather.innerHTML = response.data.weather[0].description;

			let country = response.data.sys.country;
			let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
			h1City.innerHTML = `${response.data.name}, ${regionNames.of(country)}`;
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
});