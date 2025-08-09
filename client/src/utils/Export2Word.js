export function Export2Word(elementId, filename = "document.doc") {
  const preHtml =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
  const postHtml = "</body></html>";

  const content = document.getElementById(elementId);
  if (!content) {
    alert("Element not found: " + elementId);
    return;
  }

  const html = preHtml + content.innerHTML + postHtml;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });

  // Save the file
  const url = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
