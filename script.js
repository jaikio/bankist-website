'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header'); //selects first element

const allButtons = document.getElementsByTagName('button');

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//functionality modal

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

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//smooth scroll on Learn more

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//cookie message

const message = document.createElement('div'); //creates DOM Object, that needs to be inserted to be visible
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.append(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//page navigation smooth scroll

document.querySelector('.nav__links').addEventListener('click', function (e) {
  //1. add event listener to common parent element
  if (e.target.classList.contains('nav__link')) {
    // matching strategy (only clicks on valid child elements need to be processed)
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//menu fade animation
const nav = document.querySelector('.nav');
const navs = document.querySelectorAll('.nav__item');

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//sticky navigation
const navHeight = nav.getBoundingClientRect();

const stickyNav = function (entries) {
  const [entry] = entries;
  entry.isIntersecting
    ? nav.classList.remove('sticky')
    : nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});
headerObserver.observe(header);

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//revealing elements on scroll
const allSections = document.querySelectorAll('.section'); //selects all elements, returns nodelist

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
});

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const lazyImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    imgObserver.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(lazyImage, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach(target => imgObserver.observe(target));

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//slider component

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlides = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  goToSlide(0);

  const nextSlide = function () {
    if (currentSlide === maxSlides - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    syncDots(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlides - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    syncDots(currentSlide);
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  const syncDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  syncDots(0);

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      syncDots(slide);
    }
  });
};

slider();

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// const s1coords = section1.getBoundingClientRect();
// console.log(`------------coordinates of section 1:--------------`);
// console.log(s1coords);

// console.log(
//   `------------coordinates of position when btn clicked--------------`
// );
// console.log(e.target.getBoundingClientRect());
// console.log(`------------coordinates of current scroll--------------`);
// console.log(`Current scroll (x/y): ${scrollX} ${scrollY}`);

// console.log(`------------section 1 coordinates left and top--------------`);
// console.log(s1coords.top, s1coords.right, s1coords.bottom, s1coords.left);

// console.log(`------------height and width of viewport:--------------`);
// console.log(
//   'Height and width of viewport:' + document.documentElement.clientHeight,
//   document.documentElement.clientWidth
// );
// window.scrollTo({
//   left: s1coords.left + window.scrollX,
//   top: s1coords.top + window.scrollY,
//   behavior: 'smooth',
// });

// document.documentElement; //selects whole html element
// document.head; //selects head
// document.body; //selects body

//by HTML type
// document.getElementById('section--1');
// document.getElementsByClassName('header');

//creating and inserting elements
//.insertAdjacentHTML

// message.textContent.add('We use cookies for improved functionality and analytics.');

//style
// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// const h1 = document.querySelector('h1');
// const alerth1 = function (e) {
//   h1.textContent = 'addEventListener: Great! You are reading the heading :D';

//   h1.removeEventListener('mouseenter', alerth1);
// };
// h1.addEventListener('mouseenter', alerth1);
// h1.onmouseleave = function () {
//   h1.textContent = 'When banking meets minimalist';
// };

//rgb(255,255,255)
// const randomInt = (min, max) => Math.round(Math.random() * max - min) + min;
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav-link').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });

// const h1 = document.querySelector('h1');

// //going downwards child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //going upwards [arents
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// //going sideways, siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// //or move up and down again for all siblings
// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   window.scrollY > initialCoords.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });
// const observerCallback = function (entires, observer) {
//   entires.forEach(entry => console.log(entry));
// };

// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log(e);
// });

// window.addEventListener('load', e => console.log(e));

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
