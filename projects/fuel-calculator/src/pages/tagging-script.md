---
title: The calculator tracking
layout: ../layouts/Layout.astro
---

#Tagging script for calc

## The script

```js
(function () {
  var calcBtn  = document.getElementById('calcBtn');
  var destFrom = document.getElementById('destFrom');
  var destTo   = document.getElementById('destTo');

  destFrom.addEventListener('change', function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'click',
      action: 'destination_from',
      city: destFrom.options[destFrom.selectedIndex].textContent.trim(),
    });
  });

  destTo.addEventListener('change', function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'click',
      action: 'destination_to',
      city: destTo.options[destTo.selectedIndex].textContent.trim(),
    });
  });

  document.getElementById('carGrid').addEventListener('click', function (e) {
    var opt = e.target.closest('.car-option');
    if (!opt) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'click',
      action: 'vehicle_selected',
      vehicle: opt.querySelector('.car-name').textContent.trim(),
    });
  });

  calcBtn.addEventListener('click', function () {
   var tripType = document.querySelector('input[name="trip-type"]:checked').value;
    var fuelPrice = document.getElementById('fuelPrice').value;
    var selectedVehicle = document.querySelector('.car-option.selected .car-name').textContent.trim();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'click',
      action: 'calculate',
      link_detail: destFrom.options[destFrom.selectedIndex].textContent.trim() + ' to ' + destTo.options[destTo.selectedIndex].textContent.trim() + ' | ' + selectedVehicle + ' | ' + fuelPrice + ' | ' + tripType,
    });
  });
})();
```

**1. The IIFE wrapper**
```js
(function () {
  ...
})();
```
Immediately Invoked Function Expression. Everything inside runs once on page load and is scoped privately — variables like `calcBtn` and `destFrom` don't leak into the global window scope.

---

**2. Element references**
```js
var calcBtn  = document.getElementById('calcBtn');
var destFrom = document.getElementById('destFrom');
var destTo   = document.getElementById('destTo');
```
Grabs the three main interactive elements once at the top and stores them in variables so they don't need to be looked up repeatedly on every event.

---

**3. Origin dropdown tracking**
```js
destFrom.addEventListener('change', function () {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'click',
    action: 'destination_from',
    city: destFrom.options[destFrom.selectedIndex].textContent.trim(),
  });
});
```
Fires when the user picks a departure city. `destFrom.options[destFrom.selectedIndex].textContent.trim()` gets the visible label of the selected option (e.g. `"Alice Springs"`). Pushes to dataLayer with action `destination_from`.

---

**4. Destination dropdown tracking**
```js
destTo.addEventListener('change', function () {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'click',
    action: 'destination_to',
    city: destTo.options[destTo.selectedIndex].textContent.trim(),
  });
});
```
Same pattern as above but for the arrival city. Fires on change with action `destination_to`.

---

**5. Vehicle selection tracking**
```js
document.getElementById('carGrid').addEventListener('click', function (e) {
  var opt = e.target.closest('.car-option');
  if (!opt) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'click',
    action: 'vehicle_selected',
    vehicle: opt.querySelector('.car-name').textContent.trim(),
  });
});
```
Instead of adding a listener to each car card individually, it uses **event delegation** — one listener on the parent `#carGrid` catches all clicks inside it. `e.target.closest('.car-option')` walks up the DOM from whatever was clicked to find the car card. The `if (!opt) return` guard exits early if the click landed on empty space between cards rather than a card itself.

---

**6. Calculate button tracking**
```js
calcBtn.addEventListener('click', function () {
  var tripType = document.querySelector('input[name="trip-type"]:checked').value;
  var fuelPrice = document.getElementById('fuelPrice').value;
  var selectedVehicle = document.querySelector('.car-option.selected .car-name').textContent.trim();
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'click',
    action: 'calculate',
    link_detail: destFrom.options[destFrom.selectedIndex].textContent.trim() + ' to ' + destTo.options[destTo.selectedIndex].textContent.trim() + ' | ' + selectedVehicle + ' | ' + fuelPrice + ' | ' + tripType,
  });
});
```
Fires when the user hits Calculate. Collects four values at the moment of click — trip type from the checked radio button, fuel price from the input field, selected vehicle from the `.selected` car card, and both destinations from the dropdowns. Assembles them into a single pipe-separated `link_detail` string like `"Alice Springs to Darwin | 4WD + caravan | 2.30 | return"` and pushes to dataLayer.

---

**Key pattern throughout:** `window.dataLayer = window.dataLayer || []` appears before every push as a safety check — it creates the array if it doesn't exist yet, preventing errors if the script runs before Zaraz/GTM initialises.

##Zaraz Debug will look like this

**__enrichPayload**	none

**conversion**	true

**en**	calculate

**link_detail**	Hobart to Darwin | 4WD + caravan | 2.5 | return

**name**	calculate
