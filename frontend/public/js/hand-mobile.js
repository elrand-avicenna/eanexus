document.addEventListener("DOMContentLoaded", () => {
  const hand = document.querySelector(".hand-mobile");

  hand.addEventListener("animationend", () => {
    hand.classList.add("idle");
  });
});
