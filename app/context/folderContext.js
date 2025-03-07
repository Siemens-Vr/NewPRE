import React, { createContext, useContext, useState } from 'react';

const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderHierarchy, setFolderHierarchy] = useState([]);  // Keep track of navigation path

  return (
    <FolderContext.Provider value={{
      folders,
      setFolders,
      currentFolder,
      setCurrentFolder,
      folderHierarchy,
      setFolderHierarchy
    }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => useContext(FolderContext);