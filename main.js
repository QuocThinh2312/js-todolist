// const tabs = document.querySelectorAll('#tab-wrapper a');
// const tabWrapper = document.querySelector('#tab-wrapper');
// const tabContents = document.querySelectorAll('#tab-content > div');

// tabWrapper.addEventListener('click', (e) => {
//   if (e.target.nodeName === 'A') {
//     e.preventDefault();

//     tabs.forEach((tab) => {
//       if (e.target === tab) {
//         tab.classList.add('bg-red-600');
//         tab.classList.remove('bg-green-600');
//       } else {
//         tab.classList.remove('bg-red-600');
//         tab.classList.add('bg-green-600');
//       }
//     });

//     tabContents.forEach((tabContent) => {
//       if (tabContent.matches(e.target.getAttribute('href'))) {
//         tabContent.classList.remove('hidden');
//       } else {
//         tabContent.classList.add('hidden');
//       }
//     });
//   }
// });

const nav = document.querySelector('nav');

nav.setAttribute('src', '1')