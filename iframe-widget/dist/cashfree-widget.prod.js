(() => {
  let e,
    t = !1;
  window.addEventListener("load", function () {
    if (t) return;
    const a = document.getElementById("cashfree-widget");
    if (!a) return;
    const s = document.getElementById("cf-iframe");
    s && s.parentElement.removeChild(s);
    const n = document.createElement("iframe");
    (("no" === a.dataset.isoffers &&
      "no" === a.dataset.ispaylater &&
      "no" === a.dataset.isemi) ||
      !a.dataset.amount ||
      "" === a.dataset.amount ||
      a.dataset.appid.includes("data") ||
      "" === a.dataset.appid) &&
      (n.style.display = "none"),
      (n.src = "https://js-widget-frame.cashfree.com/"),
      (n.id = "cf-iframe"),
      (n.loading = "eager"),
      (n.style.width = "100%"),
      (n.style.height = "100%"),
      (n.style.border = "none"),
      (n.onload = async () => {
        (e = await (async () => {
          if (
            ("no" === a.dataset.isoffers &&
              "no" === a.dataset.ispaylater &&
              "no" === a.dataset.isemi) ||
            !a.dataset.amount ||
            "" === a.dataset.amount ||
            a.dataset.appid.includes("data") ||
            "" === a.dataset.appid
          )
            return;
          const e = await fetch(
            `https://receiver.cashfree.com/pgnextgenconsumer/uiapi/external/merchants/offers?appId=${a.dataset.appid}&amount=${a.dataset.amount}`,
            {
              method: "POST",
              body: JSON.stringify({
                isOffer: "yes" === a.dataset.isoffers,
                isPayLater: "yes" === a.dataset.ispaylater,
                isEMIPlans:
                  a.dataset.amount > 2500 && "yes" === a.dataset.isemi,
              }),
              headers: { "Content-type": "application/json" },
            }
          );
          return await e.json();
        })()),
          (e.statusCode ||
            (0 === e.offerDetails.offers.length &&
              0 === e.payLaters.length &&
              0 === e.emiDetails.ccEMIPlans.length &&
              0 === e.emiDetails.dcEMIPlans.length)) &&
            (n.style.display = "none"),
          n.contentWindow.postMessage(
            {
              frameDataObj: e,
              amount: a.dataset.amount,
              appId: a.dataset.appid,
            },
            "https://js-widget-frame.cashfree.com/"
          );
      }),
      a.appendChild(n);
    const o = document.getElementById("cf-iframe-details");
    o && o.parentElement.removeChild(o);
    const d = document.createElement("iframe");
    (d.src = "https://js-widget-detailframe.cashfree.com/"),
      (d.id = "cf-iframe-details"),
      (d.loading = "eager"),
      (d.style.width = "100%"),
      (d.style.height = "100vh"),
      (d.style.border = "none"),
      (d.style.zIndex = "99999"),
      (d.style.position = "fixed"),
      (d.style.top = "0px"),
      (d.style.left = "0px"),
      (d.style.display = "none"),
      a.appendChild(d),
      (window.onmessage = function (t) {
        t.data.isModelOpen &&
          ((d.style.display = "block"),
          (document.body.style.overflow = "hidden"),
          (d.onload = () => {
            d.contentWindow.postMessage(
              {
                opentab: t.data.opentab,
                amount: a.dataset.amount,
                frameDataObj: e,
              },
              "https://js-widget-detailframe.cashfree.com/"
            );
          }),
          a.appendChild(d)),
          t.data.isModelClose &&
            ((document.getElementById("cf-iframe-details").style.display =
              "none"),
            (document.body.style.overflow = "auto"));
      });
  }),
    (window.CF_Widget = function ({
      clientID: a,
      amount: s,
      offers: n,
      payLater: o,
      emi: d,
    }) {
      t = !0;
      let i = !1;
      return {
        load: function () {
          if (i) return;
          i = !0;
          const t = document.getElementById("cashfree-widget");
          if (!t) return;
          const l = document.getElementById("cf-iframe");
          l && l.parentElement.removeChild(l);
          const r = document.createElement("iframe");
          (("false" !== n || "false" !== o || "false" !== d) &&
            s &&
            "" !== s &&
            a &&
            "" !== a) ||
            (r.style.display = "none"),
            (r.src = "https://js-widget-frame.cashfree.com/"),
            (r.id = "cf-iframe"),
            (r.style.width = "100%"),
            (r.style.height = "100%"),
            (r.style.border = "none"),
            (r.loading = "eager"),
            (r.onload = async () => {
              (e = await (async () => {
                if (
                  ("false" === n && "false" === o && "false" === d) ||
                  !s ||
                  "" === s ||
                  !a ||
                  "" === a
                )
                  return;
                const e = await fetch(
                  `https://receiver.cashfree.com/pgnextgenconsumer/uiapi/external/merchants/offers?appId=${a}&amount=${s}`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      isOffer: "true" === n,
                      isPayLater: "true" === o,
                      isEMIPlans: s > 2500 && "true" === d,
                    }),
                    headers: { "Content-type": "application/json" },
                  }
                );
                return await e.json();
              })()),
                (e.statusCode ||
                  (0 === e.offerDetails.offers.length &&
                    0 === e.payLaters.length &&
                    0 === e.emiDetails.ccEMIPlans.length &&
                    0 === e.emiDetails.dcEMIPlans.length)) &&
                  (r.style.display = "none"),
                r.contentWindow.postMessage(
                  { frameDataObj: e, amount: s, appId: a },
                  "https://js-widget-frame.cashfree.com/"
                );
            }),
            t.appendChild(r);
          const m = document.getElementById("cf-iframe-details");
          m && m.parentElement.removeChild(m);
          const c = document.createElement("iframe");
          (c.src = "https://js-widget-detailframe.cashfree.com/"),
            (c.id = "cf-iframe-details"),
            (c.loading = "eager"),
            (c.style.width = "100%"),
            (c.style.height = "100vh"),
            (c.style.border = "none"),
            (c.style.zIndex = "99999"),
            (c.style.position = "fixed"),
            (c.style.top = "0px"),
            (c.style.left = "0px"),
            (c.style.display = "none"),
            t.appendChild(c),
            (window.onmessage = function (a) {
              a.data.isModelOpen &&
                ((c.style.display = "block"),
                (document.body.style.overflow = "hidden"),
                (c.onload = () => {
                  c.contentWindow.postMessage(
                    { opentab: a.data.opentab, amount: s, frameDataObj: e },
                    "https://js-widget-detailframe.cashfree.com/"
                  );
                }),
                t.appendChild(c)),
                a.data.isModelClose &&
                  ((document.getElementById("cf-iframe-details").style.display =
                    "none"),
                  (document.body.style.overflow = "auto"));
            });
        },
      };
    });
})();
