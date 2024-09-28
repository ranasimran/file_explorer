import React, { useState } from 'react';
import { FaFolder, FaFileAlt } from 'react-icons/fa';

const FileItem = ({ file, onUpdate, onDelete, onDrop, onOpenFolder }) => {
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState(file.name);

    const handleUpdate = () => {
        onUpdate(file.id, newName);
        setEditMode(false);
    };

    const handleDragStart = (e) => {
        e.dataTransfer.setData('fileId', file.id);
    };

    const handleDoubleClick = () => {
        if (file.type === 'folder') {
            onOpenFolder(file);
        }
    };

    return (
        <div
            className="file-item"
            draggable
            onDragStart={handleDragStart}
            onDrop={(e) => onDrop(e, file)}
            onDragOver={(e) => e.preventDefault()}
            onDoubleClick={handleDoubleClick}
        >
            {file.type === 'folder' ? <FaFolder size={50} color="#FFD700" /> : <FaFileAlt size={50} />}

            {editMode ? (
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleUpdate}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                />
            ) : (
                <div className="file-name">
                    {file.name}
                </div>
            )}
            <div className="file-actions">
                <button onClick={() => setEditMode(true)}>Rename</button>
                <button onClick={() => onDelete(file.id)}>Delete</button>
            </div>
        </div>
    );
};

export default FileItem;
