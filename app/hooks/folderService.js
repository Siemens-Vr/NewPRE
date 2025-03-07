import { config } from "/config";


export const folderService = {
    // Create a new folder
    async createFolder({ name, description, parentFolderId = null, projectId }) {
      const payload = {
        name,
        description,
        parentFolderId,
        projectId
      };
  
      try {
        const response = await fetch(`${config.baseURL}/folders/${projectId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) throw new Error('Failed to create folder');
        return await response.json();
      } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
      }
    },
  
    // Fetch folder contents
    async getFolderContents(folderId, projectId) {
      try {
        const response = await fetch(`${config.baseURL}/documents/${projectId}/${folderId}`);
        if (!response.ok) throw new Error('Failed to fetch folder contents');
        return await response.json();
      } catch (error) {
        console.error('Error fetching folder contents:', error);
        throw error;
      }
    }
  };
  