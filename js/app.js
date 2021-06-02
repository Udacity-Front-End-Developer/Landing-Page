/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Scroll to section on link click

// Set sections as active

const sectionList = document.querySelectorAll('.content__section');

window.addEventListener('scroll', (e) => {
	for (section of sectionList) {
		let position = section.getBoundingClientRect().top;
		if (
			position < (window.innerHeight * 40) / 100 &&
			position > (-window.innerHeight * 50) / 100
		) {
			section.style.border = '1px solid red';
		} else {
			if (section.style.border) {
				section.style.border = '';
			}
		}
	}
});

// Changes the header's background color depending on its scroll position.
const header = document.querySelector('.header');
window.addEventListener('scroll', (e) => {
	if (window.pageYOffset >= (window.innerHeight * 40) / 100) {
		console.log('show bg-color');
		header.classList.remove('at-the-top');
	} else {
		console.log('remove bg-color');
		header.classList.add('at-the-top');
	}
});
