/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-10-29 13:01:42
 * @version $Id$
 */

var data = ['a', 'b', 'c'];

var data = ['a', 'b'];

var data = ['a', 'b', 'c', 'd'];

var currentCount = 0,
    currentCountIncrease = currentCount + 1,
    currentCountDecrease = data.length - 1;

console.log(currentCountDecrease, currentCount, currentCountIncrease);
console.log(data[currentCountDecrease], data[currentCount], data[currentCountIncrease]);

function updateCounter(type) {
    if (type === '+') {
        currentCount++;
        if (currentCount > data.length - 1) {
            currentCount = 0;
        }
    } else {
        currentCount--;
        if (currentCount < 0) {
            currentCount = data.length - 1;
        }
    }
    currentCountIncrease = currentCount + 1;
    currentCountDecrease = currentCount - 1;
    if (currentCountIncrease > data.length - 1) {
        currentCountIncrease = 0;
    }
    if (currentCountDecrease < 0) {
        currentCountDecrease = data.length - 1;
    }
    console.log(currentCountDecrease, currentCount, currentCountIncrease);
    console.log(data[currentCountDecrease], data[currentCount], data[currentCountIncrease]);
}

updateCounter('+');
updateCounter('+');
updateCounter('+');
updateCounter('+');
updateCounter('+');
updateCounter('+');
updateCounter('+');
updateCounter('+');
console.log('--------------');
updateCounter('-');
updateCounter('-');
updateCounter('-');
updateCounter('-');
updateCounter('-');
updateCounter('-');
updateCounter('-');
updateCounter('-');
