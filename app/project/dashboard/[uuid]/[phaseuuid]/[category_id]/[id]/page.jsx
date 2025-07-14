"use client"
import React, { useEffect, useReducer, useState, useRef } from 'react';
import styles from '@/app/styles/project/project/project.module.css';
import { FaArrowLeft, FaEllipsisV, FaRegFileAlt, FaTrash} from "react-icons/fa";
import { MdFolder} from "react-icons/md";
import { config } from "/config";
import UploadDropdown from '@/app/components/uploadDropdown/uploadDropdown';
import { useParams } from 'next/navigation';
// import Navbar from "@/app/components/project/output/navbar/navbar";
import Swal from "sweetalert2";
import api from '@/app/lib/utils/axios';
import CardComponent from '@/app/components/card/CardComponent';
import FormModal from '@/app/components/Form/FormModal';


// Action Types
const ACTION_TYPES = {
    SET_INITIAL_FOLDERS: 'SET_INITIAL_FOLDERS',
    OPEN_FOLDER: 'OPEN_FOLDER',
    OPEN_SUBFOLDER: 'OPEN_SUBFOLDER',
    CREATE_FOLDER: 'CREATE_FOLDER',
    CREATE_SUBFOLDER: 'CREATE_SUBFOLDER',
    DELETE_FOLDER: 'DELETE_FOLDER',
    DELETE_SUBFOLDER: 'DELETE_SUBFOLDER',
    UPLOAD_FILE: 'UPLOAD_FILE',
    UPLOAD_FOLDER_FILES: 'UPLOAD_FOLDER_FILES',
    DELETE_FILE: 'DELETE_FILE',
    UPDATE_FOLDER: 'UPDATE_FOLDER',
    UPDATE_SUBFOLDER: 'UPDATE_SUBFOLDER',
    UPDATE_FOLDER_LIST:'UPDATE_FOLDER_LIST',
    BACK_TO_PARENT: 'BACK_TO_PARENT'
};

// Initial State
const initialState = {
    folders: [],
    files: [],
    currentFolder: null,
    breadcrumbs: [],
    loading: false,
    error: null
};

// Folder Reducer
function folderReducer(state, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_INITIAL_FOLDERS:
  return {
       ...state,
       folders: action.payload.folders,      // your “master” list
       files: action.payload.documents,      // if you ever need a top-level file list
       currentFolder: {         id: 'root',
         name: 'Root Folder',
         subfolders: action.payload.folders, // now a real array
         files: action.payload.documents     // also a real array
      },
       loading: false
     };


        case ACTION_TYPES.OPEN_FOLDER:
            return {
                ...state,
                currentFolder: {
                    ...action.payload.folder,
                    name: action.payload.folder.folderName,
                    subfolders: action.payload.subFolders || [], // Note the capital S
                    files: action.payload.data || [] // Assuming 'data' contains files
                },
                breadcrumbs: [
                    ...state.breadcrumbs,
                    { 
                        id: action.payload.folder.uuid, 
                        name: action.payload.folder.folderName 
                    }
                ]
            };


        case ACTION_TYPES.OPEN_SUBFOLDER:
            return {
                ...state,
                currentFolder: {
                    ...action.payload.folder,
                    name: action.payload.folder.folderName,
                    subfolders: action.payload.subFolders || [],
                    files: action.payload.data || [],
                    parentFolderId: action.payload.folder.parentFolderId
                },
                breadcrumbs: [
                    ...state.breadcrumbs,
                    { 
                        id: action.payload.folder.uuid, 
                        name: action.payload.folder.folderName,
                        parentId: action.payload.folder.parentFolderId
                    }
                ]
            };

        case ACTION_TYPES.CREATE_FOLDER:
            // Logic to add new folder to current folder's subfolders
            return {
                ...state,
                currentFolder: {
                    ...state.currentFolder,
                    subfolders: [
                        ...(state.currentFolder.subfolders || []),
                        action.payload
                    ]
                },
                folders: [
                    ...state.folders,
                    action.payload
                ]
            };

        case ACTION_TYPES.CREATE_SUBFOLDER:
            // If we're creating a subfolder in the current folder
            if (state.currentFolder.uuid === action.payload.parentFolderId) {
                return {
                    ...state,
                    currentFolder: {
                        ...state.currentFolder,
                        subfolders: [
                            ...(state.currentFolder.subfolders || []),
                            action.payload
                        ]
                    },
                    folders: [
                        ...state.folders,
                        action.payload
                    ]
                };
            }
            // If we're creating a subfolder in a different folder, find and update that folder
            return {
                ...state,
                folders: state.folders.map(folder => 
                    folder.uuid === action.payload.parentFolderId 
                        ? { 
                            ...folder, 
                            subfolders: [...(folder.subfolders || []), action.payload] 
                            }
                        : folder
                )
            };
        // Updated UPLOAD_FILE reducer case
        case ACTION_TYPES.UPLOAD_FILE: {
            // For root level uploads
            if (!action.payload.parentFolderId && !state.currentFolder?.uuid) {
                return {
                    ...state,
                    documents: [...(state.documents || []), action.payload.file]
                };
            }

            // For folder/subfolder uploads
            const updatedFolders = state.folders.map(folder =>
                folder.uuid === (state.currentFolder?.uuid || action.payload.parentFolderId)
                    ? {
                        ...folder,
                        files: [...(folder.files || []), action.payload.file]
                    }
                    : folder
            );

            return {
                ...state,
                folders: updatedFolders,
                currentFolder: {
                    ...state.currentFolder,
                    files: [...(state.currentFolder?.files || []), action.payload.file]
                }
            };
        }

        case ACTION_TYPES.UPLOAD_FOLDER_FILES: {
            // For root level uploads
            if (!action.payload.parentFolderId && !state.currentFolder?.uuid) {
                return {
                    ...state,
                    documents: [...(state.documents || []), ...action.payload.files]
                };
            }

            // For folder/subfolder uploads
            const updatedFolders = state.folders.map(folder =>
                folder.uuid === (state.currentFolder?.uuid || action.payload.parentFolderId)
                    ? {
                        ...folder,
                        files: [...(folder.files || []), ...action.payload.files]
                    }
                    : folder
            );

            return {
                ...state,
                folders: updatedFolders,
                currentFolder: {
                    ...state.currentFolder,
                    files: [...(state.currentFolder?.files || []), ...action.payload.files]
                }
            };
        }
        case ACTION_TYPES.DELETE_FILE:
            return {
                ...state,
                currentFolder: {
                    ...state.currentFolder,
                    files: state.currentFolder.files.filter(file => file.id !== action.payload)
                }
            };

        case ACTION_TYPES.DELETE_FOLDER:
    return {
        ...state,
        currentFolder: {
            ...state.currentFolder,
           
            subfolders: state.currentFolder.subfolders.filter(folder => folder.uuid !== action.payload),
        },
    };

case ACTION_TYPES.DELETE_SUBFOLDER:
    return {
        ...state,
        currentFolder: {
            ...state.currentFolder,
            subfolders: state.currentFolder.subfolders.filter(subfolder => subfolder.uuid !== action.payload),
        },
    };
    case ACTION_TYPES.UPDATE_FOLDER_LIST:
        return {
            ...state,
            folders: action.payload, // Update the folder list
        };
    
    case ACTION_TYPES.UPDATE_FOLDER:
        return {
            ...state,
            currentFolder: {
                ...state.currentFolder,
                subfolders: state.currentFolder.subfolders.map(folder =>
                    folder.uuid === action.payload.uuid
                        ? { ...folder, name: action.payload.name }
                        : folder
                ),
            },
        };

    case ACTION_TYPES.UPDATE_SUBFOLDER:
        return {
            ...state,
            currentFolder: {
                ...state.currentFolder,
                subfolders: state.currentFolder.subfolders.map(subfolder =>
                    subfolder.uuid === action.payload.uuid
                        ? { ...subfolder, name: action.payload.name }
                        : subfolder
                ),
            },
        };
    

        case ACTION_TYPES.BACK_TO_PARENT:
            return {
                ...state,
                currentFolder: action.payload.parentFolder,
                breadcrumbs: state.breadcrumbs.slice(0, -1)
            };

        default:
            return state;
    }
}

const Documents = () => {
    const [state, dispatch] = useReducer(folderReducer, initialState);
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState()
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [actionMenuPosition, setActionMenuPosition] = useState({ x: 0, y: 0 });
    const [viewUrl, setViewUrl] = useState(null);
    const [showView, setShowView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [fileList, setFileList] = useState (false);


    
    const [modalStates, setModalStates] = useState({
        folderModal: false,
        folderUpdateModal:false,
        fileModal: false,
        folderUploadModal: false
    });
    const [folderName, setFolderName] = useState("");
    
    const [menuOpen, setMenuOpen] = useState({});
    const [folderMenuOpen, setFolderMenuOpen] = useState({});
    const menuRefs = useRef({});
    const folderRef = useRef(null);

    const params = useParams()
    const {id,uuid, category_id} = params

    // console.log('This is the folder name', folderName)


//menu 
useEffect(() => {
    const handleClickOutside = (event) => {
        let isClickInsideMenu = Object.values(menuRefs.current).some((menu) => menu && menu.contains(event.target));
        if (!isClickInsideMenu) {
            setMenuOpen({});
        }
    };

    // Attach to document
    document.addEventListener("mousedown", handleClickOutside);

    // Attach specifically to folder
    const folderElement = folderRef?.current; // assuming you have a ref called folderRef
    if (folderElement) {
        folderElement.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        if (folderElement) {
            folderElement.removeEventListener("mousedown", handleClickOutside);
        }
    };
}, []);



    // Fetch initial folders
    const fetchInitialFolders = async () => {
  try {
   const response = await api.get(`/cost_cat/${id}`);
const { success, data, count } = response.data;
console.log('API response:', response.data);
if (!success) throw new Error('API returned failure');

const { folders, documents } = data;    // 👈 unwrap the real arrays

dispatch({
  type: ACTION_TYPES.SET_INITIAL_FOLDERS,
  payload: { folders, documents }
});
  } catch (error) {
    console.error('Folder fetch error:', error);
  }
};


    // Fetch folder contents with support for nested folders
    const fetchFolderContents = async (folderId, options = {}) => {
    try {
        let apiUrl;
        
        // Determine the appropriate API endpoint based on folder hierarchy
        if (options.parentFolderId) {
            console.log("parentFolderid", options.parentFolderId)
            apiUrl = `/cost_cat/${id}/${options.parentFolderId}/${folderId}`;
          

        } else {
            // If no parent folder ID, we're dealing with a root-level folder
            apiUrl = `/cost_cat/${id}/${folderId}`;
        }
        console.log("URL",apiUrl)
        const response = await api.get(apiUrl);
        console.log('API response:', response);
        if (response.status !== 200 && response.status !== 201) throw new Error('Failed to fetch folder contents');
        
        const result =  response.data;
        console.log('Full API response:', result);
        
        if (response.status === 200 && response.status === 201) {
            // Determine which action to dispatch based on nesting level
            const actionType = options.parentFolderId 
                ? ACTION_TYPES.OPEN_SUBFOLDER 
                : ACTION_TYPES.OPEN_FOLDER;

            dispatch({
                type: actionType,
                payload: {
                    folder: {
                        id: folderId,
                        folderName: result.folderName || 'Folder',
                        parentFolderId: options.parentFolderId || null
                    },
                    subFolders: result.subFolders,
                    data: result.data
                }
            });
        } else {
            throw new Error('Invalid response status');
        }
    } catch (error) {
        console.error('Folder contents fetch error:', error);
    }
    };

    useEffect(() => {
        // console.log('Current Folder State:', state.currentFolder);
    }, [state.currentFolder]);


    const handleCreateFolder = async (providedFolderName = null) => {
        if (isLoading) return; // Prevent multiple submissions
        setIsLoading(true);
    
        const nameToUse = providedFolderName || folderName.trim();
        
        if (!nameToUse) {
            alert('Folder name is required.');
            setIsLoading(false);
            return;
        }
    
        const parentFolderId = state.currentFolder?.id || null;
    
        const newFolder = {
            folderName: nameToUse,
            parentFolderId,
        };
    
        const folderUrl =         
            `/cost_cat/${id}`;

        try {
            const response = await api.post(folderUrl,newFolder, {
                headers: { 'Content-Type': 'application/json' ,
                    "Accept": "application/json"
                }
            });
    
            if (response.status !== 200 && response.status !== 201) {
                const errorMessage = response.message;
                console.error('Error response:', errorMessage);
                throw new Error(errorMessage || 'Failed to create folder.');
            }
    
            const createdFolder =  response.data;
            console.log('Folder created successfully:', createdFolder);
            dispatch({
                type: parentFolderId ? ACTION_TYPES.CREATE_SUBFOLDER : ACTION_TYPES.CREATE_FOLDER,
                payload: { ...createdFolder, parentFolderId },
            });
          
            if (!providedFolderName) {
                setFolderName('');
                setModalStates((prev) => ({ ...prev, folderModal: false }));
            }
            return createdFolder;
        } catch (err) {
//   console.error("=== CREATE FOLDER ERROR ===\n", err.response?.data);
  const msg =
    err.response?.data?.error ||
    err.response?.data?.message ||
    err.message ||
    "Unknown server error";
  alert(`Error creating folder: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };


   
const handleFileUpload = async () => {
    console.log("🗂️ selectedFile is:", selectedFile);
  if (!selectedFile) {
    alert("Please select a file to upload.");
    return;
  }

  try {
    // 1) Build FormData with the exact field name your controller reads:
    const formData = new FormData();
    formData.append("cost_category", selectedFile, selectedFile.name);

    // 2) (Optional) Debug: log each entry
    for (const [key, value] of formData.entries()) {
      console.log("FormData:", key, value);
    }

    // 3) Construct your upload URL exactly as before
    let uploadUrl = `/cost_cat/file/${id}`;
    const folderId = state.currentFolder?.id;
    const parentId = state.currentFolder?.parentFolderId;
    if (folderId && folderId !== "root") {
      uploadUrl += parentId ? `/${parentId}/${folderId}` : `/${folderId}`;
    }
    console.log("Uploading to:", uploadUrl);

    // 4) Send the request—do NOT override Content-Type
    const response = await api.post(uploadUrl, formData);

    // 5) Treat any 2xx as success
    if (response.status >= 200 && response.status < 300) {
      dispatch({
        type: ACTION_TYPES.UPLOAD_FILE,
        payload: {
          file: response.data.newFile,
          parentFolderId: parentId || folderId || null,
        },
      });
      alert("File uploaded successfully!");
      setSelectedFile(null);
      setModalStates((prev) => ({ ...prev, fileModal: false }));
      window.location.reload();
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      alert(`Upload failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error uploading file:", error);

    // Pick the best message available
    const errMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Unknown upload error";

    alert(errMsg);
  }
};




        


        
    // Updated folder upload handlers
    const handleFolderSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleFolderUpload = async () => {
        if (!selectedFiles?.length) {
            alert('Please select folder to upload.');
            return;
        }
    
        try {
            const uploadedFiles = [];
            const errors = [];
            const folderUploadName = selectedFiles[0]?.webkitRelativePath.split('/')[0];
            console.log('Folder to be created:', folderUploadName);
    
            if (!folderUploadName.trim()) {
                alert('Unable to determine folder name.');
                return;
            }
    
            // Call handleCreateFolder directly with the folder name
            const newFolder = await handleCreateFolder(folderUploadName);
            console.log("new folder",newFolder)
       
    
            if (!newFolder) {
                throw new Error('Failed to create folder');
            }

             let newFolderUuid;

            // Check if `newFolder` has a `data.folder` structure
            if (newFolder?.data?.folder?.uuid) {
                newFolderUuid = newFolder.data.folder.uuid;
            } 
            // Otherwise, check if `newFolder` directly contains `uuid`
            else if (newFolder?.uuid) {
                newFolderUuid = newFolder.uuid;
            } else {
                console.error('Failed to extract folder UUID from newFolder:', newFolder);
                throw new Error('Invalid folder data structure.');
            }

            console.log('Extracted UUID:', newFolderUuid);
    
            // Construct upload URL for files using the returned folder
            let uploadUrl = `/cost_cat/${id}/${newFolderUuid}`;

            if (state.currentFolder.id !== "root" ) {
                uploadUrl = `/cost_cat/${id}/${state.currentFolder.id}/${newFolderUuid}`;
            }

            console.log(uploadUrl)
    
            // Upload files to the new folder
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append('file', file);
    
                try {
                    const response = await api.post(uploadUrl, formData);
    
                    if (response.status !== 200 && response.status !== 201){
                        const errorMessage = await response.message;
                        errors.push(`Failed to upload ${file.name}: ${errorMessage}`);
                        continue;
                    }
    
                    const responseData =  response.data;
                    uploadedFiles.push(responseData);
                    window.location.reload();

                } catch (error) {
                    errors.push(`Failed to upload ${file.name}: ${error.message}`);
                }
            }
    
            // Update state with uploaded files
            if (uploadedFiles.length > 0) {
                dispatch({
                    type: ACTION_TYPES.UPLOAD_FILE,
                    payload: {
                        files: uploadedFiles,
                        parentFolderId: newFolder.uuid
                    }
                });
            }
    
            // Show results to user
            if (uploadedFiles.length > 0) {
                alert(`Successfully uploaded ${uploadedFiles.length} files to folder "${folderUploadName}"`);
            }
            if (errors.length > 0) {
                console.error('Upload errors:', errors);
                alert(`Failed to upload ${errors.length} files. Check console for details.`);
            }
    
            // Reset states and close modal
            setSelectedFiles(null);
            setModalStates((prev) => ({ ...prev, folderUploadModal: false }));
    
        } catch (error) {
            console.error('Error in folder upload process:', error);
            alert('Failed to complete folder upload process. Please try again.');
        }
    };

    const handleView = async (file) => {
        try {
            // Ensure the project UUID is correctly defined
            const viewUrl = `/${file.documentPath}`;
    
            // Open a new tab
            const newTab = window.open('', '_blank');
    
            if (!newTab) {
                alert('Pop-up blocked! Please allow pop-ups for this site.');
                return;
            }
    
            // Open the file URL in the new tab
            newTab.location.href = viewUrl;
    
        } catch (error) {
            console.error('Error viewing file:', error);
            alert('Failed to view file');
        }
    };
    


    const handleDownload = (file) => {
        console.log("Download file:", file);
    
        if (!file || !file.documentPath) {
            Swal.fire({
                title: 'Error',
                text: "No file available to download.",
                icon: 'error'
            });
            return;
        }
        
        try {
            const filePath = `/download/${file.documentPath}`;
            const link = document.createElement("a");
            link.href = filePath;
            link.download = file.documentName || "download";
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
            Swal.fire({
                title: 'Download Error',
                text: "Failed to download the file.",
                icon: 'error'
            });
        }
    };

   
    const handleDeleteFile = async ( file) => {
        // console.log("Delete function received:", file.documentName  );
    
    if (!file) {
        // console.error("Invalid file object:", file);
        alert("Cannot delete this file - missing file information");
        return;
    }
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${name} `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel'
          });
          
          if (result.isConfirmed) {
            setDeleting(uuid);
        

        try {
            const response = await api.delete(`cost_cat/delete/${file.uuid}`);
            console.log(response)
            if (response.status === 200 && response.status === 201) {
        
                Swal.fire({
                    title: 'Deleted!',
                    text: `${name} has been successfully deleted.`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
                 }
             else {
                console.error("Error deleting file:",  response.data.message);
            }
            } catch (error) {
            console.error("Error deleting file:", error);
            }
    }
};

  
    const handleDeleteFolder = async (folder) => {
        if (!confirm('Are you sure you want to delete this item and all its contents?')) return;

        const parentFolderId = state.currentFolder?.uuid
    
        const folderUrls = parentFolderId
        ? `/subFolders/${folder.uuid}`
        : `/folders/${folder.uuid}`; 
    
        try {
            const response = await api.delete(folderUrls);
    
            if (response.status !== 200 && response.status !== 201) throw new Error('Delete failed');
    
            // Dispatch the appropriate action based on whether it's a folder or subfolder
            dispatch({
                type: parentFolderId ? ACTION_TYPES.DELETE_SUBFOLDER : ACTION_TYPES.DELETE_FOLDER,
                payload: folder.uuid,
            });
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    };
    
    
    // Back to Parent Folder
    const handleBackToParent = () => {
        if (state.breadcrumbs.length > 1) {
            const lastBreadcrumb = state.breadcrumbs[state.breadcrumbs.length - 2];
            
            // If the last breadcrumb has a parentId, use it to fetch the parent folder
            if (lastBreadcrumb.parentId) {
                fetchFolderContents(lastBreadcrumb.id, { 
                    parentFolderId: lastBreadcrumb.parentId 
                });
            } else {
                // If no parentId, it's a root-level folder
                fetchFolderContents(lastBreadcrumb.id);
            }
        } else {
            fetchInitialFolders();
        }
    };
    const [selectedFolder, setSelectedFolder] = useState(null);

    const handleUpdateFolder = (folder) => {
      // Set the selected folder and pre-fill the folder name
      console.log("folder to update",folder)
      setSelectedFolder(folder);
      setFolderName(folder.folderName); // Assuming the folder object has a 'name' property
      setModalStates(prev => ({ ...prev, folderUpdateModal: true }));
      setMenuOpen(false);
    };
    
const submitFolderUpdate = async () => {
    if (!selectedFolder) return;

    const isSubfolder = !!selectedFolder.folderId; // << This detects if it's a subfolder

    let folderUrl = '';

    if (!isSubfolder) {
        // Updating a root folder
        folderUrl = `/folders/update/${selectedFolder.uuid}`;
    } else {
        // Updating a subfolder
        folderUrl = `/subFolders/${selectedFolder.uuid}`;
    }

    try {
        setIsLoading(true);
        console.log(folderName)

        const response = await api.post(folderUrl,{folderName},  {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status !== 200 && response.status !== 201) {
            const errorData = await response.data.message;
            throw new Error(errorData.message || 'Failed to update folder');
        }

        const updatedFolder = await response.data;

        // Dispatch action to update folder in state
        dispatch({
            type: isSubfolder ? ACTION_TYPES.UPDATE_SUBFOLDER : ACTION_TYPES.UPDATE_FOLDER,
            payload: updatedFolder,
        });

        // Fetch the updated list of folders after successful update
        await fetchUpdatedFolderList();

        setModalStates(prev => ({ ...prev, folderUpdateModal: false }));

        console.log('Folder updated successfully');
    } catch (error) {
        console.error('Error updating folder:', error);
    } finally {
        setIsLoading(false);
    }
    
};

// Function to fetch the updated list of folders after a successful update
const fetchUpdatedFolderList = async () => {
    try {
        if (state.currentFolder.id === "root") {
            // If we're at root level, fetch all folders
            await fetchInitialFolders();
        } else {
            // If we're in a folder, refetch its contents
            await fetchFolderContents(
                state.currentFolder.uuid, 
                { parentFolderId: state.currentFolder.parentFolderId }
            );
        }
        console.log('Folder list updated successfully');
    } catch (error) {
        console.error('Error fetching updated folder list:', error);
    }
}; 



    

    // Open Folder
    const handleOpenFolder = (folder, parentFolder = null) => {
      
        const options = parentFolder 
            ? { parentFolderId: parentFolder.uuid } 
            : {};

        fetchFolderContents(folder.uuid, options);
    };

    const toggleFolderMenu = (folderId) => {
        setFolderMenuOpen((prev) => ({
          [folderId]: !prev[folderId],
        }));
      };
    
    // In your component
    const toggleMenu = (fileId) => {
        setMenuOpen(prev => ({
          [fileId]: !prev[fileId]
        }));
      };
    // Side Effects
    useEffect(() => {
        fetchInitialFolders();
    }, [id]);

 const renderFolders = () => {
        const foldersToRender = state.currentFolder?.subfolders || [];
        
        return (
            <div>
              <h2 className="text-xl font-semibold text-black ">Folders</h2>
              <br />
              <div className="flex flex-wrap gap-4">
                {foldersToRender.map((folder) => (
              <div
                key={folder.uuid}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-3 min-w-0 w-full sm:w-[200px] md:w-[220px] lg:w-[250px] h-[50px] shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-300"
                onClick={() => handleOpenFolder(folder, state.currentFolder)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MdFolder className="text-yellow-500 rounded p-1 w-8 h-8" />
                  <h3 className="text-gray-700 font-medium truncate">
                    {folder.folderName || 'Unnamed Folder'}
                  </h3>
                </div>
                 {/* Toggle button */}
             <div className="relative" ref={folderRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolderMenu(folder.uuid);
                
              }}
              className="text-gray-500 hover:text-gray-700"
            
            >
              <FaEllipsisV size={16} />
            </button>

            {/* Dropdown menu */}
            {folderMenuOpen[folder.uuid] && (
              <div
                id={`dropdown-${folder.uuid}`}
                className="absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateFolder(folder);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Update
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
              </div>
            ))}
          </div>
          </div>
        );
      };

const renderFiles = () => {
  const filesToRender = Array.isArray(state.currentFolder?.files)
    ? state.currentFolder.files
    : [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-black mb-2">Files</h2>
      {filesToRender.map((file) => {
        // Use the API's "name" field
        const rawName = file.name || file.documentName || 'Unnamed Document';

        return (
          <div
            key={file.uuid}
            className="flex items-center justify-between bg-gray-100 rounded-lg p-3 min-w-0 w-full sm:w-[220px] md:w-[250px] lg:w-[300px] shadow-sm hover:shadow-md cursor-pointer relative"
            onClick={() => handleView(file)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <FaRegFileAlt className="text-yellow-500 rounded p-1 w-10 h-10" />
              <span className="text-gray-700 text-sm truncate">
                {rawName}
              </span>
            </div>
            {/* …rest of your menu code */}
          </div>
        );
      })}
    </div>
  );
};

          return (
        <div className={styles.projectDetails}>
        <div className={styles.inputDocumentSection}>
            
            <div className={styles.inputDocumentHeader}>
            <div className={styles.inputDocumentHeaderLeft}>
                {state.breadcrumbs.length > 0 && (
                    <button className=" flex gap-2 p-4 justify-center align-center"onClick={handleBackToParent}>
                        {/* <FaArrowLeft className='w-8'/>  */}
                    </button>
                )}
                {/* <h2>
                    {state.currentFolder 
                        ? state.currentFolder.name 
                        : 'Documents'}
                </h2> */}
        </div>
        <div className={styles.inputDocumentHeaderRight}>
                <UploadDropdown setModalStates={setModalStates} />
            </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-start items-start p-4 md:gap-3 sm:gap-2 ">
            {/* Folders Section */}
            <div className="w-full">
                <h2 className="text-lg font-semibold text-white mb-2">Folders</h2>
                <div className="flex flex-wrap gap-4">
                {renderFolders()}
                </div>
            </div>

            {/* Files Section */}
            <div className="w-full">
                <h2 className="text-lg font-semibold text-white mt-6 mb-2">Files</h2>
                <div className="flex flex-wrap gap-4">
                {renderFiles()}
                </div>
            </div>
            </div>



            {/* Modal Components would be added here */}

              {/* File view Modal */}
              {showView && (
                <div className={styles.viewModal}>
                    <div className={styles.viewContent}>
                        <button 
                            className={styles.closeView}
                            onClick={() => setShowView(false)}
                        >
                            ×
                        </button>
                        <iframe 
                            src={viewUrl} 
                            title="File view"
                            className={styles.viewFrame}
                        />
                    </div>
                </div>
            )}

            {/* Create Folder modal */}
             {modalStates.folderModal && (
<FormModal
        isOpen={modalStates.folderModal}
        title="Create Folder"
        fields={[{
          name: 'folderName',
          label: 'Folder Name',
          type: 'text',
          placeholder: 'Enter folder name',
          value: folderName,
          onChange: e => setFolderName(e.target.value),
        }]}
        onClose={() => setModalStates(m => ({ ...m, folderModal: false }))}
        onSubmit={handleCreateFolder}
        submitLabel="Create"
        disableSubmit={!folderName.trim()}
      />
      )}

      {/* 2) Upload Folder */}
      {modalStates.folderUploadModal && (
      <FormModal
        isOpen={modalStates.folderUploadModal}
        title="Upload Folder"
        fields={[{
          name: 'folderFiles',
          label: 'Select Folder',
          type: 'file',
          directory: true,
          multiple: true,
          onChange: e => setSelectedFiles(Array.from(e.target.files)),
        }]}
        onClose={() => setModalStates(m => ({ ...m, folderUploadModal: false }))}
        onSubmit={handleFolderUpload}
        submitLabel="Upload"
        disableSubmit={!selectedFiles?.length}
      />
      )}

      {/* 3) Upload File */}
{modalStates.fileModal && (
  <FormModal
    isOpen
    title="Upload File"
    fields={[]}                             // ← avoids fields.map(undefined)
    initialValues={{}}                      // ← keeps FormModal in sync
    onClose={() => setModalStates(m => ({ ...m, fileModal: false }))}
    onSubmit={handleFileUpload}
    submitLabel="Upload"
    disableSubmit={!selectedFile}
  >
    <input
      type="file"
      accept="*/*"
      onChange={e => {
        const file = e.target.files?.[0] ?? null;
        console.log("📂 chosen file:", file, file instanceof File);
        setSelectedFile(file);
      }}
      style={{ width: '100%', marginBottom: 12 }}
    />
    {!selectedFile && (
      <p style={{ color: 'red', fontSize: '0.9rem' }}>
        Please choose a file before uploading.
      </p>
    )}
  </FormModal>
)}




      {/* 4) Update Folder */}
      {modalStates.folderUpdateModal && (
      <FormModal
        isOpen={modalStates.folderUpdateModal}
        title="Update Folder"
        fields={[{
          name: 'folderName',
          label: 'New Name',
          type: 'text',
          placeholder: 'Enter new name',
          value: folderName,
          onChange: e => setFolderName(e.target.value),
        }]}
        onClose={() => setModalStates(m => ({ ...m, folderUpdateModal: false }))}
        onSubmit={submitFolderUpdate}
        submitLabel="Update"
        disableSubmit={!folderName.trim()}
      /> 
      )}

</div>

            </div>
        );
        };
   

export default Documents;