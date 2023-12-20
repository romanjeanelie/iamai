export default function debugDOMElement(element) {
  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
        console.trace(); // This will log the stack trace
      } else if (mutation.type === "attributes") {
        console.log("The " + mutation.attributeName + " attribute was modified.");
        console.trace(); // This will log the stack trace
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(element, config);
}
