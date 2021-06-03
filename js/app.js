/*
# ---------------------------<|----------------|>--------------------------- #
# ----------------------------|GLOBAL VARIABLES|---------------------------- #
# ---------------------------<|----------------|>--------------------------- #
*/

const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero__image');
const menuList = document.querySelector('.menu-list');
const menuChildrenList = menuList.children; // li elements
const listOfColors = ['yellow', 'green', 'blue', 'red']; // Optional
let sectionsList = [];
let currentActiveSection; // Tracks the currently active section.
let scrollTimeoutId; // Init the scolling timer.

/*
# ----------------------------<|----------------|>--------------------------- #
# -----------------------------|HELPER FUNCTIONS|---------------------------- #
# ----------------------------<|----------------|>--------------------------- #
*/
/*
# -----------------------------|section's helpers|---------------------------- #
 */

// Set section state to active.
const setSectionStateTo_Active = (section, sectionContent) => {
	currentActiveSection = section;
	// TODO: add a class of active.
	section.style.border = '1px solid red';
	// header.
	section.children[0].style.left = 0;
	// section's content.
	sectionContent.style.right = 0;
	// Add active state to the corresponding menu link.
	setMenuToCurrentActiveSection(currentActiveSection);
};

// Set section state to inactive.
const setSectionStateTo_Inactive = (section, sectionContent) => {
	removeActiveInHero();
	currentActiveSection = null;
	section.style.border = '';
	// header.
	section.children[0].style.left = `${100}%`;
	// section's content.
	sectionContent.style.right = `${100}%`;
};

const positionTrigger = (position) =>
	position < (window.innerHeight * 50) / 100 &&
	position > (-window.innerHeight * 50) / 100;

const isCollapsed = (section) => {
	return section.classList.contains('section--height-collapse');
};

// Set the section to active when it's in the viewport.
const setSectionState = () => {
	for (section of sectionsList) {
		let position = section.getBoundingClientRect().top;
		let sectionContent = section.querySelector('.section__content');
		/* The following condition checks the position against the two scroll states(1:when active, 2:when inactive),
        and checks if the section is not collapsed.
        */
		if (positionTrigger(position) && !isCollapsed(section)) {
			// Only run this if we don't have a currentActiveSection.
			if (!currentActiveSection) {
				setSectionStateTo_Active(section, sectionContent);
			}
		} else {
			if (section.style.border) {
				setSectionStateTo_Inactive(section, sectionContent);
			}
		}
	}
};

// Scroll to section. using scrollBy.
/* CSS property scroll-behavior takes care of the scrolling behavior,
 but the section header gets overlayed by the menubar when it's active,
 that's why scrollToSection scrolls to top of a section minus the height
 of the menubar
 */
const scrollToSection = (e) => {
	if (e.target.nodeName === 'A') {
		e.preventDefault();
		let link = e.target;
		let target = document.querySelector(link.getAttribute('href'));
		let targetTop = target.getBoundingClientRect().top;
		let top = targetTop - menuList.offsetHeight;
		window.scrollBy({
			top: top,
			// Scroll behavior is already set in the styleSheet.
		});
	}
};

/*
# ---------------------------|menu & links' helpers|-------------------------- #
 */

// Builds the navigation menu from the list of sections.
const navMenuBuilder = () => {
	// Populate the list of sections.
	[...sectionsList] = document.querySelectorAll('.content__section');
	const fragment = document.createDocumentFragment();
	for (let i = 0; i < sectionsList.length; i++) {
		let listItem = document.createElement('li');
		let listItemLink = document.createElement('a');
		listItemLink.innerText = sectionsList[i].getAttribute('data-menu');
		listItemLink.setAttribute('href', `#${sectionsList[i].getAttribute('id')}`);
		listItemLink.classList.add('header__link');
		listItemLink.classList.add(`header__link--${listOfColors[i]}`);
		sectionsList[i].style.backgroundColor = listOfColors[i];
		listItem.appendChild(listItemLink);
		fragment.appendChild(listItem);
	}
	menuList.appendChild(fragment);
};

// Changes the header's background color according to its scroll position.
const setHeaderBackground = (e) => {
	let trigger = (window.innerHeight * 40) / 100; // percentage of the screen height.
	if (window.pageYOffset >= trigger) {
		header.classList.remove('at-the-top');
	} else {
		header.classList.add('at-the-top');
	}
};

// Moving the hero image( "parachuting page") when scrolling in the hero section :D.
const svgAnimate = () => {
	if (window.scrollY < (window.innerHeight * 40) / 100)
		heroImage.style.transform = `translateY(${window.scrollY}px)`;
};

// Removes the active class for the nav items.
const removeActiveClassFromLinks = (list) => {
	for (let item of list) {
		item.children[0].classList.remove('header__link--active');
	}
};

// Add an active state to navigation items when a section is in the viewport.
const setMenuToCurrentActiveSection = (section) => {
	let sectionId = section.getAttribute('id');
	removeActiveClassFromLinks(menuChildrenList);
	// find the corresponding link by its href from the menulistchildren.
	let targetList = [...menuChildrenList].filter((list) => {
		return list.children[0].getAttribute('href') === `#${sectionId}`;
	});
	let targetLink = targetList[0].children[0];
	targetLink.classList.add('header__link--active');
};

// Removes any active state from the nav menu when the hero section is in the view.
const removeActiveInHero = () => {
	if (
		currentActiveSection &&
		hero.getBoundingClientRect().top >= (-window.innerHeight * 50) / 100
	) {
		removeActiveClassFromLinks(menuChildrenList);
	}
};

// Makes the link active.
const onMenuItemClick = (event) => {
	if (event.target.nodeName === 'A') {
		// Pass the list of the links to the remove function.
		removeActiveClassFromLinks(menuChildrenList);
		event.target.classList.add('header__link--active');
	}
};

// Toggles the visibility of the navigation menu.
const toggleNav = () => {
	header.classList.toggle('header--hidden', 'header--visible');
};

// Handels the visibility of the menu with a timer.
const menuVisibilityHandeler = () => {
	// Only hides the menu, if the view is outside of the hero section.
	if (window.scrollY <= hero.offsetHeight) {
		clearScrollTimer();
	} else {
		// Bring back the menu on scroll.
		header.classList.remove('header--hidden');
		header.classList.add('header--visible');
		// Clear the timer.
		clearScrollTimer();
		// Activates scroll timer if its not active.
		scrollTimeoutId = setTimeout(toggleNav, 2000);
	}
};

const clearScrollTimer = () => clearTimeout(scrollTimeoutId);
/*
# -----------------------------<|-------------|>---------------------------- #
# ------------------------------|PAGE'S EVENTS|----------------------------- #
# -----------------------------<|-------------|>---------------------------- #
*/

// On document load, dynamically build the menu links.
window.addEventListener('load', () => navMenuBuilder());

// Scroll to selected section.
menuList.addEventListener('click', (event) => scrollToSection(event));

// Main Scroll event.
document.addEventListener('scroll', () => {
	setSectionState();
	setHeaderBackground();
	svgAnimate();
	menuVisibilityHandeler();
});

// Sets the clicked link to active.
menuList.addEventListener('click', onMenuItemClick);

// Stopping the timeout when mouse over menu(before it hides).
header.addEventListener('mouseover', () => clearScrollTimer());

// Restarting timeout when pointer is outside of the menu.
header.addEventListener('mouseleave', () => {
	// Check if not at the top of the page.
	if (window.scrollY >= hero.offsetHeight) {
		scrollTimeoutId = setTimeout(toggleNav, 2000);
	}
});

// On Section's header click, collapse the section.
document.querySelector('.content').addEventListener('click', (event) => {
	if (event.target.nodeName === 'I') {
		let h2 = event.target.parentElement;
		let section = h2.parentElement;
		let upIcon = h2.querySelector('.fa-caret-up');
		let downIcon = h2.querySelector('.fa-caret-down');
		// Change this section's height.
		section.classList.toggle('section--height-collapse');
		// toggle the visibility of the up/down icons.
		upIcon.classList.toggle('hidden');
		downIcon.classList.toggle('hidden');
		// Fix the header in the middle.
		h2.classList.toggle('section__header--collapse');
		// Hide the text wrapper.
		h2.nextElementSibling.classList.toggle('hidden');
	}
});
