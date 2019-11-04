ACRONYMFINDER_URL = "https://www.acronymfinder.com"

function handleResult() {
  const document = this.responseXML;
  const path = ".//td[@class='result-list__body__meaning']"
  var nodes = document.evaluate(path, document.body, null, XPathResult.ANY_TYPE, null);
  const results = [];
  let node = nodes.iterateNext(); 
  while (node) {
    const rank = parseInt(node.previousSibling.childNodes[0].className[1]);
    if (rank >= 4)
      results.push(node.textContent);
    node = nodes.iterateNext();
  }
  if (results.length > 0) {
    alert(results.join("\n"));
  } else {
    alert("Sorry, I couldn't find anything... I work best for general acronyms.");
  }
}
function handleClick(info) {
  let acronymQuery = info.selectionText;
  const lastChar = acronymQuery.charAt(acronymQuery.length - 1);
  const allButLastChar = acronymQuery.slice(0, -1);
  if (allButLastChar == allButLastChar.toUpperCase() && lastChar == "s") {
    acronymQuery = allButLastChar;
  }
  const req = new XMLHttpRequest();
  req.addEventListener("load", handleResult);
  req.open("GET", ACRONYMFINDER_URL + `/${acronymQuery}.html`);
  req.responseType = "document";
  req.send();
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "Search Acronym",
    "title": "Acronym Search",
    "contexts": ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(handleClick);