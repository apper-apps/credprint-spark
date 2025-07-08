import mockEvents from '@/services/mockData/events.json';

const eventService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockEvents];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const event = mockEvents.find(e => e.Id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    return { ...event };
  },

  create: async (eventData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newEvent = {
      ...eventData,
      Id: Math.max(...mockEvents.map(e => e.Id)) + 1,
      attendees: []
    };
    mockEvents.push(newEvent);
    return { ...newEvent };
  },

  update: async (id, eventData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockEvents.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error('Event not found');
    }
    const updatedEvent = { ...mockEvents[index], ...eventData, Id: id };
    mockEvents[index] = updatedEvent;
    return { ...updatedEvent };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockEvents.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error('Event not found');
    }
    mockEvents.splice(index, 1);
    return true;
  }
};

export default eventService;