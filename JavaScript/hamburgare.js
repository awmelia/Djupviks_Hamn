mainBurger();

export function mainBurger() {
  //For the ability to have a hamburger icon that is also able to change to an x when clicked as nav opens up.
  var checkbox = document.querySelector(".nav-toggle");

  checkbox.addEventListener(('change'), hamburger);
}

function hamburger() {
  let label = document.querySelector(".nav-toggle-label");
    if (this.checked && label != undefined) {
      let label = document.querySelector(".nav-toggle-label")
      label.classList.remove('nav-toggle-label');
      label.classList.add('open');
    }else {
      var newLabel = document.querySelector(".open");
      newLabel.classList.remove('open');
      newLabel.classList.add('nav-toggle-label');
    }
}