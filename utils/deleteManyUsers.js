const User =  require('../model/user')


async function deleteAllUsers() {
    try {
      await User.deleteMany({});
      console.log("All users deleted successfully");
    } catch (err) {
      console.log(err);
    }
  }
  
module.exports = { deleteAllUsers };