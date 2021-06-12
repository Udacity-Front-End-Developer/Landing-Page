/*
# ---------------------------<|----------------|>--------------------------- #
# ----------------------------|GLOBAL VARIABLES|---------------------------- #
# ---------------------------<|------INIT------|>--------------------------- #
*/

const content = document.querySelector('.content');
const header = document.querySelector('.header');
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero__image');
const menuList = document.querySelector('.menu-list');
const menuChildrenList = menuList.children; // li elements
listOfColors_links = ['yellow', 'green', 'blue', 'red'];
const listOfColors = ['#f1c40f ', '#16a085 ', '#2980b9 ', '#e74c3c ']; // Optional
const hamburger = document.querySelector('.header__hamburger');
const hamburger_expand = document.querySelector('.hamburger-expand');
const hamburger_collapse = document.querySelector('.hamburger-collapse');
const headerMenu = document.querySelector('.header__menu');
let sectionsList = [];
let currentActiveSection; // Tracks the currently active section.
let scrollTimeoutId; // Init the scolling timer.

/*
# ----------------------------<|----------------|>--------------------------- #
# -----------------------------|HELPER FUNCTIONS|---------------------------- #
# ----------------------------<|------LOGIC-----|>--------------------------- #
*/
/*
# -----------------------------|section's helpers|---------------------------- #
 */

// Set section state to active.
const setSectionStateTo_Active = (section, sectionContent) => {
	currentActiveSection = section;
	// TODO: add a class of active.
	// inset 2px 2px 10px 3px #453c3c
	// section.style.border = '1px solid red';
	// header.
	section.children[0].style.left = 0;
	// section's content.
	sectionContent.style.right = 0;
	// Add active state to the corresponding menu link.
	setMenuToCurrentActiveSection(currentActiveSection);
	section.classList.add('section--active');
};

// Set section state to inactive.
const setSectionStateTo_Inactive = (section, sectionContent) => {
	removeActiveInHero();
	currentActiveSection = null;
	// section.style.border = '';
	// header.
	section.children[0].style.left = `${100}%`;
	// section's content.
	sectionContent.style.right = `${100}%`;
	section.classList.remove('section--active');
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
			if (section.classList.contains('section--active')) {
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
// TOFIX: there's a weird behavior in chrome when jumping to a section then jumping back to home, the menu disapears :(.
const scrollToSection = (e) => {
	if (e.target.nodeName === 'A') {
		scrollToSectionBy_Anchor(e);
	} else if (e.target.nodeName === 'I') {
		scrollToSectionBy_Icon(e);
	}
};

const scrollToSectionBy_Icon = (e) => {
	let section = e.target.parentElement.parentElement;
	let target = document.querySelector(`#${section.getAttribute('id')}`);
	let targetTop = target.getBoundingClientRect().top;
	let top = targetTop - header.offsetHeight;
	window.scrollBy({
		top: top,
		// Scroll behavior is already set in the styleSheet.
	});
};

const scrollToSectionBy_Anchor = (e) => {
	e.preventDefault();
	// If responsive menu is active, remove it.
	if (headerMenu.classList.contains('header__menu--active')) {
		hamburgerVisibilyHandler();
	}
	let link = e.target;
	let target = document.querySelector(link.getAttribute('href'));
	let targetTop = target.getBoundingClientRect().top;
	let top = targetTop - header.offsetHeight;
	window.scrollBy({
		top: top,
		// Scroll behavior is already set in the styleSheet.
	});
};

/*
# ---------------------------|menu & links' helpers|-------------------------- #
 */

// Builds the navigation menu from the list of sections.
const navMenuBuilder = () => {
	// Populate the list of sections.
	[...sectionsList] = document.querySelectorAll('.content__section');
	const fragment = document.createDocumentFragment();
	sectionsList.forEach((section, index) => {
		let listItem = document.createElement('li');
		let listItemLink = document.createElement('a');
		listItemLink.innerText = section.getAttribute('data-menu');
		listItemLink.setAttribute('href', `#${section.getAttribute('id')}`);
		listItemLink.classList.add('header__link');
		listItemLink.classList.add(`header__link--${listOfColors_links[index]}`);
		sectionsList[index].style.backgroundColor = `${listOfColors[index]}`;
		listItem.appendChild(listItemLink);
		fragment.appendChild(listItem);
	});
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

// TODO: If we scroll to a section by clicking a link, section should scrollUp the widht of the menu when the menu hides.

// Handels the visibility of the menu with a timer.
const menuVisibilityHandeler = () => {
	// Only hides the menu, if the view is outside of the hero section and/or the responsive menu is not active.
	if (
		window.scrollY <= hero.offsetHeight ||
		headerMenu.classList.contains('header__menu--active')
	) {
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

const hamburgerVisibilyHandler = () => {
	// Toggle active class of the li elements.
	for (let li of [...menuChildrenList]) {
		li.classList.toggle('menu__item--active');
	}
	headerMenu.classList.toggle('header__menu--active');
	hamburger_expand.classList.toggle('hidden');
	hamburger_collapse.classList.toggle('hidden');
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
	// Shows the scroll-to-top btn if we scroll pass a certain distance from the top of the page.
	if (window.pageYOffset >= (hero.offsetHeight * 50) / 100) {
		document.querySelector('.scroll-to-top').style.display = 'block';
	} else {
		document.querySelector('.scroll-to-top').style.display = 'none';
	}
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
// TODO: refactor this to make use of helper function.
content.addEventListener('click', (event) => {
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
		// ScrollTo section when expanded. This can be uncommented.
		scrollToSection(event);
	}
});

// Hamburger icon click handler.
hamburger.addEventListener('click', () => hamburgerVisibilyHandler());

// Scroll to top btn click handler.
document.querySelector('.scroll-to-top').addEventListener('click', (event) => {
	window.scroll({
		top: 0,
	});
});
