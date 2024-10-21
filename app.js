// declaring the car class
class Car {
    constructor(licensePlate, year, maker, model, currentOwner, price, color) {
        this.licensePlate = licensePlate;
        this.year = year;
        this.maker = maker;
        this.model = model;
        this.currentOwner = currentOwner;
        this.price = price;
        this.color = color;
        this.discountedPrice = this.getDisPrice();
    }

    getDisPrice() {
        let currentYear = new Date().getFullYear();
        let age = currentYear - this.year;
        if (age > 10) {
            return this.price * 0.85; //after 15% discount
        }
        else {
            return "No discount";
        }
    }
}

//code for displaying message

const displayMessage = (message, type = "success") => {
    const messageElement = document.querySelector("#message");
    messageElement.textContent = message;
    messageElement.className = type;
    setTimeout(() => {
        messageElement.textContent = "";
        messageElement.className = "";
    }, 3000);
};

// declaring the array
let cars = []

const form = document.getElementById('car-form');

// function to update info and generate table
function updateInfo(event) {
    event.preventDefault();

    try {
        let licensePlate = document.querySelector('#licensePlate').value
        let year = document.querySelector('#year').value
        let maker = document.querySelector('#maker').value
        let model = document.querySelector('#model').value
        let currentOwner = document.querySelector('#currentOwner').value
        let price = document.querySelector('#price').value
        let color = document.querySelector('#color').value

        // Check if license plate is in the correct format
        if (!/^[a-zA-Z]{3}-\d{3}$/.test(licensePlate)) {
            throw new Error("licenseplate must be valid.")
        }

        // Check if year is a number between 1886 and current year
        if (!/^\d+$/.test(year) || parseInt(year) < 1886 || parseInt(year) > new Date().getFullYear()) {
            throw new Error('Year must be a number between 1886 and ' + new Date().getFullYear() + '!')
        }

        // Check if price is a positive number
        if (price <= 0) {
            throw new Error("price must be a positive number.")
        }

        // Creating a new Car object and add it to the array
        let newCar = new Car(licensePlate, year, maker, model, currentOwner, price, color);
        cars.push(newCar);

        localStorage.setItem('cars', JSON.stringify(cars));

        // Clearing the form fields
        document.querySelector("#car-form").reset();

        // generating the table
        generateTable();
        displayMessage("Car added successfully!");

        document.querySelector('.table-container').style.display = 'block';
    } catch (error) {
        displayMessage(error.message, "error");
    }

}

const loadCarsFromLocalStorage = () => {
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
        const parsedCars = JSON.parse(storedCars);
        parsedCars.forEach(carData => {
            cars.push(new Car(carData.licensePlate, carData.year, carData.maker, carData.model, carData.currentOwner, carData.price, carData.color));
        });
        generateTable();
    }
};

// Function to generate the table for all cars
function generateTable() {
    const table = document.querySelector("#car-table");
    // Clearing the table first
    table.innerHTML = '';
    // Creating the table header
    let headerRow = table.insertRow();
    let headers = ["License Plate", "Year", "Maker", "Model", "Current Owner", "Price(€)", "Discounted Price(€)", "Color", ""];
    headers.forEach((header) => {
        let th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    // Creating the table rows
    cars.forEach((car) => {
        let row = table.insertRow();
        let cells = [car.licensePlate, car.year, car.maker, car.model, car.currentOwner, car.price, car.discountedPrice, car.color];
        cells.forEach((cell) => {
            let td = document.createElement("td");
            td.textContent = cell;
            row.appendChild(td);
        });
        // Creating a delete button
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            // Finding the index of the car to delete
            let index = cars.findIndex(c => c.licensePlate === car.licensePlate);
            // Remove the car from the array
            cars.splice(index, 1);
            // Updating local storage
            localStorage.setItem('cars', JSON.stringify(cars));
            // Regenerating the table
            generateTable();
            displayMessage("Car deleted successfully")
        };
        let td = document.createElement("td");
        td.appendChild(deleteButton);
        row.appendChild(td);
    });
    document.querySelector('.table-container').style.display = 'block';
}

// Add event listener to the form
form.addEventListener('submit', updateInfo);

const search_button = document.querySelector('#search-button')
const result = document.querySelector('#result')

// function to search the car
function searchCar() {
    let carFound = false;
    const search_box = document.querySelector('#search-box').value;

    try {
        if (!/^[a-zA-Z]{3}-\d{3}$/.test(search_box)) {
            throw new Error('Please input right format')
        }
    } catch (error) {
        result.textContent = error.message
        document.querySelector('.search-result').style.display = 'block';
        result.style.color = 'red'
        return
    }


    for (let i = 0; i < cars.length; i++) {
        if (cars[i].licensePlate == search_box) {
            let priceText = cars[i].discountedPrice;
            if (priceText == "No discount") {
                priceText = cars[i].price;
            }
            result.innerHTML = /* `licensePlate = ${cars[i].licensePlate}\n
            maker = ${cars[i].maker}\n
            model = ${cars[i].model}\n
            currentOwner = ${cars[i].currentOwner}\n
            ${priceText}, color = ${cars[i].color}` */

                `
            <p>Maker: ${cars[i].maker}</p>
            <p>Model: ${cars[i].model}</p>
            <p>Owner: ${cars[i].currentOwner}</p>
            <p>Year: ${cars[i].year}</p>
            <p>Price: ${priceText}€</p>
            
            <p>Color: ${cars[i].color}</p>
            `;
            carFound = true;
            break;
        }
    }
    if (carFound == false) {
        result.textContent = `Oops!! No car found. You can try again :)`
        result.style.color = 'red'
    }

    document.querySelector('.search-result').style.display = 'block';

}

search_button.addEventListener('click', searchCar)
window.addEventListener('load', loadCarsFromLocalStorage);