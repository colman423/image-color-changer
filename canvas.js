const getResolution = () => {
  try {
    const url = window.location.href;
    const urlParams = new URLSearchParams(url.split("?")[1]); // Split the URL and get the query part
    const res = urlParams.get("res");
    return res || 1000;
  } catch (error) {
    return 1000;
  }
};

$(document).ready(() => {
  const canvas = document.getElementById("img-canvas");
  const imgInput = document.getElementById("img-input");

  const resolution = getResolution();

  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d");

  initImgSrc = "./images/Orange-color.jpg";

  var imageData = null;
  function changeImageColor(hexColor) {
    if (!imageData) {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
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

  function loadImage(imageSrc) {
    const img = new Image();
    img.src = imageSrc;

    img.onload = function () {
      // canvas.width = window.innerWidth * 0.5;
      canvas.height = (img.height / img.width) * canvas.width;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      imageData = null;
    };

    $(imgInput).attr("src", imageSrc);
  }

  $("input#file-uploader").on("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        loadImage(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  });

  var myPicker = new JSColor("#js-color-input", {
    format: "hex",
    previewSize: 100,
    previewElement: "#color-block",
    onInput: function () {
      changeImageColor(this.toHEXString());
    },
  });

  loadImage(initImgSrc);
});
