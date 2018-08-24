window.Utils = (function() {
    const DIGITS = 6;
    function numberToFixed (number) {
        return parseFloat(number.toFixed(DIGITS));
    }

    function arrayNumbersToFixed (array) {
        for (var i = 0; i < array.length; i++) {
            array[i] = numberToFixed(array[i]);
        }
        return array;
    }

    function getTooltips (controllerName) {
        var tooltips;
        var tooltipName;
        switch (controllerName) {
            case 'windows-motion-samsung-controls': {
                tooltipName = '.windows-motion-samsung-tooltips';
                break;
            }
            case 'windows-motion-controls': {
                tooltipName = '.windows-motion-tooltips';
                break;
            }
            case 'oculus-touch-controls': {
                tooltipName = '.oculus-tooltips';
                break;
            }
            case 'vive-controls': {
                tooltipName = '.vive-tooltips';
                break;
            }
            default: {
                break;
            }
        }

        tooltips = Array.prototype.slice.call(document.querySelectorAll(tooltipName));
        return tooltips;
    }

    return {
        numberToFixed: numberToFixed,
        arrayNumbersToFixed: arrayNumbersToFixed,
        getTooltips: getTooltips
    }
}());
