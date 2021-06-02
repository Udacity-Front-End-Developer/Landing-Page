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
const sectionList = document.querySelectorAll('.content__section');
const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero__image');
const menuList = document.querySelector('.menu-list');
let sectionsList = [];
const menuChildrenList = menuList.children;

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
/* CSS property scroll-behavior takes care of this,
 but the section header is overlayed by the menubar*/
menuList.addEventListener('click', (event) => {
	if (event.target.nodeName === 'A') {
		event.preventDefault();
		let link = event.target;
		let target = document.querySelector(link.getAttribute('href'));
		console.log(target.offsetHeight);
		let targetTop = target.getBoundingClientRect().top;
		let top = targetTop - menuList.offsetHeight;
		window.scrollBy({
			top: top,
			// Behavior is already set in the css
		});
	}
});

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Scroll to section on link click

// Set sections as active
let activeSection;
console.log(activeSection);
window.addEventListener('scroll', (e) => {
	for (section of sectionList) {
		let position = section.getBoundingClientRect().top;
		let paragraphsList = section.querySelectorAll('p');
		// Checking position against the two scroll states(1:when active, 2:when inactive).
		if (
			position < (window.innerHeight * 50) / 100 &&
			position > (-window.innerHeight * 50) / 100
		) {
			section.style.border = '1px solid red';
			// console.log(section);
			// header.
			section.children[0].style.left = 0;
			// paragraphs.
			for (let paragraph of paragraphsList) {
				paragraph.style.right = 0;
			}
		} else {
			if (section.style.border) {
				section.style.border = '';
				// header.
				section.children[0].style.left = `${100}%`;
				// paragraphs.
				for (let paragraph of paragraphsList) {
					paragraph.style.right = `${100}%`;
				}
			}
		}
	}
});

// Changing the header's background color depending on its scroll position.
window.addEventListener('scroll', (e) => {
	if (window.pageYOffset >= (window.innerHeight * 40) / 100) {
		header.classList.remove('at-the-top');
	} else {
		header.classList.add('at-the-top');
	}
});

// Moving the hero image when scrolling in the hero section :D.
window.addEventListener('scroll', () => {
	if (window.scrollY < (window.innerHeight * 40) / 100)
		heroImage.style.transform = `translateY(${window.scrollY}px)`;
});

// Toggling the active class for the nav items.

const removeActiveClassFromLinks = (list) => {
	for (let item of list) {
		item.children[0].classList.remove('header__link--active');
	}
};

const onMenuItemClick = (event) => {
	if (event.target.nodeName === 'A') {
		removeActiveClassFromLinks(menuChildrenList);
		event.target.classList.add('header__link--active');
	}
};
menuList.addEventListener('click', onMenuItemClick);

// Hiding the navigation menu when not scrolling.
const toggleNav = () =>
	header.classList.toggle('header--hidden', 'header--visible');
let scrollTimeoutId;
const clearScrollTimer = () => clearTimeout(scrollTimeoutId);
// Stopping the timeout when mouse over menu(before it hides).
header.addEventListener('mouseover', () => clearScrollTimer());
// Restarting timeout when mouse leaves menu.
header.addEventListener('mouseleave', () => {
	// Check if not at the top of the page.
	if (window.scrollY >= hero.offsetHeight) {
		scrollTimeoutId = setTimeout(toggleNav, 2000);
	}
});
document.addEventListener('scroll', () => {
	// Only hides the menu, if the view is outside of the hero section.
	if (window.scrollY <= hero.offsetHeight) {
		clearScrollTimer();
	} else {
		// Brings back the menu on scroll.
		header.classList.remove('header--hidden');
		header.classList.add('header--visible');
		// Clear the timer.
		clearScrollTimer();
		// Activates scroll timer if its not active.
		scrollTimeoutId = setTimeout(toggleNav, 2000);
	}
});

// On document load, get the list of sections.
window.addEventListener('load', () => {
	[...sectionsList] = document.querySelectorAll('.content__section');
	const listOfColors = ['yellow', 'green', 'blue', 'red'];
	// create an li element.
	const fragment = document.createDocumentFragment();
	for (let i = 0; i < sectionList.length; i++) {
		let listItem = document.createElement('li');
		let listItemLink = document.createElement('a');
		listItemLink.innerText = sectionList[i].getAttribute('data-menu');
		listItemLink.setAttribute('href', `#${sectionList[i].getAttribute('id')}`);
		listItemLink.classList.add('header__link');
		listItemLink.classList.add(`header__link--${listOfColors[i]}`);
		sectionList[i].style.backgroundColor = listOfColors[i];
		listItem.appendChild(listItemLink);
		fragment.appendChild(listItem);
	}
	menuList.appendChild(fragment);
});

// window.addEventListener('scroll', () => {
// 	let h2 = document.querySelector('h2');
// 	let viewH = window.innerHeight;
// 	let percentage = (window.innerHeight * 30) / 100;
// 	console.log(viewH - percentage, h2.getBoundingClientRect().top);
// 	let left = 500 - 0.3 * window.innerHeight;

// 	console.log(left);
// 	h2.style.left = 0;
// });

// 229;
