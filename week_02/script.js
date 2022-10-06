let num = 200; //integer

/*
Block comment
*/

// function foo() {
//     console.log(num);
// };

// foo();

// foo();


// anonymous functions

let anonFun = function(){
    console.log("hello");
};

//IIFy - Immediately Invoked function - Runs function at the same time
(function(){
    console.log("Hello");
})();

(() => console.log(100))();

// function foo() {
//     console.log(num);
// };

let foo = ()=> console.log(num);

let bar = 100;
bar = 200;

let arr = ["foo", bar, ["zar", "car"]];

console.log(arr[1])

// Set an item in array
arr[1]= "barbar"
console.log(arr[1])

//add item to end of array

arr.push("par");

// Removing an item from the array (index, deleted)
arr.splice(2,1)

console.log(arr)


// New array

let newArr = ["cow", "turtle", "goat"];

for (let item of newArr) {
    console.log(item)
}

for (let i in newArr) {
    console.log(i + " " + newArr[i])
}

newArr.forEach((item, i) => console.log(i + " " + item))


//Objects
// Java Script Object Notation

let obj1 = {
    name: "Jill",
    age: 85,
    job: "Cactus Hunter"
};

obj1.job = "Barista"
//Access property

console.log(obj1.name)
console.log(obj1["name"])

//loop through all properties

for(let key in obj1){
    let value = obj1[key];
console.log(`This pair is ${key}: ${value}`);
}


// Regular loop

for (let i = 0; i < 10; i++) {
    console.log(i)
}

// Conditionals

let val = 80;

if (val > 80) {
    console.log("good")
} else if (val > 50) {
    console.log("okay") 
} else {
    console.log("terrible")
}

//Terniary 
let y = (val >= 80) ? console.log("good") : console.log("not good");

let newVar = document.getElementById("example")

newVar.innerHTML += "Hello world!"