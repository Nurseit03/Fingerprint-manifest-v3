const captureBtn = document.getElementById("captureBtn");
const deviceSelect = document.getElementById("deviceSelect");
const formatSelect = document.getElementById("formatSelect");

const BASE_URL = "http://localhost:8282";
const captureUrl = "/v2/scanner/capture";
const deviceUrl = "/v2/scanner/devices";

captureBtn.addEventListener("click", async () => {
  captureBtn.innerHTML = '<div class="loader"></div>';

  const selectedDevice = deviceSelect.value;
  if (!selectedDevice) {
    console.error("Выберите устройство для сканирования");
    captureBtn.innerHTML = "Сканировать";
    return;
  }

  const selectedFormat = formatSelect.value;
  if (!selectedFormat) {
    console.error("Выберите формат");
    captureBtn.innerHTML = "Сканировать";
    return;
  }

  const formatFid =
    selectedFormat === "iso" ? "ISO_19794_4_2005" : "ANSI_381_2004";
  const formatFmd =
    selectedFormat === "iso" ? "ISO_19794_2_2005" : "ANSI_378_2004";
  const deviceSeq = 0;

  const format = {
    formatFid,
    formatFmd,
    deviceSeq,
  };

  await sendCaptureRequest(BASE_URL + captureUrl, format).then((data) => {
    captureBtn.innerHTML = "Сканировать";
  });
});

async function loadDevices() {
  await sendRequest(BASE_URL + deviceUrl).then((data) => {
    deviceSelect.innerHTML = "";
    data.forEach((deviceData) => {
      const option = document.createElement("option");

      option.value = deviceData.description.serialNumber;
      option.textContent = deviceData.description.productName;

      deviceSelect.appendChild(option);
    });
  });
}

window.addEventListener("DOMContentLoaded", loadDevices);

async function sendRequest(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    return null;
  }
}

async function sendCaptureRequest(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    console.log("Result:", result);
    return result;
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
  }
}
