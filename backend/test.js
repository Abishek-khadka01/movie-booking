// Get today's date and set the time to 00:00 (midnight)
const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);
console.log("Today's Date at 00:00 (Midnight):", todayDate);


addDateMinutes = 80
// Create a new Date object for tomorrow
let tommorowDate = new Date(todayDate); // Clone todayDate to create a new Date object
tommorowDate.setDate(todayDate.getDate() + 80*60*1000); // Set to tomorrow
 // Set to 00:00:00.000

console.log(`Tomorrow's Date at 00:00 (Midnight): ${tommorowDate}`);