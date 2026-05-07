const sliderButtons = document.querySelectorAll('.meeting__slider__button');
const slider = document.querySelector('.meeting__slider');

const meetings = document.querySelectorAll('.meeting');

// console.log(meetingsL)

let meetingCounter = 0;

for (const meeting of meetings) {
    meetingCounter+=1;
}

let counter = 0;

// for (const button of sliderButtons) {
//     button.addEventListener('click', function () {
//             if(button.id==='leftButton') {
//                 if(counter !== 0) {
//                     counter-=1;
//                     slider.style.transform = `translateX(${-400*counter}px)`;
//                 }
//             }
//             else {
//                 if(counter<(meetingCounter-1)) {
//                     counter+=1;
//                     slider.style.transform = `translateX(${-400*counter}px)`;
//                 }
//             }
//             console.log(counter);
//         }
//     );
// };

sliderButtons.forEach((button)=>{
    button.addEventListener('click', ()=>{
        if(button.id==='leftButton') {
            if(counter !==0) {
                counter-=1;
                slider.style.transform = `translateX(${-400*counter}px)`;
            }
        }
        else {
            if(counter<(meetingCounter-1)) {
                counter+=1;
                slider.style.transform = `translateX(${-400*counter}px)`;
            }
        }
        console.log(counter);
    })
})

