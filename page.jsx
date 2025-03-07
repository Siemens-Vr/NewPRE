import { useFolder } from '@/app/context/folderContext';
import { folderService } from '@/app/hooks/folderService';

const FolderComponent = ({ projectId }) => {
  const {
    currentFolder,
    setCurrentFolder,
    folderHierarchy,
    setFolderHierarchy
  } = useFolder();
  
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);

  // Create a new folder
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return alert('Folder name is required.');

    try {
      const newFolder = await folderService.createFolder({
        name: folderName,
        description: folderDescription,
        parentFolderId: currentFolder?.uuid || null,  // Use current folder's UUID as parent if it exists
        projectId
      });

      // Update the current folder's contents if we're inside a folder
      if (currentFolder) {
        const updatedFolderContents = await folderService.getFolderContents(currentFolder.uuid, projectId);
        setCurrentFolder(updatedFolderContents);
      }

      setFolderModalOpen(false);
      setFolderName('');
      setFolderDescription('');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  // Navigate to a folder
  const handleOpenFolder = async (folder) => {
    try {
      const folderContents = await folderService.getFolderContents(folder.uuid, projectId);
      setCurrentFolder(folderContents);
      // Update folder hierarchy for navigation
      setFolderHierarchy(prev => [...prev, folder]);
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  };

  // Navigate back to parent
  const handleBackToParent = async () => {
    if (folderHierarchy.length <= 1) {
      setCurrentFolder(null);
      setFolderHierarchy([]);
      return;
    }

    const newHierarchy = folderHierarchy.slice(0, -1);
    const parentFolder = newHierarchy[newHierarchy.length - 1];
    
    try {
      if (parentFolder) {
        const folderContents = await folderService.getFolderContents(parentFolder.uuid, projectId);
        setCurrentFolder(folderContents);
        setFolderHierarchy(newHierarchy);
      } else {
        setCurrentFolder(null);
        setFolderHierarchy([]);
      }
    } catch (error) {
      console.error('Error navigating to parent:', error);
    }
  };

  // Return JSX...
};