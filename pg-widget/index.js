import { track } from "@amplitude/analytics-browser";
import { init } from "@amplitude/analytics-browser";
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

// Utils
import Regex from "./utils/regex";

Sentry.init({
  dsn: "https://f692341e088742a4976b181239997add@o330525.ingest.sentry.io/4504672514670592",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
});

const openModal = (opentab) => {
  window.top.postMessage({ isModelOpen: true, opentab }, "*");
};

window.addEventListener("message", (event) => {
  document.body.style.overflowY = "hidden";
  // remove loader
  const loader = document.getElementById("loader");
  loader.classList.remove("flex");
  loader.classList.add("hidden");

  // remove add list when api gets data
  const widgetContainer = document.getElementById("widget-container");
  widgetContainer.classList.remove("hidden");
  widgetContainer.classList.add("flex");

  const { emiDetails, offerDetails, payLaters } = event.data.frameDataObj;
  const amount = event.data.amount;
  const appId = event.data.appId;

  if (event.data.widgetConfigObj) {
    const { widgetColor, linkColor, cfLogoTheme, isLogoActive } =
      event.data.widgetConfigObj;

    const isWidgetColorValid = Regex.hexaColorCode(widgetColor.toLowerCase());

    const widgetBody = document.querySelector("#widget-body");
    if (isWidgetColorValid) {
      widgetBody.classList.remove("bg-[#e3f6ff]");
      widgetBody.style.backgroundColor = widgetColor.toLowerCase() + "33";
      widgetBody.style.borderColor = widgetColor.toLowerCase();
    } else {
      widgetBody.classList.add("bg-[#e3f6ff]");
    }

    const isWidgetTextLinkValid = Regex.hexaColorCode(
      widgetColor.toLowerCase()
    );

    const widgetTextLink = document.querySelectorAll("#widget-text");
    const widgetInnerBorder = document.querySelectorAll("#widget-innerborder");
    if (isWidgetTextLinkValid) {
      widgetTextLink.forEach((textNode) => {
        textNode.classList.remove("text-[#4895D6]");
        textNode.style.color = linkColor.toLowerCase();
      });

      widgetInnerBorder.forEach((textNode) => {
        textNode.classList.remove("border-blue-100");
        textNode.style.borderColor = widgetColor.toLowerCase() + "33";
      });
    } else {
      widgetTextLink.forEach((textNode) => {
        textNode.classList.add("text-[#4895D6]");
      });

      widgetInnerBorder.forEach((textNode) => {
        textNode.classList.add("border-blue-100");
      });
    }

    const logo = document.querySelector("#logo");
    if (cfLogoTheme === "dark") {
      logo.src =
        "https://cfsdk.s3.ap-south-1.amazonaws.com/js/widget/CF_Logo_dark-NoBG.png";
    } else {
      logo.src =
        "https://cfsdk.s3.ap-south-1.amazonaws.com/js/widget/CF_Logo_white-NoBG.png";
    }

    if (!isLogoActive) {
      const logoContainer = document.querySelector("#logo-container");
      logoContainer.classList.remove("flex");
      logoContainer.classList.add("hidden");
    }
  }

  // Initialize Amplitude
  init("8a82123f9215935073f85d06243f895b", appId);

  // Page load
  track("PG offers_widget_load", {
    appId: appId,
  });

  // on button click
  const logClick = (type) => {
    track("PG widget_button_click", {
      appId: appId,
      type: type,
    });
  };

  // To show one blocks
  // show one block emi
  if (
    offerDetails.offers.length === 0 &&
    payLaters.length === 0 &&
    (emiDetails.dcEMIPlans.length !== 0 ||
      emiDetails.ccEMIPlans.length !== 0 ||
      amount >= 2500)
  ) {
    const emiContainer = document.getElementById("emi-block");
    emiContainer.style.display = "none";

    const emiBlock = document.getElementById("one-block-emi");
    emiBlock.style.display = "flex";
    emiBlock.style.marginLeft = "0px";

    const emi = document.getElementById("one-block-emi-text");
    emi.innerHTML = "₹ " + emiDetails.minEmiAmount.toLocaleString("en-US");
  }

  // show one block offers
  if (
    offerDetails.offers.length > 0 &&
    payLaters.length === 0 &&
    ((emiDetails.dcEMIPlans.length === 0 &&
      emiDetails.ccEMIPlans.length === 0) ||
      amount <= 2500)
  ) {
    const offersContainer = document.getElementById("offers-block");
    offersContainer.style.display = "none";

    const offersBlock = document.getElementById("one-block-offers");
    offersBlock.style.display = "flex";
    offersBlock.style.marginLeft = "0px";

    const offers = document.getElementById("one-block-offers-text");
    if (offerDetails.maxSavings === 0) {
      offers.innerHTML = "Get";

      const totalOffers = document.getElementById("one-block-totalOffers");
      totalOffers.innerHTML = offerDetails.offers.length + " Offers";
    } else {
      offers.innerHTML = "₹ " + Math.round(offerDetails.maxSavings);

      const totalOffers = document.getElementById("one-block-totalOffers");
      totalOffers.innerHTML = offerDetails.offers.length + " Offers";
    }
  }

  // show one block paylater
  if (
    payLaters.length > 0 &&
    offerDetails.offers.length === 0 &&
    ((emiDetails.dcEMIPlans.length === 0 &&
      emiDetails.ccEMIPlans.length === 0) ||
      amount <= 2500)
  ) {
    const paylaterContainer = document.getElementById("paylater-block");
    paylaterContainer.style.display = "none";

    const paylaterBlock = document.getElementById("one-block-paylater");
    paylaterBlock.style.display = "flex";
    paylaterBlock.style.marginLeft = "0px";
  }

  if (
    (emiDetails.dcEMIPlans.length === 0 &&
      emiDetails.ccEMIPlans.length === 0) ||
    amount <= 2500
  ) {
    const emiBlock = document.getElementById("emi-block");
    emiBlock.style.display = "none";
  } else {
    const emi = document.getElementById("emi");
    emi.innerHTML = "₹ " + emiDetails.minEmiAmount.toLocaleString("en-US");
  }

  if (payLaters.length === 0) {
    const payLaterBlock = document.getElementById("paylater-block");
    payLaterBlock.style.display = "none";
  }

  const offers = document.getElementById("offers");
  if (offerDetails.offers.length === 0) {
    offers.parentNode.style.display = "none";
  } else if (offerDetails.maxSavings === 0) {
    offers.innerHTML = "Get";
    offers.classList.remove("text-base");
    offers.classList.add("text-xs");

    const totalOffers = document.getElementById("totalOffers");
    totalOffers.innerHTML = offerDetails.offers.length + " Offers";
  } else {
    offers.innerHTML = "₹ " + Math.round(offerDetails.maxSavings);

    const totalOffers = document.getElementById("totalOffers");
    totalOffers.innerHTML = offerDetails.offers.length + " Offers";
  }
  window.logClick = logClick;
});

// to make funtion global
window.openModal = openModal;
