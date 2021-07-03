import React from 'react';
import { DropzoneDialog } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';

export const DropZoneDialog = ({isOpen}) => {
  return (
    <div>
      <DropzoneDialog
        open={isOpen}
        // onSave={this.handleSave.bind(this)}
        acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
        showPreviews={false}
        maxFileSize={5000000}
        onClose={!isOpen}
      />
    </div>
  );
};

