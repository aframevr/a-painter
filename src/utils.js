window.Utils = function() {
    const DIGITS = 6;
    function numberToFixed (number) {
        return parseFloat(number.toFixed(DIGITS));
    }

    function arrayNumbersToFixed (array) {
        for (var i = 0; i < array.length; i++) {
            array[i] = numberToFixed(array[i]);
        }
        return this;
    }

    return {
        numberToFixed: numberToFixed,
        arrayNumbersToFixed: arrayNumbersToFixed
    }
}