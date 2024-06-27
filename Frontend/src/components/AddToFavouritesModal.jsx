import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { FaTimes } from 'react-icons/fa';
import Box from '@mui/material/Box';

export default function AddToFavouritesModal({ isOpen, onClose, onAdd }) {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '8px',
    cursor: 'pointer',
   
  };
  
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Box sx={modalStyle}>
          <div style={closeButtonStyle} onClick={onClose}>
            <FaTimes  />
          </div>
          <h2 id="modal-modal-title">Add to Favorites</h2>
          <p id="modal-modal-description">Do you want to add this item to your favorites?</p>
          <Button variant="contained" onClick={onAdd} sx={{ mr: 2 }}>
            Yes
          </Button>
          <Button variant="contained" onClick={onClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
