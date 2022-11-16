export function mysqlDatetimeToString(date) {
    var t = date.split(/[- :T.]/);
    var d = new Date(Date.UTC(t[0], t[1], t[2], t[3], t[4], t[5]));

    return `${d.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }/${d.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }/${d.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            } ${d.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }:${d.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
}

export function mysqlDatetimeToStringDate(date) {
    var t = date.split(/[- :T.]/);
    var d = new Date(Date.UTC(t[0], t[1], t[2], t[3], t[4], t[5]));

    return `${d.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }/${d.getMonth().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }/${d.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
}