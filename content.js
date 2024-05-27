(function () {
  var _browser = window.chrome ? chrome : browser;
  var extId = _browser.runtime.id;
  var objId = "DigitalPersona";

  !(function () {
    var script = document.createElement("script");

    script.textContent =
      "(" +
      function (extId, objId) {
        var extension = (window[objId] = {});

        window[extId] = extension;

        const BASE_URL = "http://localhost:8282";
        const captureUrl = "/v2/scanner/capture";
        const deviceUrl = "/v2/scanner/devices";

        async function sendRequest(url, method, body) {
          try {
            const response = await fetch(url, {
              method: method,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return await response.json();
          } catch (error) {
            console.error(
              "There was a problem with your fetch operation:",
              error
            );
            return null;
          }
        }

        extension.capture = async function (requestBody) {
          const res = await sendRequest(BASE_URL + captureUrl, "POST", requestBody);
          return res;
        };

        extension.loadDevices = async function () {
          const res = await sendRequest(BASE_URL + deviceUrl, "GET");
          return res;
        };
      } +
      ")(" +
      JSON.stringify(extId) +
      "," +
      JSON.stringify(objId) +
      ")";

    (document.head || document.documentElement).appendChild(script);

    script.parentNode.removeChild(script);
  })();
})();
