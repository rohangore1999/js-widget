let isWebappjs = false;
let frameDataObj;

// For Woocommerce
window.addEventListener("load", function () {
  if (isWebappjs) return;
  // from Iframes
  const iframeDiv = document.getElementById("cashfree-widget");

  if (!iframeDiv) return;

  const oldIframe = document.getElementById("cf-iframe");

  if (oldIframe) {
    oldIframe.parentElement.removeChild(oldIframe);
  }

  // API call
  const getData = async () => {
    if (
      (iframeDiv.dataset.isoffers === "no" &&
        iframeDiv.dataset.ispaylater === "no" &&
        iframeDiv.dataset.isemi === "no") ||
      !iframeDiv.dataset.amount ||
      iframeDiv.dataset.amount === "" ||
      iframeDiv.dataset.appid.includes("data") ||
      iframeDiv.dataset.appid === ""
    ) {
      return;
    }

    const response = await fetch(
      `https://receiver.cashfree.com/pgnextgenconsumer/uiapi/external/merchants/offers?appId=${iframeDiv.dataset.appid}&amount=${iframeDiv.dataset.amount}`,
      {
        method: "POST",
        body: JSON.stringify({
          isOffer: iframeDiv.dataset.isoffers === "yes" ? true : false,
          isPayLater: iframeDiv.dataset.ispaylater === "yes" ? true : false,
          isEMIPlans:
            iframeDiv.dataset.amount > 2500 && iframeDiv.dataset.isemi === "yes"
              ? true
              : false,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    const frameData = await response.json();

    return frameData;
  };

  // dynamic iframes
  const iframe = document.createElement("iframe");

  if (
    (iframeDiv.dataset.isoffers === "no" &&
      iframeDiv.dataset.ispaylater === "no" &&
      iframeDiv.dataset.isemi === "no") ||
    !iframeDiv.dataset.amount ||
    iframeDiv.dataset.amount === "" ||
    iframeDiv.dataset.appid.includes("data") ||
    iframeDiv.dataset.appid === ""
  ) {
    iframe.style.display = "none";
  }

  iframe.src = "https://js-widget-frame.cashfree.com/"; // hosted bundle of our UI
  iframe.id = "cf-iframe";
  iframe.loading = "eager";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  iframe.onload = async () => {
    frameDataObj = await getData();

    if (
      frameDataObj.statusCode ||
      (frameDataObj.offerDetails.offers.length === 0 &&
        frameDataObj.payLaters.length === 0 &&
        frameDataObj.emiDetails.ccEMIPlans.length === 0 &&
        frameDataObj.emiDetails.dcEMIPlans.length === 0)
    ) {
      iframe.style.display = "none";
    }

    iframe.contentWindow.postMessage(
      {
        frameDataObj: frameDataObj,
        amount: iframeDiv.dataset.amount,
        appId: iframeDiv.dataset.appid,
      },
      "https://js-widget-frame.cashfree.com/"
    );
  };

  iframeDiv.appendChild(iframe);

  const oldIframeDetails = document.getElementById("cf-iframe-details");

  if (oldIframeDetails) {
    oldIframeDetails.parentElement.removeChild(oldIframeDetails);
  }

  // dynamic iframes
  const iframeDetails = document.createElement("iframe");

  iframeDetails.src = "https://js-widget-detailframe.cashfree.com/"; // hosted bundle of our UI
  iframeDetails.id = "cf-iframe-details";
  iframeDetails.loading = "eager";
  iframeDetails.style.width = "100%";
  iframeDetails.style.height = "100vh";
  iframeDetails.style.border = "none";
  iframeDetails.style.zIndex = "99999";
  iframeDetails.style.position = "fixed";
  iframeDetails.style.top = "0px";
  iframeDetails.style.left = "0px";
  iframeDetails.style.display = "none";

  iframeDiv.appendChild(iframeDetails);

  window.onmessage = function (e) {
    if (e.data.isModelOpen) {
      iframeDetails.style.display = "block";
      document.body.style.overflow = "hidden";

      iframeDetails.onload = () => {
        iframeDetails.contentWindow.postMessage(
          {
            opentab: e.data.opentab,
            amount: iframeDiv.dataset.amount,
            frameDataObj: frameDataObj,
          },
          "https://js-widget-detailframe.cashfree.com/"
        );
      };

      iframeDiv.appendChild(iframeDetails);
    }

    if (e.data.isModelClose) {
      const oldIframeDetails = document.getElementById("cf-iframe-details");

      oldIframeDetails.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };
});

// ------------------------------------------------

// For Native JS and Shopify
const CF_Widget = function ({ clientID, amount, offers, payLater, emi }) {
  isWebappjs = true;
  let executed = false;

  function load() {
    if (executed) {
      return;
    }

    executed = true;

    // from Iframes
    const iframeDiv = document.getElementById("cashfree-widget");

    if (!iframeDiv) return;

    const oldIframe = document.getElementById("cf-iframe");

     if (oldIframe) {
      oldIframe.parentElement.removeChild(oldIframe);
    }

    // API calls
    const getData = async () => {
      if (
        (offers === "false" && payLater === "false" && emi === "false") ||
        !amount ||
        amount === "" ||
        !clientID ||
        clientID === ""
      ) {
        return;
      }

      const response = await fetch(
        `https://receiver.cashfree.com/pgnextgenconsumer/uiapi/external/merchants/offers?appId=${clientID}&amount=${amount}`,
        {
          method: "POST",
          body: JSON.stringify({
            isOffer: offers === "true" ? true : false,
            isPayLater: payLater === "true" ? true : false,
            isEMIPlans: amount > 2500 && emi === "true" ? true : false,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      const frameData = await response.json();

      return frameData;
    };

    // dynamic iframes
    const iframe = document.createElement("iframe");

    if (
      (offers === "false" && payLater === "false" && emi === "false") ||
      !amount ||
      amount === "" ||
      !clientID ||
      clientID === ""
    ) {
      iframe.style.display = "none";
    }

    iframe.src = "https://js-widget-frame.cashfree.com/"; // hosted bundle of our UI
    iframe.id = "cf-iframe";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.loading = "eager";

    iframe.onload = async () => {
      frameDataObj = await getData();

      if (
        frameDataObj.statusCode ||
        (frameDataObj.offerDetails.offers.length === 0 &&
          frameDataObj.payLaters.length === 0 &&
          frameDataObj.emiDetails.ccEMIPlans.length === 0 &&
          frameDataObj.emiDetails.dcEMIPlans.length === 0)
      ) {
        iframe.style.display = "none";
      }

      iframe.contentWindow.postMessage(
        {
          frameDataObj: frameDataObj,
          amount: amount,
          appId: clientID,
        },
        "https://js-widget-frame.cashfree.com/"
      );
    };

    iframeDiv.appendChild(iframe);

    const oldIframeDetails = document.getElementById("cf-iframe-details");

    if (oldIframeDetails) {
      oldIframeDetails.parentElement.removeChild(oldIframeDetails);
    }

    // dynamic iframes
    const iframeDetails = document.createElement("iframe");

    iframeDetails.src = "https://js-widget-detailframe.cashfree.com/"; // hosted bundle of our UI
    iframeDetails.id = "cf-iframe-details";
    iframeDetails.loading = "eager";
    iframeDetails.style.width = "100%";
    iframeDetails.style.height = "100vh";
    iframeDetails.style.border = "none";
    iframeDetails.style.zIndex = "99999";
    iframeDetails.style.position = "fixed";
    iframeDetails.style.top = "0px";
    iframeDetails.style.left = "0px";
    iframeDetails.style.display = "none";

    iframeDiv.appendChild(iframeDetails);

    window.onmessage = function (e) {
      if (e.data.isModelOpen) {
        iframeDetails.style.display = "block";
        document.body.style.overflow = "hidden";

        iframeDetails.onload = () => {
          iframeDetails.contentWindow.postMessage(
            {
              opentab: e.data.opentab,
              amount: amount,
              frameDataObj: frameDataObj,
            },
            "https://js-widget-detailframe.cashfree.com/"
          );
        };

        iframeDiv.appendChild(iframeDetails);
      }

      if (e.data.isModelClose) {
        const oldIframeDetails = document.getElementById("cf-iframe-details");

        oldIframeDetails.style.display = "none";
        document.body.style.overflow = "auto";
      }
    };
  }

  return {
    load,
  };
};

window["CF_Widget"] = CF_Widget;
