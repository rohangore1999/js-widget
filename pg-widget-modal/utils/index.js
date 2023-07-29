// Constants
import { bankDetails, emiDetails, iconMapping } from "../constants/common";

export const renderIcon = (data, mode) => {
  let icon;

  switch (mode) {
    case "offers":
      const enableMode = data.enabledModes[0];
      icon = paymentsIcons.getIcon(
        iconMapping[data.paymentModes[enableMode][0].display]
      );

      return icon.icon_url;

    case "payLater":
      if (data.display.split(" ")[0] === "HomeCredit")
        return "https://merchant.cashfree.com/merchants/d3b0d9bda235d4aec7b7.svg";

      if (data.display.split(" ")[0] === "kreditBee")
        return "https://payments.cashfree.com/order/icons/cardlessemi/kreditbee.png";

      icon = paymentsIcons.getIcon(iconMapping[data.display]);

      return icon.icon_url;

    case "emi":
      icon = paymentsIcons.getIcon(iconMapping[data.nick]);

      return icon.icon_url;
  }
};

export const getBankDetails = (payLater) =>
  bankDetails.filter((bankDetail) => bankDetail.paymentCode === payLater.code);

export const getEMIBankDetails = (emi) =>
  emiDetails.filter((emiDetail) => emiDetail.paymentCode === emi.paymentCode);

export const convertDateTime = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const modalClose = () => {
  const modal = document.querySelector(".main-modal");

  modal.classList.remove("fadeIn");
  modal.classList.add("fadeOut");

  const modalContainer = document.querySelector(".modal-container");
  modalContainer.classList.remove("active");

  setTimeout(() => {
    modal.style.display = "hidden";
  }, 500);

  window.top.postMessage({ isModelClose: true }, "*");
};

export function copyText(htmlElement) {
  if (!htmlElement) return;

  // get the Code text
  let elementText = htmlElement.innerText;

  // create input element
  let inputElement = document.createElement("input");

  // set the value in input
  inputElement.setAttribute("value", elementText);

  // append it in dom
  document.body.appendChild(inputElement);

  // select the text inside input
  inputElement.select();

  // execute copy comman
  document.execCommand("copy");

  // remove input element
  inputElement.parentNode.removeChild(inputElement);
}
