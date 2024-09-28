import React, { useState } from 'react';
import FileItem from './FileItem';


const initialFiles = [
    { id: 1, name: 'Documents', type: 'folder', children: [] },
    { id: 2, name: 'Pictures', type: 'folder', children: [] },
    { id: 3, name: 'File1.txt', type: 'file', children: null },
    { id: 4, name: 'File2.pdf', type: 'file', children: null },
];

const FileExplorer = () => {
    const [files, setFiles] = useState(initialFiles);
    const [newFileName, setNewFileName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentFolder, setCurrentFolder] = useState(null); // Track the current folder

    const handleCreate = (name, type) => {
        if (!name) return;

        const newFile = { id: Date.now(), name, type, children: type === 'folder' ? [] : null };

        if (currentFolder) {
            const updatedFiles = updateFolder(files, currentFolder.id, newFile);
            setFiles(updatedFiles);
        } else {
            // Add to the root if no folder is open
            setFiles([...files, newFile]);
        }

        setNewFileName('');
    };

    // Helper function to update a folder recursively
    const updateFolder = (fileList, folderId, newFile) => {
        return fileList.map(file => {
            if (file.id === folderId && file.type === 'folder') {
                // Add new file/folder to the folder's children
                return { ...file, children: [...file.children, newFile] };
            } else if (file.type === 'folder' && file.children) {
                // Recursively update folder if it's not the target folder
                return { ...file, children: updateFolder(file.children, folderId, newFile) };
            }
            return file;
        });
    };

    const handleUpdate = (id, newName) => {
        const updateFileRecursively = (fileList) => {
            return fileList.map(file =>
                file.id === id ? { ...file, name: newName } : file.type === 'folder' ? { ...file, children: updateFileRecursively(file.children) } : file
            );
        };

        setFiles(updateFileRecursively(files));
    };

    const handleDelete = (id) => {
        const deleteFileRecursively = (fileList) => {
            return fileList.filter(file => file.id !== id).map(file => ({
                ...file,
                children: file.type === 'folder' ? deleteFileRecursively(file.children) : file.children,
            }));
        };

        setFiles(deleteFileRecursively(files));
    };

    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
    };

    const handleOpenFolder = (folder) => {
        setCurrentFolder(folder);
    };

    const handleBack = () => {
        setCurrentFolder(null);
    };

    const handleDrop = (e, targetFolder) => {
        e.preventDefault();
        const fileId = e.dataTransfer.getData('fileId');
        const draggedFile = files.find(file => file.id === parseInt(fileId));

        if (draggedFile && targetFolder.type === 'folder') {
            const updatedFiles = files
                .filter(file => file.id !== draggedFile.id)
                .map(file => file.id === targetFolder.id
                    ? { ...file, children: [...file.children, draggedFile] }
                    : file
                );
            setFiles(updatedFiles);
        }
    };

    const renderFiles = (fileList) => {
        return fileList.map(file => (
            <FileItem
                key={file.id}
                file={file}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onDrop={handleDrop}
                onOpenFolder={handleOpenFolder}  // New prop for opening folder
            />
        ));
    };

    const getFilesToDisplay = () => {
        if (currentFolder) {
            return currentFolder.children || [];
        }
        return files.filter(file => file.name.toLowerCase().includes(searchTerm));
    };

    return (
        <div className="file-explorer">
            <div className="toolbar">
                <input
                    placeholder="Create new file/folder"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                />
                <button onClick={() => handleCreate(newFileName, 'file')}>New File</button>
                <button onClick={() => handleCreate(newFileName, 'folder')}>New Folder</button>
                <input
                    placeholder="Search files"
                    value={searchTerm}
                    onChange={e => handleSearch(e.target.value)}
                />
                {currentFolder && (
                    <button onClick={handleBack}>Back</button>
                )}
            </div>

            <div className="file-grid">
                {renderFiles(getFilesToDisplay())}
            </div>
        </div>
    );
};

export default FileExplorer;
