const startButton = document.getElementById("start-animation-btn");
const resetButton = document.getElementById("reset-btn");

const textDirections = document.getElementById("text-directions");

const imageHolderDiv = document.getElementById("revealed-img-holder");
const revealedImg = document.getElementById("revealed-img");

const animatedSquare = document.getElementById("animated-square");
const outerBoxFrame = document.getElementById("outer-box-frame");

const animationSpeedSlider = document.getElementById("animation-speed-slider");
const animationOutputNumber = document.getElementById("animation-cycle-length");

const imageChoiceButton = document.getElementById("image-choice-btn");
const backgroundImagePreview = document.getElementById(
  "background-img-preview"
);
const modalHolder = document.getElementById("modal-holder");
const imageGalleryHolder = document.getElementById("image-gallery-holder");
const cycleNumberInput = document.getElementById("cycle-number-input");
const animationCycleNumberTextValue = document.getElementById(
  "animation-cycle-number"
);
const galleryInputField = document.getElementById("gallery-addition");

let defaultAnimationCycleNumber = 3;
let directionsIndex = 0;
let iterationCount = 0;
let currentIteration = 0;
let timeoutID, fullDuration, animationIterations;
cycleNumberInput.value = defaultAnimationCycleNumber;

let currentAnimationCycleNumber = defaultAnimationCycleNumber;

animationCycleNumberTextValue.innerHTML = `${currentAnimationCycleNumber} `;
cycleNumberInput.addEventListener("input", function() {
  animationCycleNumberTextValue.innerHTML = `${cycleNumberInput.value} `;
  currentAnimationCycleNumber = cycleNumberInput.value;
});

let directionsList = ["Inhale", "Hold", "Exhale", "Pause"];

(function() {
  animationOutputNumber.innerHTML = animationSpeedSlider.value;
})();
animationSpeedSlider.oninput = function() {
  animationOutputNumber.innerHTML = this.value;
  resetToInitial();
};

resetButton.disabled = true;

let imageArray = [
  {
    src: "black-and-white-forest.webp",
    credits: "Adobe Stock-Pixabay on Pexels",
    description: "Snow Covered Forest In Fog",
  },
  {
    src: "tunnel-to-sea.webp",
    credits: "Adobe Stock-Pixabay on Pexels",
    description: "View Of Sea Through Rough Cave on Beach",
  },
  {
    src: "daylight-forest-with-mountains.webp",
    credits: "Adobe Stock-Pixabay on Pexels",
    description: "Bright Daylight Forest In Front of Mountains",
  },
  {
    src: "high-rise-building-with-train.webp",
    credits: "Photo by Alex Powell from Pexels",
    description: "Train Passing Highrise Buildings At Night",
  },
  {
    src: "lightbeam-forest-road.webp",
    credits: "Photo by JOHN TOWNER on Unsplash",
    description: "Bright Ray of Light Illuminates a Shadowed Forest Road",
  },
  {
    src: "waterfall-between-trees.webp",
    credits: "Photo by Rifqi Ramadhan from Pexels",
    description: "Waterfall Between Trees Falling to Serene Lake",
  },
  {
    src: "long-shore-waves.webp",
    credits: "Photo by Shifaaz shamoon on Unsplash",
    description: "Blue Sea Crashing Into White Sand",
  },
  {
    src: "dark-forest-and-stairs.webp",
    credits: "CodeHaven via wallbase.cc",
    description: "Dark Forest With Descending Stairs",
  },
];
(function randomizeBackgroundImage() {
  revealedImg.src = `./assets/images/${
    imageArray[Math.floor(Math.random() * imageArray.length)].src
  }`;
  console.log(revealedImg);
})();

backgroundImagePreview.src = revealedImg.src;

function setBackgroundImage() {
  let imageList = document.querySelectorAll("img.gallery-item");
  imageList.forEach(function(image) {
    image.classList.remove("selected-image");
  });
  backgroundImagePreview.src = this.src;
  revealedImg.src = this.src;
  this.classList.add("selected-image");
}

// sizes="(min-width: 700px) 20vw,
//               30vw"

function getFullSrc(string) {
  if (string.includes("//")) {
    return string;
  } else {
    return `./assets/images/${string}`;
  }
}

// src="./assets/images/${itemObject.src}"

function createImageGallery() {
  let imageGallery = imageArray.map(function(itemObject) {
    let listElement = document.createElement("li");
    listElement.innerHTML = `
      <figure class="img-wrapper">
        <img class="gallery-item" onclick="setBackgroundImage.call(this)"  
        src="${getFullSrc(itemObject.src)}"
        srcset=""
        alt="${itemObject.description}"
        title="${itemObject.credits}">
        <figcaption></figcaption>
      </figure>`;

    return listElement;
  });
  return imageGallery;
}

function populateImageGallery() {
  createImageGallery().forEach(function(item) {
    imageGalleryHolder.appendChild(item);
  });
}
populateImageGallery();

imageChoiceButton.onclick = function() {
  showModal();
};

function showModal() {
  modalHolder.classList.remove("hidden");
}
function hideModal() {
  modalHolder.classList.add("hidden");
}
window.onclick = function() {
  if (event.target == (imageGalleryHolder || modalHolder)) {
    hideModal();
  }
};

let closeModalButton = document.createElement("div");
closeModalButton.innerHTML = `<svg class="bi bi-x-circle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clip-rule="evenodd"/>
<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
<path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
</svg>`;
closeModalButton.classList.add("close-gallery-modal");
modalHolder.appendChild(closeModalButton);
closeModalButton.onclick = function() {
  hideModal();
};

function fadeElementIn(element) {
  element.classList.add("fading-in");
}
function fadeElementOut(element) {
  element.classList.add("fading-out");
}
function removeAnimationClasses(element) {
  element.classList.remove(
    "circle-around-animation",
    "expand-to-fill-animation",
    "circumference-animation",
    "expansion-animation",
    "selected",
    "fading-in",
    "fading-out"
  );
}
let animationTypeClass = "circle-around-animation";

function concatDuplicateArray(targetArray, numberOfTimes) {
  let longArray = targetArray;
  for (i = 1; i < numberOfTimes; i++) {
    longArray = longArray.concat(targetArray);
  }
  return longArray;
}

// Not thrilled about global scope here:
// Think of better initialization options?

// recursive setTimeouts a code smell? Consider Promises / async
function giveDirection() {
  let completeList = concatDuplicateArray(
    directionsList,
    currentAnimationCycleNumber
  );
  textDirections.innerHTML = completeList[directionsIndex];
  // console.log(completeList[directionsIndex]);
  directionsIndex++;

  if (directionsIndex < completeList.length) {
    timeoutID = setTimeout(giveDirection, (fullDuration * 1000) / 4);
  }
}

startButton.onclick = function() {
  removeAnimationClasses(textDirections);
  animatedSquare.classList.add(animationTypeClass);
  animatedSquare.style.animationDuration = `${animationSpeedSlider.value}s`;
  animatedSquare.style.animationIterationCount = `${currentAnimationCycleNumber}`;
  // console.log(animatedSquare.style.animationDuration);
  let animatedBoxProperties = window.getComputedStyle(animatedSquare);
  fullDuration = parseFloat(
    animatedBoxProperties["animation-duration"].slice(0, -1)
  );
  animationIterations = parseInt(
    animatedBoxProperties["animation-iteration-count"]
  );
  giveDirection();
  //
  fadeElementIn(imageHolderDiv);
  imageHolderDiv.style.transitionDuration = `${fullDuration *
    animationIterations}s`;
  fadeElementOut(outerBoxFrame);
  outerBoxFrame.style.transitionDuration = `${fullDuration *
    animationIterations}s`;
};

animatedSquare.onanimationstart = () => {
  startButton.disabled = true;
  resetButton.disabled = false;
};

animatedSquare.onanimationiteration = () => {
  currentIteration++;
  // console.log(`Square has moved ${currentIteration} times`);
};

animatedSquare.onanimationend = () => {
  // reset initial state (mostly)
  startButton.disabled = false;
  removeAnimationClasses(animatedSquare);
  directionsIndex = 0;
  iterationCount = 0;
  currentIteration = 0;
  startButton.innerHTML = "Breathe Again";
  textDirections.innerHTML = "Exercise Complete";
  fadeElementOut(textDirections);
};

function resetToInitial() {
  removeAnimationClasses(animatedSquare);
  // animatedSquare.classList.remove("circle-around-animation");
  imageHolderDiv.classList.remove("fading-in");
  outerBoxFrame.classList.remove("fading-out");
  imageHolderDiv.style.transitionDuration = `2s`;
  outerBoxFrame.style.transitionDuration = `2s`;
  directionsIndex = 0;
  iterationCount = 0;
  currentIteration = 0;
  resetButton.disabled = true;
  animatedSquare.style.left = "0";
  animatedSquare.style.top = "-10%";
  animatedSquare.style.height = "20%";
  animatedSquare.style.width = "20%";
  textDirections.innerHTML = "Let's Breathe";
  startButton.disabled = false;
  clearTimeout(timeoutID);
}

resetButton.onclick = function() {
  resetToInitial();
};

function chooseAnimationType(animationName) {
  animationTypeClass = animationName;
}
const circleAroundAnimationOption = document.getElementById(
  "circle-around-optn-btn"
);
const expandToSquareAnimationOption = document.getElementById(
  "expand-square-optn-btn"
);
const option1Mover = document.getElementById("option-1-mover");
const option2Mover = document.getElementById("option-2-mover");
circleAroundAnimationOption.onclick = function() {
  resetToInitial();
  chooseAnimationType("circle-around-animation");
  removeAnimationClasses(option1Mover);
  removeAnimationClasses(option2Mover);
  removeAnimationClasses(expandToSquareAnimationOption);
  // remove other buttons' classes
  option1Mover.classList.add("circumference-animation");
  circleAroundAnimationOption.classList.add("selected");
};
expandToSquareAnimationOption.onclick = function() {
  resetToInitial();
  chooseAnimationType("expand-to-fill-animation");
  removeAnimationClasses(option1Mover);
  removeAnimationClasses(option2Mover);
  removeAnimationClasses(circleAroundAnimationOption);
  option2Mover.classList.add("expansion-animation");
  expandToSquareAnimationOption.classList.add("selected");
};

function createImageGallery() {
  let imageGallery = imageArray.map(function(itemObject) {
    let listElement = document.createElement("li");
    listElement.innerHTML = `
      <figure class="img-wrapper">
        <img class="gallery-item" onclick="setBackgroundImage.call(this)"  
        src="${getFullSrc(itemObject.src)}"
        srcset=""
        alt="${itemObject.description}"
        title="${itemObject.credits}">
        <figcaption></figcaption>
      </figure>`;

    return listElement;
  });
  return imageGallery;
}

function createFigureNode() {
  let newNode = document.createElement("li");
  newNode.innerHTML = `
  <figure class="img-wrapper">
        <img class="gallery-item" onclick="setBackgroundImage.call(this)"  
        src="${galleryInputField.value}"
        srcset=""
        alt=""
        title="">
        <figcaption></figcaption>
      </figure>`;
  return newNode;
}

function addImageToGallery() {
  event.preventDefault;
  imageGalleryHolder.appendChild(createFigureNode());
}

const newImageSubmitButton = document.getElementById("submit-new-image-button");
newImageSubmitButton.onclick = function() {
  addImageToGallery();
};
