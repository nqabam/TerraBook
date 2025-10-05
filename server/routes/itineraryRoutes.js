// routes/itinerary.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const geminiService = require('../services/geminiService');
const databaseService = require('../services/databaseService');

// Get real items from database (for direct access)
router.get('/items/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { preferences } = req.query;

    let data;
    switch (type) {
      case 'accommodations':
        data = await databaseService.getAccommodations(JSON.parse(preferences || '{}'));
        break;
      case 'restaurants':
        data = await databaseService.getRestaurants(JSON.parse(preferences || '{}'));
        break;
      case 'activities':
        data = await databaseService.getActivities(JSON.parse(preferences || '{}'));
        break;
      case 'eco-reads':
        data = await databaseService.getEcoReads(JSON.parse(preferences || '{}'));
        break;
      default:
        return res.status(400).json({ error: 'Invalid item type' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI-powered itinerary generation with real database items
router.post('/generate', async (req, res) => {
  try {
    const { preferences, sessionId } = req.body;
    
    console.log('Generating itinerary with real database items for preferences:', preferences);
    
    const itineraryItems = await geminiService.generateItinerary(preferences);
    
    // Save generated itinerary to database
    if (sessionId) {
      const itemsWithSession = itineraryItems.map(item => ({
        ...item,
        chat_session_id: sessionId,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('itinerary_items')
        .insert(itemsWithSession);

      if (error) {
        console.error('Error saving itinerary to database:', error);
      }
    }
    
    res.json(itineraryItems);
  } catch (error) {
    console.error('Error in itinerary generation:', error);
    res.status(500).json({ 
      error: 'Failed to generate itinerary',
      details: error.message 
    });
  }
});

// Get specific item details by database ID
router.get('/item/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;

    const { data, error } = await supabase
      .from(type)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;