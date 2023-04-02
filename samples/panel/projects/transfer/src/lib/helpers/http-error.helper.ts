/**
 * Read a blob file and parse it as JSON object
 * @param blob
 */
export function blobToJSON(blob: Blob): any {
  const url = URL.createObjectURL(blob);
  const xmlRequest = new XMLHttpRequest();
  xmlRequest.open('GET', url, false);
  xmlRequest.send();
  URL.revokeObjectURL(url);
  return JSON.parse(xmlRequest.responseText);
}
