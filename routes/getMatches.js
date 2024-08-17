const express = require('express');
const User = require('../model/user');
const router = express.Router();
const Action = require('../model/userAction')
const filterNonEmptyValues = require('../utils/filterPrompts')


router.get('/:firebaseUid', async (req, res) => {
    const { firebaseUid } = req.params;
    //console.log(res)

    if (!firebaseUid) {
        return res.status(400).send({ message: 'firebaseUid is required' });
    }

    try {
        // Find the user and their preferences
        const user = await User.findOne({ firebaseUid });
        const actions = await Action.find({ firebaseUid, actionType: { $in: ['remove', 'report'] } });
        console.log(actions)
        const excludedFirebaseUids = actions.map(action => action.targetFirebaseUid);
        console.log(excludedFirebaseUids)


        
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        

        const currentYear = new Date().getFullYear();
        let allMatches = [];
        const targetNumberOfMatches = 25;
        let queriesToRun = [];


        if (user?.preferences && user?.preferences?.ageRange.min && user?.preferences?.ageRange.max && typeof user?.preferences?.distance === 'number'){
            const fromBirthYear = currentYear - user.preferences.ageRange.max;
            const toBirthYear = currentYear - user.preferences.ageRange.min;
            const maxDistance = user.preferences.distance * 1000;
            const preferredQuery = {
                _id: { $ne: user._id }, 
                gender: user.interestedIn,
                dateOfBirth: {
                    $gte: fromBirthYear,
                    $lte: toBirthYear
                },
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: user.location.coordinates },
                        $maxDistance: maxDistance
                    }
                },
                firebaseUid: { $nin: excludedFirebaseUids }
            };

            queriesToRun.push(User.find(preferredQuery));

        }

        // Prepare a query based on age preference if it exists
        if (user?.preferences && user?.preferences?.ageRange && user?.preferences?.ageRange.min && user?.preferences?.ageRange.max) {

            const fromBirthYear = currentYear - user?.preferences?.ageRange?.max;
            const toBirthYear = currentYear - user?.preferences?.ageRange?.min;

            const ageQuery = {
                _id: { $ne: user._id },
                gender: user.interestedIn,
                dateOfBirth: { $gte: fromBirthYear, $lte: toBirthYear },
                _id: { $nin: allMatches.map(match => match._id) },
                firebaseUid: { $nin: excludedFirebaseUids }

            };
            queriesToRun.push(User.find(ageQuery));
        }

        // Prepare a query based on location preference if it exists
        if (user?.preferences && typeof user?.preferences?.distance === 'number') {

            const maxDistance = user.preferences.distance * 1000; // Convert km to meters

            const locationQuery = {
                _id: { $ne: user._id },
                gender: user.interestedIn,
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: user.location.coordinates },
                        $maxDistance: maxDistance
                    }
                },
                _id: { $nin: allMatches.map(match => match._id) },
                firebaseUid: { $nin: excludedFirebaseUids }

            };
            queriesToRun.push(User.find(locationQuery));
        }

        // Prepare a query based on 'interestedIn' preference if no other preferences exist
        if (queriesToRun.length === 0) {

            const interestedInQuery = {
                _id: { $ne: user._id },
                gender: user.interestedIn,
                _id: { $nin: allMatches.map(match => match._id) },
                firebaseUid: { $nin: excludedFirebaseUids }

            };
            queriesToRun.push(User.find(interestedInQuery));
        }

        // Execute all prepared queries
        for (let query of queriesToRun) {
            const results = await query.limit(targetNumberOfMatches - allMatches.length);
            allMatches.push(...results);
            if (allMatches.length >= targetNumberOfMatches) break; // Stop if we have enough matches
        }

        const results = allMatches.slice(0, targetNumberOfMatches)

        const matchesToSend = results.map(user => {
            const filledPrompts = filterNonEmptyValues(user.prompts)
            
            const matchWithFilledPrompts = {
                ...user.toObject(), 
                prompts: filledPrompts,
            };
            return matchWithFilledPrompts
        })

        if (matchesToSend.length === 0){
            return res.status(200).send({message: 'No Matches found', matches: matchesToSend})
        } else {
            return res.status(200).send({message: 'Matches found', matches: matchesToSend})
        }
        
        // Return up to 25 matches
        //return res.status(200).send({message: 'Error fetching matches', matches: matchesToSend});

        //res.status(200).send(matches);

        //console.log(preferredMatches, ageBasedMatches, locationBasedMatches)

        // Add more filters based on other preferences

       // Execute the query to find potential matches
       //const matches = await User.find(query); // Limit the number of matches
       //console.log(matches)

        // Optionally, transform the matches to remove sensitive information before sending them to the client
        // const sanitizedMatches = matches.map(match => {
        //     const { sensitiveData, ...publicData } = match.toObject();
        //     return publicData;
        // });

        // console.log(sanitizedMatches, 'sanitized match')

        //res.status(200).send(matches);

    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).send({ message: 'Error fetching matches' });
    }
});


module.exports = router;