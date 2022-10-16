('use strict');

/////////////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content ');

const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');

const allSections = document.querySelectorAll('.section');

//////////////////////////////////////////////
// Open Modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////
// Smooth Scrolling

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////
// Page Navigation

// EVENT DELAGATION - use of bubbling
// 1. Add event listener to the parent of all the elements
// 2. Determin what element originated the event

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy - ignore clicks that don't happen on the target
  // e.target is the element that was clicked
  // select only elements whose targets contain the class
  if (
    e.target.classList.contains('nav__link') &&
    // deselect button
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////////////
// Cookie pop-up

// creating the element
const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
  'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

header.append(message);
// can't select in DOM until it is appended so declaration must be after 'append'
const btnCloseCookie = document.querySelector('.btn--close-cookie');

btnCloseCookie.addEventListener('click', function () {
  message.remove();
});

// styling
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
message.style.position = 'fixed';
message.style.bottom = 0;
message.style.zIndex = 100;

//////////////////////////////////////////////
// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  // selects the closest parent (or itself) with the class
  // Used to make sure that all children of the button will select the parents class
  const clicked = e.target.closest('.operations__tab');

  // GUARD CLAUSE - if click is null (doesn't have a parent with class '.operations__tab'), return (finish function)
  if (!clicked) return;

  // First remove class on all tabs, then add to clicked
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // ADD CLASSLIST
  clicked.classList.add('operations__tab--active');

  // Remove all Content
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  // Use 'data' to select corresponding tab content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////////
// MENU FADE ANIMATION

const handleHover = function (e) {
  // don't need 'closest' method because there are no child elements that can be clicked
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // Get siblings - select parent with 'closest', then select all siblings with class 'nav__link'
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// 'mouseover / mouseout' is similar to 'mouseenter / mouseleave' but the latter doesn't bubble
// second argument of 'addEvenetListener' must be a function
// Use bind method - 'bind' creates a copy of the function its called on and will set the 'this' keyword on the function to whatever we pass in bind
// Here, 'this' becomes the value of opacity

// Passing "argument" into a handler - only can have 1 real argument 'e'
// if you need more than 1 'argument then you can use an array or object
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////////////
// STICKY NAVIGATION

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = entries => {
  // Since only 1 threshold
  const [entry] = entries;

  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // margin applied outside of target element
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////////////////////////////////////////////
// Reveal Sections

// Reveal only once and the unobserve for better performance
// After all sections are revealed, this does nothing

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Guard
  if (!entry.isIntersecting) return;

  // Reveal once
  entry.target.classList.remove('section--hidden');
  // unobserve
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// use 'forEach' to observe all sections
allSections.forEach(section => {
  sectionObserver.observe(section);
  // to hide all sections from the start
  // section.classList.add('section--hidden');
});

//////////////////////////////////////////////
// LAZY LOADING IMAGES
// This method is very good for performance
// Start with a very small, low-res image and blur it
// have the ref to the real img as  an attribute 'data-src' and replace the low-res img

// get all 'img' that have an attribute 'img-src'
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace 'src' attribute with 'data-src'
  entry.target.src = entry.target.dataset.src;

  // loading an image creates a 'load' event
  // Always use the 'load' event in case users device is slow
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // use 'rootMargin' to load imgs before user scrolls to hide lazyness
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////
// SLIDER

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  const maxSlide = slides.length;

  let curSlide = 0;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // changes slides
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i = 0) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Activate the dots
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    // use [] to select a certain atribute and value
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //next slide - -100, 0, 100, 200
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    // So the first dot is active when the page loads
    activateDot(0);
    // set initial positions - 0%, 100%, 200%, 300%
    // slides.forEach((s, i = 0) => (s.style.transform = `translateX(${100 * i}%)`));
    goToSlide(0);
  };

  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Add arrow key functionality
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    // can use short circuiting
    e.key === 'ArrowRight' && nextSlide();
  });

  // add functionallity to dots
  // Use propagation
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // can use destructuring - without = const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
