// routes/itinerary.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const geminiService = require('../services/geminiService');

// Save itinerary items
router.post('/items', async (req, res) => {
  try {
    const { sessionId, items } = req.body;

    const itemsWithSession = items.map(item => ({
      ...item,
      chat_session_id: sessionId,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('itinerary_items')
      .insert(itemsWithSession)
      .select();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get itinerary items for session
router.get('/sessions/:sessionId/items', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('day')
      .order('time');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI-powered itinerary generation
router.post('/generate', async (req, res) => {
  try {
    const { preferences, sessionId } = req.body;
    
    console.log('Generating itinerary with preferences:', preferences);
    
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

// Update itinerary item
router.put('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('itinerary_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete itinerary item
router.delete('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const { error } = await supabase
      .from('itinerary_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;