import mockTemplates from '@/services/mockData/templates.json';

const templateService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockTemplates];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const template = mockTemplates.find(t => t.Id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  },

create: async (templateData, userId = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTemplate = {
      ...templateData,
      Id: Math.max(...mockTemplates.map(t => t.Id)) + 1,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };
    mockTemplates.push(newTemplate);
    return { ...newTemplate };
  },

update: async (id, templateData, userId = 1) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTemplates.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    const updatedTemplate = { 
      ...mockTemplates[index], 
      ...templateData, 
      Id: id,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    };
    mockTemplates[index] = updatedTemplate;
    return { ...updatedTemplate };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTemplates.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    mockTemplates.splice(index, 1);
    return true;
  }
};

export default templateService;