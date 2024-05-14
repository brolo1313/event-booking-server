const Event = require("../models/event");

// Function to create event
async function createEvents() {
    const events = [];
    const currentDay = new Date();
    const minDate = new Date(currentDay.getTime());
  
    for (let i = 0; i < 5; i++) {
      const randomDate = new Date(minDate.getTime() + Math.random() * (365 * 24 * 60 * 60 * 1000));
      const event = new Event({
        title: `Event ${i + 1}`,
        description: `Description for Event ${i + 1}. This is a sample event description that exceeds 30 characters. You can add more details about the event here.`,
        eventDate: randomDate,
        organizer: 'Event Conference',
      });
      events.push(event);
    }
  
    try {
      const result = await Event.insertMany(events);
      console.log('Events created successfully:', result);
    } catch (error) {
      console.error('Error creating events:', error.message);
    }
  };


  module.exports = {
    createEvents
  };