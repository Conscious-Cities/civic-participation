/**
 * Takes HTMLFileInputElement as argument and returns Base64 string.
 *
 * @param {HTMLFileInputElement} element - File input which allows user to select file in our case it is iamge.
 * @returns {Promise} - Base64 string of given image.
 */
function encodeImageFileAsURL(element) {
  return new Promise((resolve, reject) => {
    var file = element.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.onerror = function () {
      reject("not able to convert image to base64 image");
    };

    reader.readAsDataURL(file);
  });
}