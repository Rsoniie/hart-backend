const { faker } = require('@faker-js/faker');


const User =  require('../model/user')

const generateUsers = (numUsers) => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        users.push({
            firebaseUid: faker.string.uuid(),
            userId: i,
            phone: faker.phone.number(),
            name: faker.person.fullName(),
            dateOfBirth: faker.date.past(30, '2008-01-01').getFullYear(),
            gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),
            height: faker.helpers.arrayElement(["5ft", "6ft", "5ft5", "6ft2"]),
            interests: faker.helpers.arrayElements(["Reading", "Hiking", "Cooking", "Traveling", "Swimming"], 2),
            location: {
                type: 'Point',
                coordinates: [faker.location.longitude(), faker.location.latitude()],
            },
            altitude: faker.number.int({ min: 0, max: 1000 }),
            accuracy: faker.number.int({ min: 1, max: 100 }),
            bio: faker.lorem.sentence(),
            profilePictures: [{ imageUrl: faker.image.url() }],
            lookingFor: faker.helpers.arrayElement(["Friendship", "Relationship", "Networking"]),
            preferences: { 
                ageRange: { min: faker.number.int({ min: 18, max: 25 }), max: faker.number.int({min: 19, max: 40}) }, 
                distance: faker.number.int({min: 1, max: 100})
            },
            interestedIn: faker.helpers.arrayElement(["Male", "Female", "Binary", 'Other', 'Gay', 'Lesbian']),
            // prompts: {
            //     "Personal": {"Doing this makes me happy": faker.lorem.sentence()},
            //     // Add more prompts as needed
            // },
            hasCompletedOnboarding: faker.datatype.boolean()
        });
    }
    return users;
};

module.exports = { generateUsers };


const usersToInsert = generateUsers(1000); // Generate 100 random users

User.insertMany(usersToInsert)
    .then(() => console.log('Random users inserted'))
    .catch(error => console.error('Error inserting random users:', error));