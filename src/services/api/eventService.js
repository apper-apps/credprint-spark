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

create: async (eventData, userId = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newEvent = {
      ...eventData,
      Id: Math.max(...mockEvents.map(e => e.Id)) + 1,
      attendees: [],
      createdBy: userId,
      createdAt: new Date().toISOString()
    };
    mockEvents.push(newEvent);
    return { ...newEvent };
  },

update: async (id, eventData, userId = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockEvents.findIndex(e => e.Id === id);
    if (index === -1) {
      throw new Error('Event not found');
    }
    const updatedEvent = { 
      ...mockEvents[index], 
      ...eventData, 
      Id: id,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    };
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