const getTodayAndTomorrowsDate = (dateData) => {
    const date = new Date(dateData)
    // Extract the year, month, and day from today's date
    let todayYear = date.getFullYear();
    let todayMonth = date.getMonth() + 1; // Adding 1 because months are zero-indexed
    let todayDay = date.getDate();

    const todayDate = todayYear + ", " + todayMonth + ", " + todayDay;

    // Get tomorrow's date
    let tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);

    // Extract the year, month, and day from tomorrow's date
    let tomorrowYear = tomorrow.getFullYear();
    let tomorrowMonth = tomorrow.getMonth() + 1; // Adding 1 because months are zero-indexed
    let tomorrowDay = tomorrow.getDate();

    const tomorrowDate = tomorrowYear + ", " + tomorrowMonth + ", " + tomorrowDay;

    return { todayDate, tomorrowDate }
}

const today = () => {
    // Get today's date
    let today = new Date();

    let todayYear = today.getFullYear();
    let todayMonth = today.getMonth() + 1; // Adding 1 because months are zero-indexed
    let todayDay = today.getDate();
    
    const todayDate = todayYear + "-" + todayMonth + "-" + todayDay;
    // Get tomorrow's date
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Extract the year, month, and day from tomorrow's date
    let tomorrowYear = tomorrow.getFullYear();
    let tomorrowMonth = tomorrow.getMonth() + 1; // Adding 1 because months are zero-indexed
    let tomorrowDay = tomorrow.getDate();

   const tomorrowDate = tomorrowYear + "-" + tomorrowMonth + "-" + tomorrowDay;
   return {
    todayDate,
    tomorrowDate
   }
}
module.exports = {
    getTodayAndTomorrowsDate,
    today
}
