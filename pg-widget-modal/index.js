// Utils
import {
  convertDateTime,
  copyText,
  getBankDetails,
  getEMIBankDetails,
  modalClose,
  renderIcon,
} from "./utils";

// When clicked outside modal will close
window.onclick = function (event) {
  if (event.srcElement.classList[0] === "main-modal") {
    modalClose();
  }
};

window.addEventListener("message", (event) => {
  // to make modal visible
  document.body.style.display = "block";

  const modal = document.querySelector(".modal-container");

  modal.classList.add("active");

  const openTab = event.data.opentab;

  if (openTab === "offerDetails") {
    const offersTab = document.getElementById("offersTab");
    offersTab.setAttribute("id", "default-tab");
  }

  if (openTab === "emiDetails") {
    const emiTab = document.getElementById("emiTab");
    emiTab.setAttribute("id", "default-tab");
  }

  if (openTab === "payLaterDetails") {
    const payLaterTab = document.getElementById("payLaterTab");
    payLaterTab.setAttribute("id", "default-tab");
  }

  const { emiDetails, offerDetails, payLaters } = event.data.frameDataObj;

  const amount = event.data.amount;
  const { ccEMIPlans, dcEMIPlans } = emiDetails;

  ccEMIPlans.push(...dcEMIPlans);

  if (emiDetails.isNoCostEMI) {
    document.querySelector(".emiTab").innerHTML = "No Cost EMI";
  } else {
    document.querySelector(".emiTab").innerHTML = "Card EMI";
  }

  // Offers Section //
  // check if offer exists
  if (offerDetails.offers.length === 0) {
    const offerTab = document.getElementById("offersTab");
    offerTab.parentNode.style.display = "none";
  } else {
    // offers mapping
    const firstTab = document.getElementById("offer-container");
    offerDetails.offers.map((offer) => {
      const offerContainer = document.createElement("div");
      offerContainer.innerHTML = `
    <div class="mb-8 space-y-3 bg-gray-50 p-5 rounded-md">
      <!-- First row -->
      <div class="flex items-center justify-center">
        <!-- icon -->
        <div class="flex space-x-2">
          <div
            class="group relative border p-1 rounded-md"
          >
            <img src="${renderIcon(offer, "offers")}" />
          </div>
        </div>

        <!-- title -->
        <div class="flex flex-1 items-center">
          <h2
            id="offer-title"
            class="text-gray-900 text-left font-semibold text-base pl-2"
          >
            ${offer.title}
          </h2>
        </div>

        <!-- offer valid -->
        <p
          class="text-left w-20 hidden sm:!flex justify-center items-center space-x-1 sm:text-xs sm:w-auto text-gray-500 break-words"
        >
          <span></span>
          <span> <i class="fa fa-calendar-o"></i> Offer valid till ${convertDateTime(
            offer.endTime
          )} </span>
        </p>
      </div>

      <!-- Second row -->
      <!-- description -->
      <p class="text-left sm:text-sm text-gray-500">
        ${offer.description}
      </p>

      <!-- Third row -->
      <!-- offer Code -->
      <div id="copy-text" class="flex justify-between pr-2 w-20 cursor-pointer">
        <h3 id="text"
          class="border-purple-300 border rounded-md text-xs p-2 bg-purple-50 border-dashed"
        >
          ${offer.code}
        </h3>
      </div>

      <p
          class="text-left sm:hidden justify-center items-center space-x-1 sm:text-xs sm:w-auto text-gray-500 break-words"
        >
          <span></span>
          <span> <i class="fa fa-calendar-o"></i> Offer valid till ${convertDateTime(
            offer.endTime
          )} </span>
        </p>
    </div>`;

      firstTab.appendChild(offerContainer);
    });
  }

  // Paylater Section //
  // Paylater mapping
  if (payLaters.length === 0) {
    const payLaterTab = document.getElementById("payLaterTab");
    payLaterTab.parentNode.style.display = "none";
  } else {
    const secondTab = document.getElementById("paylater-container");
    payLaters.map((payLater, idx) => {
      const payLaterContainer = document.createElement("div");
      payLaterContainer.innerHTML = `<div class="hidden md:flex md:flex-col mb-8 space-y-5 text-xs md:px-20">
  <table class="w-full table-fixed">
    <tbody>
      <tr>
        <td>
          <div
            class="flex items-center justify-start space-x-2"
          >
            <span class="hidden sm:block">
              <img width="32" src="${renderIcon(payLater, "payLater")}" />
            </span>
            <h3 class="text-left">${getBankDetails(payLater)[0].issuers}</h3>
          </div>
        </td>
  
        <td>
          <div class="flex justify-center items-center">
            <h3 class="text-center">${getBankDetails(payLater)[0].interest}</h3>
          </div>
        </td>
  
        <td>
          <div class="flex items-center justify-end">
            <h3>
              <span>
                ${getBankDetails(payLater)[0].creditPeriod}
                <span class="text-gray-500"
                  >Credit Period</span
                >
              </span>
            </h3>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  
  ${payLaters.length - 1 === idx ? "" : `<hr class="w-full"/>`}
  
  
  </div>
  
  <div class="md:hidden mt-2 flex-1 overflow-hidden overflow-y-scroll max-h-96 text-xs sm:text-base">
    <div class="flex flex-col md:hidden mb-8 space-y-5 bg-gray-50 p-5 rounded-md">
      <div class="flex flex-1 items-center">
      <img width="32" src="${renderIcon(payLater, "payLater")}" />

        <h2
          class="text-gray-900 text-left font-semibold text-base pl-2"
        >
        ${getBankDetails(payLater)[0].issuers}
        </h2>

      </div>

      <div class="flex justify-between text-base text-gray-800 w-full">
        <span>${getBankDetails(payLater)[0].interest}</span>
        <span>${getBankDetails(payLater)[0].creditPeriod} </span>
      </div>
    </div>
  </div>
  `;

      secondTab.appendChild(payLaterContainer);
    });
  }

  // EMI Section //
  // EMI - Left list mapping
  const handleClick = (planDiv, plan) => {
    // console.log("planDiv >> ", planDiv);
    // console.log("plan >> ", plan);

    const planContainer = document.querySelector("#emi-container-left");
    const planChildDivs = planContainer.querySelectorAll("div");

    for (let i = 0; i < planChildDivs.length; i++) {
      planChildDivs[i].classList.remove("bg-gray-100", "font-semibold");
    }

    planDiv.classList.add("bg-gray-100", "font-semibold");

    // Overwrite existing table content
    const newEmiRightDiv = document.getElementById("emi-container-right");

    // removing existing data from the table
    newEmiRightDiv.innerHTML = "";

    // adding new data in table
    plan.schemes.map((scheme) => {
      const tr = document.createElement("tr");
      tr.classList.add(
        "border-b",
        scheme.interest === 0 ? "bg-blue-50" : "bg-white"
      );

      tr.innerHTML = `<td
      class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
      ${scheme.months}
    </td>
    <td
      class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    ${scheme.interest}%
    </td>
    <td
      class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
      ₹${scheme.emiAmount.toLocaleString("en-US")}
    </td>
    <td
      class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
    >
    ₹${scheme.totalAmount.toLocaleString("en-US")}
    </td>`;

      newEmiRightDiv.appendChild(tr);
    });
  };

  // check if EMI exists
  if (amount <= 2500 || Object.keys(ccEMIPlans).length === 0) {
    const emiTab = document.getElementById("emiTab");
    emiTab.parentNode.style.display = "none";
  } else {
    const emiLeftDiv = document.getElementById("emi-container-left");
    ccEMIPlans.map((plan) => {
      const emiLeftContainer = document.createElement("div");

      emiLeftContainer.onclick = () => handleClick(emiLeftContainer, plan);

      emiLeftContainer.innerHTML = `<div
    class="md:!last:border-b-0 flex md:border-b p-5 justify-between px-2 cursor-pointer items-center hover:bg-gray-100"
  >
    <h2
      class="flex items-center justify-center space-x-2 text-xs text-left w-1/2"
    >
      <span class="text-xs">
        <img
          alt="icon"
          width="32"
          src=${renderIcon(plan, "emi")}
        />
        
      </span>
      <span>${getEMIBankDetails(plan)[0].issuers}</span>
    </h2>

    ${
      plan.isNoCostEmi
        ? `<span class="bg-blue-500 text-white text-xs mx-2 px-2.5 py-0.5 !uppercase rounded-lg items-end justify-end font-bold !text-[8px] !h-fit">
          No cost
        </span>`
        : ``
    }
  </div>`;

      emiLeftDiv.appendChild(emiLeftContainer);
    });

    // by Default 1st tab is highlighted
    emiLeftDiv
      .querySelectorAll("div")[0]
      .classList.add("bg-gray-100", "font-semibold");

    // EMI - right Table mapping
    const emiRightDiv = document.getElementById("emi-container-right");
    ccEMIPlans[0].schemes.map((scheme) => {
      const tr = document.createElement("tr");
      tr.classList.add(
        "border-b",
        scheme.interest === 0 ? "bg-blue-50" : "bg-white"
      );

      tr.innerHTML = `<td
    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
  >
    ${scheme.months}
  </td>
  <td
    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
  >
  ${scheme.interest}%
  </td>
  <td
    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
  >
    ₹${scheme.emiAmount.toLocaleString("en-US")}
  </td>
  <td
    class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
  >
  ₹${scheme.totalAmount.toLocaleString("en-US")}
  </td>`;

      emiRightDiv.appendChild(tr);
    });

    // EMI - Mobile View
    const emiMobileView = document.getElementById("emi-mobile-view");
    ccEMIPlans.map((emiPlan) => {
      // console.log("emiPlan >>> ", emiPlan);
      let emiRow = document.createElement("div");
      emiRow.innerHTML = `
    <details
          class="group flex flex-col p-5 justify-between px-2 cursor-pointer hover:bg-gray-100 !border-b"
        >
          <summary 
            class="flex justify-between rounded-lg px-4 py-2 text-left text-sm font-medium text-black focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 items-center"
          >
          <span class="mr-5"><img src="${renderIcon(emiPlan, "emi")}" /></span>
            <div class="flex-1"><span class="w-[50]">${
              getEMIBankDetails(emiPlan)[0].issuers
            }</span></div>
            ${
              emiPlan.isNoCostEmi
                ? `<span class="bg-blue-500 text-white text-xs mx-2 px-2.5 py-0.5 !uppercase rounded-lg items-end justify-end !text-[10px] !h-fit">
                  No cost
                </span>`
                : ``
            }
            <span class="transition group-open:rotate-180">
              <svg
                fill="none"
                height="24"
                shape-rendering="geometricPrecision"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          </summary>

          <!-- Table -->
          <div class="flex flex-col">
            <div class="overflow-x-auto">
              <div id="table-container" class="py-4 inline-block w-full">
                <table class="w-full md:min-w-full text-center">
                  <thead class="border-b bg-gray-200 text-xs">
                    <tr>
                      <th
                        scope="col"
                        class="md:text-sm font-medium text-black px-6 py-4 text-xs"
                      >
                        Months
                      </th>
                      <th
                        scope="col"
                        class="md:text-sm font-medium text-black px-6 py-4 text-xs"
                      >
                        Interest
                      </th>
                      <th
                        scope="col"
                        class="md:text-sm font-medium text-black px-6 py-4 text-xs"
                      >
                        Monthly EMI
                      </th>
                      <th
                        scope="col"
                        class="md:text-sm font-medium text-black px-6 py-4 text-xs"
                      >
                        Overall Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${emiPlan.schemes.map(
                      (planRow) =>
                        `<tr class="${
                          planRow.interest === 0 ? "bg-blue-50" : "bg-white"
                        } border-b">
                          <td class="px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                            ${planRow.months}
                          </td>
                          <td class="text-xs md:text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            ${planRow.interest}%
                          </td>
                          <td class="text-xs md:text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            ₹${planRow.emiAmount.toLocaleString("en-US")}
                          </td>
                          <td class="text-xs md:text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            ₹${planRow.totalAmount.toLocaleString("en-US")}
                          </td>
                      </tr>`
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </details>
    `;

      // To clean special chars
      emiRow = emiRow.innerHTML.replace(/,/g, "");

      const cleaned_emiRow = document.createElement("div");

      cleaned_emiRow.innerHTML = emiRow;
      emiMobileView.appendChild(cleaned_emiRow);
    });
  }

  // TABS Switch LOGIC //
  let tabsContainer = document.querySelector("#tabs");
  let tabTogglers = tabsContainer.querySelectorAll("a");
  tabTogglers.forEach(function (toggler) {
    toggler.addEventListener("click", function (e) {
      e.preventDefault();

      let tabName = this.getAttribute("href");

      let tabContents = document.querySelector("#tab-contents");

      for (let i = 0; i < tabContents.children.length; i++) {
        tabTogglers[i].parentElement.classList.remove(
          "relative",
          "text-blue-700",
          "-mb-px",
          "opacity-100",
          "border-b-2",
          "border-blue-700"
        );
        tabContents.children[i].classList.remove("hidden");
        if ("#" + tabContents.children[i].id === tabName) {
          continue;
        }
        tabContents.children[i].classList.add("hidden");
      }
      e.target.parentElement.classList.add(
        "relative",
        "text-blue-700",
        "-mb-px",
        "opacity-100",
        "border-b-2",
        "border-blue-700"
      );
    });
  });

  document.getElementById("default-tab").click();

  // to handle copy text
  // getting all copyTexts
  const copyTextsHTML = document.querySelectorAll("#copy-text");
  copyTextsHTML.forEach((copyTextHTML) => {
    copyTextHTML.onclick = function () {
      const copiedText = copyTextHTML.querySelector("#text").innerText;
      copyText(copyTextHTML.querySelector("#text"));

      copyTextHTML.querySelector("#text").innerText = "Copied!";
      const copiedHtml = copyTextHTML.querySelector("#text");

      copiedHtml.classList.remove("bg-purple-50");
      copiedHtml.classList.add("bg-purple-100", "border");

      setTimeout(() => {
        copyTextHTML.querySelector("#text").innerText = copiedText;
        copyTextHTML.querySelector("#text").classList.add("bg-purple-50");
        copyTextHTML.querySelector("#text").classList.remove("bg-purple-100");
      }, 500);
    };
  });
});

// to make funtion global
window.modalClose = modalClose;
