"use strict";
initStatic();
initPersistence();
initRulesReader();
$("print-btn").addEventListener("click", () => window.print());

// Expand supplemental information for printing, then restore the reader's choices.
let printDetails = [];
window.addEventListener("beforeprint", () => {
  printDetails = qsa("#app-content details").map((element) => [
    element,
    element.open,
  ]);
  printDetails.forEach(([element]) => {
    element.open = true;
  });
});
window.addEventListener("afterprint", () => {
  printDetails.forEach(([element, open]) => {
    element.open = open;
  });
  printDetails = [];
});
