// Abdul Hannan — Liquid Glass Portfolio
// Live Faisalabad clock, copy roll number, scroll reveal, card tilt + shine, bubbles.

(function () {
  "use strict";

  // Live clock — Asia/Karachi (Faisalabad)
  var clockEl = document.getElementById("liveClock");
  var dateEl = document.getElementById("liveDate");

  var timeFmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  var dateFmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  function tickClock() {
    var now = new Date();
    if (clockEl) clockEl.textContent = timeFmt.format(now);
    if (dateEl) dateEl.textContent = dateFmt.format(now);
  }
  tickClock();
  setInterval(tickClock, 1000);

  // Copy roll number
  var copyBtn = document.getElementById("copyRollBtn");
  var copyLabel = document.getElementById("copyLabel");
  var rollNo = document.getElementById("rollNo");

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(ta);
  }

  if (copyBtn && rollNo) {
    copyBtn.addEventListener("click", function () {
      var text = rollNo.textContent.trim();
      var done = function () {
        copyBtn.classList.add("copied");
        if (copyLabel) copyLabel.textContent = "Copied";
        setTimeout(function () {
          copyBtn.classList.remove("copied");
          if (copyLabel) copyLabel.textContent = "Copy";
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text);
          done();
        });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Card tilt + cursor shine (pointer devices only)
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  if (finePointer) {
    var cards = document.querySelectorAll(".card.tilt");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rx = ((y / rect.height) - 0.5) * -7;
        var ry = ((x / rect.width) - 0.5) * 7;
        card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  // Rising bubbles
  var bubblesWrap = document.getElementById("bubbles");
  if (bubblesWrap) {
    var COUNT = 22;
    for (var i = 0; i < COUNT; i++) {
      var b = document.createElement("span");
      b.className = "bubble";
      var size = (4 + Math.random() * 22).toFixed(0);
      b.style.width = size + "px";
      b.style.height = size + "px";
      b.style.left = (Math.random() * 100).toFixed(2) + "%";
      b.style.animationDuration = (9 + Math.random() * 14).toFixed(1) + "s";
      b.style.animationDelay = (-Math.random() * 22).toFixed(1) + "s";
      bubblesWrap.appendChild(b);
    }
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
