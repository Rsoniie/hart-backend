const express = require('express');
const UserResponse = require('../model/userResponse'); // Import the model
const router = express.Router();

const prompts = {
    "Personal": {
      "Doing this makes me happy" : '',
      "A song I relate with" : '',
      "My favourite childhood memory" : '',
      "I’m afraid of" : '',
      "If I could go back in time, I would" : '',
      "A movie that influenced me" : '',
      "My favourite quote" : '',
      "I’m proud of myself for" : '',
      "Sometimes I struggle with" : '',
      "I get really excited about" : '',
      "I really want to learn" : '',
      "My comfort food is" : '',
      "My most irrational fear" : '',
      "I’m at peace when" : '',
      "My favourite quality about me" : '',
      "My favourite book" : '',
      "My cry-in-the-car song" : ''
    },
    "My Type": {
      "My favourite trait in a person" : '',
      "A non-negotiable": '',
      "Show me you’re different by" : '',
      "Would you rather" : '',
      "Only text me if" : '',
      "I love it when a person" : '',
      "I’m weirdly attracted to" : '',
      "Green flags I look for" : '',
      "Don’t text me if" : '',
      "All I ask if that you" : '',
      "I’ll also do this if you" : ''
    },
    "World": {
      "A social cause I’m passionate about" : '',
      "A random fact I love" : '',
      "Change my mind about" : '',
      "On top of my bucket list is" : '',
      "One thing I want to change about the world" : '',
      "My friends ask me for advice about" : '',
      "I’m a nerd about" : '',
      "My best Dad joke" : '',
      "This world needs more of" : '',
      "This is a waste of money" : '',
      "A life goal of mine" : ''
    },
    "Story Time": {
      "The spontaneous thing I’ve done" : "",
      "One thing I’ll never do again" : '',
      "Two lies and a truth" : '',
      "My biggest date fail" : '',
      "Biggest risk I’ve taken" : '',
      "I knew I messed up bad when" : ''
    }
}

// Route to get prompts
router.get('/prompts', (req, res) => {
  res.json(prompts);
});

// Route to submit user responses
router.post('/prompts/:firebaseId', async (req, res) => {
    //console.log(req, req.params, req.body)
  try {
    const { firebaseId } = req.params;
    const { responses } = req.body;

    if (!responses) {
      return res.status(400).send('Responses are required');
    }

    const userResponse = await UserResponse.findOneAndUpdate(
      { firebaseId },
      { firebaseId, responses },
      { new: true, upsert: true }
    );

    res.json(userResponse);
  } catch (error) {
    console.error('Error in POST /prompts/:firebaseId:', error);
    res.status(500).send('Internal Server Error');
  }
});



// GET route for fetching prompts
router.get('/prompts/:firebaseId', async (req, res) => {
  try {
    const { firebaseId } = req.params;

    if (!firebaseId) {
      return res.status(400).send('firebaseId is required');
    }

    const userResponse = await UserResponse.findOne({ firebaseId });

    if (!userResponse) {
      return res.status(404).send('User responses not found');
    }

    res.json(userResponse);
  } catch (error) {
    console.error('Error in GET /prompts/:firebaseId:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
