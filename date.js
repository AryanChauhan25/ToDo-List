
const listDate = () => {
    const today = new Date;
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("en-US", options);
}

const listDay = () => {
    const today = new Date;
    const options = {
        weekday: "long"
    };
    return today.toLocaleDateString("en-US", options);
}

module.exports.listdate = listDate;
module.exports.listday = listDay;

