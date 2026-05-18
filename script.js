const corruselPages = document.querySelectorAll('.hero-page');
const progressBars = document.querySelectorAll('.progressbar');
const corruselBtns = document.querySelectorAll('.hero-corrusel--btn');

let currentSectionIndex = 0;
const time = 3000; 
let progress = 0; 

corruselBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        corruselPages[currentSectionIndex].classList.remove('active');
        
        currentSectionIndex = index;
        // progressBars[index].style.width = 100 + '%';
        clearInterval(sectiontimer);
        clearInterval(progressbartimer);

        corruselPages[currentSectionIndex].classList.add('active');
        
        resetProgressBars();
    });
});

function resetProgressBars() {
    progressBars.forEach(bar => bar.style.width = '0px');
    progress = 0; 
}

function showNextSection(){
    corruselPages[currentSectionIndex].classList.remove('active');
    currentSectionIndex += 1;
    if(currentSectionIndex == corruselPages.length) {
        currentSectionIndex = 0;
    }
    corruselPages[currentSectionIndex].classList.add('active');
    resetProgressBars(); // Replaced with helper function
}

function updateProgressBar(){
    const targetWidth = corruselBtns[0].getBoundingClientRect().width;
    const tick = targetWidth / 50;
    
    progress += tick;
    if (progress > targetWidth) progress = targetWidth;

    if (progressBars[currentSectionIndex]) {
        progressBars[currentSectionIndex].style.width = progress + 'px';
    }
}

const sectiontimer = setInterval(showNextSection, time);
const progressbartimer = setInterval(updateProgressBar, time / 50);