const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const img = new Image();

img.src = "./images/3rd-cab.jpg";

img.onload = function () {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

function changeImageColor(hexColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Convert RGB to HSL
    let hsl = rgbToHsl(r, g, b);

    // Modify the hue based on the user's input
    hsl[0] = hexToHue(hexColor);

    // Convert HSL back to RGB
    const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }

  ctx.putImageData(imageData, 0, 0);
}

$(document).ready(() => {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        // Check if 'color' property is modified
        const element = mutation.target;
        const style = window.getComputedStyle(element);
        const currentColor = style.backgroundColor;
        console.log(`Color changed to: ${currentColor}`);
        const rgbList = currentColor
          .substring(4)
          .split(",")
          .map((numStr) => parseInt(numStr));

        const hexVal = rgbToHex(currentColor);

        changeImageColor(hexVal);

        $("input.target").val(hexVal);
      }
    }
  });
  observer.observe(document.querySelector(".pixel.realPixel"), {
    attributes: true,
    attributeFilter: ["style"],
  });

  $("input.target").on("keydown", function (e) {
    if (e.key === "Enter") {
      changeImageColor($(this).val());
    }
  });
});
