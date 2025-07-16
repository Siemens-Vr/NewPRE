"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

import api from "@/app/lib/utils/axios";
import styles from "@/app/styles/project/project/project.module.css";
import UploadDropdown from "@/app/components/uploadDropdown/uploadDropdown";
import FormModal from "@/app/components/Form/FormModal";

import { MdFolder } from "react-icons/md";
import { FaRegFileAlt, FaDownload, FaArchive } from "react-icons/fa";
// import Tippy from '@tippyjs/react'; // for nice tooltips


// ─── REDUCER & ACTIONS ─────────────────────────────────────────────────────────

const ACTIONS = {
  SET_VIEW:      "SET_VIEW",
  OPEN_FOLDER:  "OPEN_FOLDER",
  BACK:         "BACK",
  ADD_FOLDER:   "ADD_FOLDER",
  ADD_FILE:     "ADD_FILE",
};

const initialState = {
  folders:     [],
  files:       [],
  breadcrumbs: [],       
  currentId:   null,    
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_VIEW:
      return {
        ...state,
        folders:     payload.folders,
        files:       payload.documents,
        currentId:   payload.id,
        breadcrumbs: payload.reset
          ? [{ id: payload.id, name: payload.name }]
          : state.breadcrumbs,
      };

    case ACTIONS.OPEN_FOLDER:
      return {
        ...state,
        breadcrumbs: [
          ...state.breadcrumbs,
          { id: payload.id, name: payload.name }
        ]
      };

   case ACTIONS.BACK: {
      const bc = [...state.breadcrumbs];
      bc.pop();
      return {
        ...state,
        breadcrumbs: bc,
        currentId:   bc[bc.length - 1]?.id ?? state.currentId,
      };
    }

    case ACTIONS.ADD_FOLDER:
      return {
        ...state,
        folders: [...state.folders, payload],
      };

    case ACTIONS.ADD_FILE:
      return {
        ...state,
        files: [...state.files, payload],
      };

    default:
      return state;
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log("Initial state:", state);
  // modal state
  const [modal, setModal] = useState({
    createFolder: false,
    uploadFile:   false,
    uploadFolder: false,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  //  fetch &  view
 const loadFolder = async (targetId, isRoot = false, name = "Root") => {
  try {
    if (isRoot) {
      // root-level: get folders + files
      const res = await api.get(`/cost_cat/${targetId}`);
      const { folders, documents } = res.data.data;
      dispatch({
        type: ACTIONS.SET_VIEW,
        payload: { id: targetId, name, folders, documents, reset: true },
      });
    } else {
      // subfolder: only files
      const resFiles = await api.get(`/cost_cat/files/${targetId}`);
      dispatch({
        type: ACTIONS.SET_VIEW,
        payload: { 
          id: targetId, 
          name, 
          folders: [],
          documents: resFiles.data,
          reset: false 
        },
      });
      dispatch({ type: ACTIONS.OPEN_FOLDER, payload: { id: targetId, name } });
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error", err.message, "error");
  }
};



  useEffect(() => {
    if (id) loadFolder(id, true, "Root");
  }, [id]);


  const handleOpenFolder = (f) => {
    loadFolder(f.uuid, false, f.folderName);
    dispatch({ type: ACTIONS.OPEN_FOLDER, payload: { id: f.uuid, name: f.folderName } });
  };
  const handleBack = () => dispatch({ type: ACTIONS.BACK });

  //  CREATE FOLDER
const handleCreateFolder = async (folderName) => {
  console.log("Creating folder:", folderName);
  if (!folderName.trim()) return;

  try {
    const res = await api.post(`/cost_cat/${state.currentId}`, { folderName });
    // console.log("Folder created:", res.data);
    dispatch({ type: ACTIONS.ADD_FOLDER, payload: res.data });
    // close the modal
    setModal(m => ({ ...m, createFolder: false }));
  } catch (err) {
    Swal.fire("Error", err.response?.data?.error || err.message, "error");
  }
};


  // UPLOAD SINGLE FILE
 const handleFileUpload = async ({ file }) => {
  if (!file) return;

  const fd = new FormData();
  fd.append("cost_category", file);

  try {
    const res = await api.post(
      `/cost_cat/file/${state.currentId}`, 
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // Add the returned file to state
    dispatch({ type: ACTIONS.ADD_FILE, payload: res.data.newFile });

    // Close modal
    setModal(m => ({ ...m, uploadFile: false }));

    // Reload the current folder’s contents
    const isRoot = state.breadcrumbs.length === 1;
    await loadFolder(
      state.currentId,
      isRoot,
      state.breadcrumbs[state.breadcrumbs.length - 1].name
    );
  } catch (err) {
    console.error("Upload error:", err);
    Swal.fire("Error", err.response?.data?.error || err.message, "error");
  }
};


  // UPLOAD MULTIPLE FILES
  const handleFolderUpload = async () => {
    for (const f of selectedFiles) {
      const fd = new FormData();
      fd.append("cost_category", f);
      try {
        const res = await api.post(`/cost_cat/${state.currentId}`, fd);
        dispatch({ type: ACTIONS.ADD_FILE, payload: res.data.newFile });
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
    setModal(m => ({ ...m, uploadFolder: false }));
    setSelectedFiles([]);
  };

  //VIEW FILE

  const handleView = (file) => {
  const filename = file.name;
  const viewUrl = `${api.defaults.baseURL}/uploads/cost_category/${filename}`;
  const w = window.open(viewUrl, "_blank", "noopener");
  // if (!w) {
  //   alert("Pop-up blocked! Please allow pop-ups.");
  // }
};

//const filePath = `/download/${file.documentPath}`;
  //DOWNLOAD FILE
  const handleDownload = (file) => {
  const filename = file.name;
  // console.log("Downloading file:", filename);
  const dlUrl = `${api.defaults.baseURL}/download/uploads/cost_category/${filename}`;
  const a = document.createElement("a");
  a.href = dlUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleArchive = async (file) => {
  const filename = file.name;
  const archiveUrl = `${api.defaults.baseURL}/uploads/cost_category/${filename}/archive`;
  try {
    const res = await api.post(archiveUrl);
    Swal.fire("Success", "File archived successfully", "success");
  } catch (err) {
    Swal.fire("Error", err.response?.data?.error || err.message, "error");
  } 
};


  const currentName =
    state.breadcrumbs[state.breadcrumbs.length - 1]?.name || "Root";

  return (
    <div className={styles.projectDetails}>
      {/* HEADER */}
      <div className={styles.inputDocumentHeader}>

        <button
          onClick={handleBack}
          disabled={state.breadcrumbs.length <= 1}
        className=" flex  p-4 justify-center align-center text-blue-600 text-weight-bold text-2xl"
        >
          ←
        </button>
        {/* <h2>{currentName}</h2> */}
        <div className={styles.inputDocumentHeaderRight}>
                <UploadDropdown setModalStates={setModal} />
            </div>
      </div>

      {/* FOLDERS */}
      <section>
  <h2 className="text-xl font-semibold p-2 text-black">Folders</h2>
  <br />
  <div className="flex flex-wrap gap-4">
    {state.folders.map(folder => (
      <div
        key={folder.uuid}
        className="flex items-center justify-between bg-gray-100 rounded-lg p-3 min-w-0 w-full sm:w-[200px] md:w-[220px] lg:w-[250px] h-[50px] shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-300"
        onClick={() => handleOpenFolder(folder)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <MdFolder className="text-yellow-500 rounded p-1 w-8 h-8" />
          <h3 className="text-gray-700 font-medium truncate">
            {folder.folderName || "Unnamed Folder"}
          </h3>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* FILES */}
  <section>
  <h2 className="text-xl font-semibold p-2">Files</h2>
  <div className="flex flex-wrap gap-4">
    {state.files.map(file => {
  // 1. Strip any leading digits + dash
  const rawName = (file.name || "Unnamed Document").replace(/^[0-9]+-/, "");

  // 2. Truncate if longer than, say, 30 characters
  const MAX = 30;
  const displayName =
    rawName.length > MAX
      ? rawName.slice(0, MAX).trimEnd() + "..."
      : rawName;

  return (
    <div
      key={file.uuid}
      className="flex items-center justify-between bg-gray-100 rounded-lg p-3 w-full sm:w-[300px] shadow-sm hover:shadow-md"
    >
      {/* File icon + name */}
      <div
        onClick={() => handleView(file)}
        className="flex items-center gap-3 min-w-0 cursor-pointer"
      >
        <FaRegFileAlt className="text-yellow-500 w-8 h-8 p-1" />
        <span className="text-gray-700 text-sm truncate">
          {displayName}
        </span>
      </div>

      {/* Download + Archive */}
      <div className="flex gap-2">
        <button
          onClick={() => handleDownload(file)}
          title="Download"
          className="p-2 rounded hover:bg-gray-200 text-blue-600"
        >
          <FaDownload />
        </button>
        <button
          onClick={() => handleArchive(file)}
          title="Archive"
          className="p-2 rounded hover:bg-gray-200 text-red-600"
        >
          <FaArchive />
        </button>
      </div>
    </div>
  );
})}
  </div>
</section>



{/* CREATE FOLDER MODAL */}
{modal.createFolder && (
  <FormModal
    isOpen
    title="Create Folder"

    // 1) Tell FormModal to render a single text field called "folderName"
    fields={[
      {
        name: "folderName",
        label: "Folder Name",
        type: "text",
        placeholder: "Enter folder name",
      },
    ]}

    // 2) Optionally, start with an empty initial value
    initialValues={{ folderName: "" }}

    // 3) When the user submits, FormModal hands you the full values object
    onSubmit={({ folderName }) => handleCreateFolder(folderName)}

    onClose={() => setModal(m => ({ ...m, createFolder: false }))}
    submitLabel="Create"
  />
)}
{/* UPLOAD FILE MODAL */}
{modal.uploadFile && (
  <FormModal
    isOpen
    title="Upload File"
    fields={[{ name: "file", label: "Select File", type: "file" }]}
    initialValues={{ file: null }}
    onSubmit={handleFileUpload}
    onClose={() => setModal(m => ({ ...m, uploadFile: false }))}
    submitLabel="Upload"
  />
)}



      {/* UPLOAD FOLDER MODAL */}
      {modal.uploadFolder && (
        <FormModal
          isOpen
          title="Upload Folder"
          fields={[{
            name: "folderFiles",
            label: "Select Files",
            type: "file",
            multiple: true,
            onChange: e => setSelectedFiles(Array.from(e.target.files)),
          }]}
          onClose={() => setModal(m => ({ ...m, uploadFolder: false }))}
          onSubmit={handleFolderUpload}
          submitLabel="Upload"
          disableSubmit={!selectedFiles.length}
        />
      )}
    </div>
  );
}
