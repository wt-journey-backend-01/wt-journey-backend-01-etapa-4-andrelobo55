import { parse, isValid, format } from 'date-fns';

function isValidDate(dataString) {
    const parsed = parse(dataString, 'yyyy-MM-dd', new Date());
    const actualDate = new Date();
    return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === dataString && parsed.getTime() < actualDate.getTime();
}

// console.log(validarData("2025-02-30"));
module.exports = isValidDate;