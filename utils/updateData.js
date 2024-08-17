const User =  require('../model/user')

const updateLocationAndAgeRange = async () => {
    // Define the bounds for India's latitude and longitude roughly
    const minLat = 6.5546079; // Southern tip
    const maxLat = 35.6745457; // Northern tip
    const minLon = 68.1113787; // Western tip
    const maxLon = 97.395561; // Eastern tip
  
    const randomLocationInIndia = () => [
      minLon + (Math.random() * (maxLon - minLon)), // Longitude
      minLat + (Math.random() * (maxLat - minLat))  // Latitude
    ];
  
    try {
        const result = await User.updateMany(
            {}, // No filter, update all documents
            [
              {
                $set: {
                  "location.coordinates": randomLocationInIndia()
                }
              },
              {
                $set: {
                  "preferences.ageRange.max": {
                    $cond: {
                      if: { $gt: ["$preferences.ageRange.max", "$preferences.ageRange.min"] },
                      then: "$preferences.ageRange.max",
                      else: { $add: ["$preferences.ageRange.min", 1] }
                    }
                  }
                }
              }
            ],
            { multi: true } // Apply to multiple documents
          );
      
          console.log(`Updated ${result.nModified} users`);
    } catch (error) {
      console.error('An error occurred while updating the users:', error);
    }
};

module.exports = { updateLocationAndAgeRange}