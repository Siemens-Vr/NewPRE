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

// ─── ACTIONS & REDUCER ────────────────────────────────────────────────────────
const ACTIONS = {
  SET_VIEW:    "SET_VIEW",
  OPEN_FOLDER: "OPEN_FOLDER",
  BACK:        "BACK",
  ADD_FOLDER:  "ADD_FOLDER",
  ADD_FILE:    "ADD_FILE",
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
        breadcrumbs: [...state.breadcrumbs, { id: payload.id, name: payload.name }],
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
      return { ...state, folders: [...state.folders, payload] };

    case ACTIONS.ADD_FILE:
      return { ...state, files: [...state.files, payload] };

    default:
      return state;
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Modals for create/upload & archive
  const [modal, setModal] = useState({
    createFolder: false,
    uploadFile:   false,
    uploadFolder: false,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Archive modal
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveTarget, setArchiveTarget]     = useState(null);
  const [archiveType, setArchiveType]         = useState("file"); // or "folder"

  const archiveFields = [
    {
      name: "reason",
      label: "Reason for archiving",
      type: "select",
      options: [
        { value: "No longer relevant", label: "No longer relevant" },
        { value: "Duplicate entry",      label: "Duplicate entry" },
        { value: "Incorrect data",       label: "Incorrect data" },
        { value: "Other",                label: "Other" },
      ],
    },
  ];

  // ─── LOAD FOLDER ─────────────────────────────────────────────────────────────
  const loadFolder = async (targetId, isRoot = false, name = "Root") => {
    try {
      if (isRoot) {
        const res = await api.get(`/cost_cat/${targetId}`);
        const { folders, documents } = res.data.data;
        dispatch({
          type: ACTIONS.SET_VIEW,
          payload: { id: targetId, name, folders, documents, reset: true },
        });
      } else {
        const resFiles = await api.get(`/cost_cat/files/${targetId}`);
        dispatch({
          type: ACTIONS.SET_VIEW,
          payload: {
            id: targetId,
            name,
            folders: [],
            documents: resFiles.data,
            reset: false,
          },
        });
        dispatch({
          type: ACTIONS.OPEN_FOLDER,
          payload: { id: targetId, name },
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  useEffect(() => {
    if (id) loadFolder(id, true, "Root");
  }, [id]);

  const handleOpenFolder = (f) =>
    loadFolder(f.uuid, false, f.folderName);

  const handleBack = () => dispatch({ type: ACTIONS.BACK });

  // ─── CREATE FOLDER ───────────────────────────────────────────────────────────
  const handleCreateFolder = async (values) => {
    const folderName = values.folderName?.trim();
    if (!folderName) return;
    try {
      const res = await api.post(`/cost_cat/${state.currentId}`, { folderName });
      dispatch({ type: ACTIONS.ADD_FOLDER, payload: res.data });
      setModal(m => ({ ...m, createFolder: false }));
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || err.message, "error");
    }
  };

  // ─── UPLOAD SINGLE FILE ──────────────────────────────────────────────────────
  const handleFileUpload = async (values) => {
    const file = values.file;
    if (!file) return;
    const fd = new FormData();
    fd.append("cost_category", file);
    try {
      const res = await api.post(
        `/cost_cat/file/${state.currentId}`, fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      dispatch({ type: ACTIONS.ADD_FILE, payload: res.data.newFile });
      setModal(m => ({ ...m, uploadFile: false }));
      await loadFolder(
        state.currentId,
        state.breadcrumbs.length === 1,
        state.breadcrumbs[state.breadcrumbs.length - 1].name
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.error || err.message, "error");
    }
  };

  // ─── UPLOAD MULTIPLE FILES ───────────────────────────────────────────────────
  const handleFolderUpload = async () => {
    for (const f of selectedFiles) {
      const fd = new FormData();
      fd.append("cost_category", f);
      try {
        const res = await api.post(`/cost_cat/${state.currentId}`, fd);
        dispatch({ type: ACTIONS.ADD_FILE, payload: res.data.newFile });
      } catch (err) {
        console.error(err);
      }
    }
    setModal(m => ({ ...m, uploadFolder: false }));
    setSelectedFiles([]);
  };

  // ─── VIEW & DOWNLOAD ─────────────────────────────────────────────────────────
  const handleView = (file) => {
    const url = `${api.defaults.baseURL}/uploads/cost_category/${file.name}`;
    window.open(url, "_blank", "noopener");
  };
  const handleDownload = (file) => {
    const url = `${api.defaults.baseURL}/download/uploads/cost_category/${file.name}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ─── ARCHIVE ─────────────────────────────────────────────────────────────────
  const handleArchive = async (values) => {
    setShowArchiveModal(false);
    const reason = values.reason;
    if (!archiveTarget) return;
    try {
      if (archiveType === "file") {
        await api.post(
          `/uploads/cost_category/file/${archiveTarget.uuid}/archive`,
          { reason }
        );
      } else {
        await api.post(
          `/cost_cat/${state.currentId}/archive`,
          { folderId: archiveTarget.uuid, reason }
        );
      }
      Swal.fire("Success", `${archiveType} archived`, "success");
      // reload
      const bc   = state.breadcrumbs;
      const name = bc[bc.length - 1]?.name || "Root";
      await loadFolder(state.currentId, bc.length === 1, name);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.error || err.message, "error");
    }
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  const currentName = state.breadcrumbs[state.breadcrumbs.length - 1]?.name || "Root";

  return (
    <div className={styles.projectDetails}>
      {/* HEADER */}
      <div className={styles.inputDocumentHeader}>
        <button
          onClick={handleBack}
          disabled={state.breadcrumbs.length <= 1}
          className="flex p-4 justify-center items-center text-blue-600 font-bold text-2xl"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">{currentName}</h2>
        <div className={styles.inputDocumentHeaderRight}>
        <UploadDropdown setModalStates={setModal} />
        </div>
      </div>

      {/* FOLDERS */}
      <section>
        <h3 className="text-xl font-semibold p-2">Folders</h3>
        <div className="flex flex-wrap gap-4">
          {state.folders.map(folder => (
            <div
              key={folder.uuid}
              className="flex items-center justify-between bg-gray-100 rounded-lg p-3 min-w-0 w-full sm:w-[200px] md:w-[220px] lg:w-[250px] h-[50px] shadow-sm hover:shadow-md cursor-pointer hover:bg-gray-300"
              onClick={() => handleOpenFolder(folder)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <MdFolder className="text-yellow-500 w-8 h-8 p-1" />
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
        <h3 className="text-xl font-semibold p-2">Files</h3>
        <div className="flex flex-wrap gap-4">
          {state.files.map(file => {
            const rawName = (file.name || "Unnamed Document").replace(/^[0-9]+-/, "");
            const MAX = 30;
            const displayName =
              rawName.length > MAX ? rawName.slice(0, MAX).trimEnd() + "..." : rawName;

            return (
              <div
                key={file.uuid}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-3 w-full sm:w-[300px] shadow-sm hover:shadow-md"
              >
                <div
                  onClick={() => handleView(file)}
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                >
                  <FaRegFileAlt className="text-yellow-500 w-8 h-8 p-1" />
                  <span className="text-gray-700 text-sm truncate">
                    {displayName}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(file)}
                    title="Download"
                    className="p-2 rounded hover:bg-gray-200 text-blue-600"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => {
                      setArchiveType("file");
                      setArchiveTarget(file);
                      setShowArchiveModal(true);
                    }}
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

      {/* MODALS */}
      {modal.createFolder && (
        <FormModal
          isOpen
          title="Create Folder"
          fields={[
            { name: "folderName", label: "Folder Name", type: "text", placeholder: "Enter folder name" },
          ]}
          initialValues={{ folderName: "" }}
          onSubmit={handleCreateFolder}
          onClose={() => setModal(m => ({ ...m, createFolder: false }))}
          submitLabel="Create"
        />
      )}

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
          onSubmit={handleFolderUpload}
          onClose={() => setModal(m => ({ ...m, uploadFolder: false }))}
          submitLabel="Upload"
          disableSubmit={!selectedFiles.length}
        />
      )}

      {showArchiveModal && (
        <FormModal
          isOpen
          title={`Archive ${archiveType}`}
          fields={archiveFields}
          initialValues={{ reason: "" }}
          onSubmit={handleArchive}
          onClose={() => setShowArchiveModal(false)}
          extraActions={[]}
        />
      )}
    </div>
  );
}
