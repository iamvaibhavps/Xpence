// const UserInfo = require("../models/UserInfo");


// async function getPhoneNumbers(userId) {
//     try {
//         const user = await UserInfo.findOne({ user: userId });
//         if (!user) {
//             throw new Error('User not found');
//         }
//         // console.log('user: ', user?.whatsapp);

//         return {
//             primary: user?.whatsapp || '',
//             secondary: user?.secondaryContactNumber || '',
//         };
//     } catch (error) {
//         console.error('Error fetching phone numbers:', error);
//         throw error;
//     }
// }


// async function updatePhoneNumbers(userId, newNumbers) {
//     try {
//         const user = await UserInfo.findOne({ user: userId });
//         if (!user) {
//             throw new Error('User not found');
//         }

//         user.whatsapp = newNumbers.primary || user.whatsapp;
//         user.secondaryContactNumber = newNumbers.secondary || user.secondaryContactNumber;

//         await user.save();
//         return {
//             primary: user.whatsapp,
//             secondary: user.secondaryContactNumber,
//         };
//     } catch (error) {
//         console.error('Error updating phone numbers:', error);
//         throw error;
//     }
// }

// module.exports = {
//     getPhoneNumbers,
//     updatePhoneNumbers,
// };