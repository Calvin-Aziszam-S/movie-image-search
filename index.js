const inputText = document.querySelector("input");
const submitButton = document.querySelector(".submit-btn");
const form = document.querySelector("form");
const container = document.querySelector(".container");

let page = 1;

const getMovieData = async (movie) => {
	try {
		const url = `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&page=${page}`;
		const config = {
			headers: {
				accept: "application/json",
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNDMzMzViNzFkMWEzYmFkMDlhMWE2YmQ2NzUwNDg3NCIsIm5iZiI6MTczMjY4MDcxNS43OTA0NjY4LCJzdWIiOiI2NzQ2OTk4MzY2YjlhNGY5M2M4NGNiYWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.2B6iDM9N7Lmzd_IVazwCz1DhLNaOtDvVvxYm1LneeIA",
			},
		};
		const response = await axios.get(url, config);
		const movies = response.data.results;
		return movies;
	} catch (err) {
		console.log(err);
	}
};

const getPoster = async (movie) => {
	try {
		const movieData = await getMovieData(movie);
		const posterUrlArr = [];
		const imgContainer = document.querySelector(".img-container");
		for (movie of movieData) {
			if (movie.poster_path) {
				const posterPath = movie.poster_path;
				const posterUrl = "https://image.tmdb.org/t/p/w300" + posterPath;
				posterUrlArr.push(posterUrl);
			}
		}
		if (posterUrlArr.length > 0) {
			container.classList.remove("container-init");
			return posterUrlArr;
		} else if (posterUrlArr.length === 0 && !imgContainer) {
			alert(`There's no such movie with the title of ${movie}.`);
		}
	} catch (err) {
		console.log(err);
	}
};

const showImage = (urlArr) => {
	const imgContainer = document.createElement("div");
	imgContainer.classList.add("img-container");
	for (url of urlArr) {
		const img = document.createElement("img");
		img.setAttribute("src", `${url}`);
		imgContainer.appendChild(img);
	}
	container.appendChild(imgContainer);
};

const showNextButton = () => {
	let nextButton = document.createElement("button");
	nextButton.classList.add("next-btn");
	nextButton.innerText = "Next";
	container.appendChild(nextButton);
	const showNextImages = (urlArr) => {
		for (url of urlArr) {
			const imgContainer = document.querySelector(".img-container");
			const img = document.createElement("img");
			img.setAttribute("src", `${url}`);
			imgContainer.appendChild(img);
		}
	};
	const handleClick = async () => {
		try {
			const inputValue = form.query.value;
			page += 1;
			const posterUrlArr = await getPoster(inputValue);
			console.log(posterUrlArr);
			if (posterUrlArr) {
				showNextImages(posterUrlArr);
				container.removeChild(nextButton);
				showNextButton();
			} else {
				alert(`Nothing more to show for ${inputValue}`);
			}
		} catch (err) {
			console.log(err);
		}
	};
	nextButton.addEventListener("click", handleClick);
};

const handleSubmit = async (e) => {
	e.preventDefault();
	page = 1;
	try {
		const inputValue = e.target.query.value;
		const imgContainer = document.querySelector(".img-container");
		const nextButton = document.querySelector(".next-btn");
		if (inputValue) {
			if (imgContainer && nextButton) {
				container.removeChild(imgContainer);
				container.removeChild(nextButton);
			}
			const posterUrlArr = await getPoster(inputValue);
			showImage(posterUrlArr);
			showNextButton();
		} else {
			alert("Please enter movie name!");
		}
	} catch (err) {
		console.log(err);
	}
};

form.addEventListener("submit", handleSubmit);
submitButton.addEventListener("keypress", (e) => {
	if (e.target.value === "enter") {
		handleSubmit;
	}
});
