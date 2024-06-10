import { GuestManager } from "./GuestManager.js";

document.addEventListener("DOMContentLoaded", loadBookings);

const form = document.getElementById("guestRegistration");

form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const fieldsAreFilled = validatedFields(form);

    if (fieldsAreFilled.length === 0) {
        const guestData = {
            name: form.get("name"),
            lname: form.get("lname"),
            tel: form.get("tel"),
            email: form.get("email"),
            bookedDays: form.get("bookedDays").toLowerCase(),
            room: form.get("room"),
            finalPrice: 0,
        };
        const finalPrice = getFinalPrice(guestData.bookedDays, guestData.room);
        guestData.finalPrice = finalPrice;
        GuestManager.addBooking(guestData);
        showGuestBookData(guestData);
    } else {
        showError(fieldsAreFilled);
    }
}

function showError(errors) {

    const errorContainer = document.createElement('div');
    errorContainer.setAttribute('id', 'error_container');
    form.appendChild(errorContainer);

    errors.forEach(e => {
        const error = document.createElement("p");
        error.textContent = e; 
        errorContainer.appendChild(error);
    });

}

async function loadBookings() {
    GuestManager.getAllBookings().then((bookings) => {
        bookings.forEach((guest) => {
            showGuestBookData(guest);
        });
    })

}

function showGuestBookData(guestData) {
    const table = document.getElementById("guestTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const nameCell = newRow.insertCell(0);
    const lnameCell = newRow.insertCell(1);
    const telCell = newRow.insertCell(2);
    const emailCell = newRow.insertCell(3);
    const bookedDaysCell = newRow.insertCell(4);
    const roomCell = newRow.insertCell(5);
    const finalPriceCell = newRow.insertCell(6);

    nameCell.textContent = guestData.name;
    lnameCell.textContent = guestData.lname;
    telCell.textContent = guestData.tel;
    emailCell.textContent = guestData.email;
    bookedDaysCell.textContent = guestData.bookedDays;
    roomCell.textContent = guestData.room;
    finalPriceCell.textContent = `$ ${guestData.finalPrice}`;
}

function getFinalPrice(bookedDays, room) {
    const prices = {
        individual: 50,
        doble: 90,
        suite: 150,
    };

    const nightPrice = prices[room];
    return nightPrice * bookedDays;
}

function validatedFields(form) {
    const error = [];

    form.entries().forEach(([fieldName, fieldValue]) => {
        if (!fieldValue) {
            error.push(`El campo ${fieldName} no puede estar vacío.`);
        }
    });

    const fieldsWOnlyNumbers = ["tel", "bookedDays"];
    fieldsWOnlyNumbers.forEach(field => {
        const fieldValue = form.get(field);
        if (fieldValue && isNaN(fieldValue)) {
            error.push(`El campo ${field} debe contener solo números.`);
        }
    });
    console.log('error', error);
    return error;
}