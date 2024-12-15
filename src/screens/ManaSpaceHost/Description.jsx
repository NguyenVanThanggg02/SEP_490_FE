import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Stack, Typography, TextField } from '@mui/material';
import { htmlToText } from 'html-to-text';
import React, { useRef } from 'react';

export default function Description({
  spaceInfo,
  setSpaceInfo,
  setIsNotChangeData,
}) {
  const editorRef = useRef(null);
  const initialDescriptionRef = useRef({
    description: spaceInfo?.description || '',
    area: spaceInfo?.area || '',
  });

  console.log('initialDescriptionRef', initialDescriptionRef);

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setIsNotChangeData(false);
    setSpaceInfo((prev) => ({
      ...prev,
      area: value,
    }));
  };

  return (
    <Stack spacing={2}>
      <Typography
        variant="h6"
        style={{
          fontWeight: 700,
          fontSize: '20px',
          paddingBottom: '10px',
        }}
        fullWidth
      >
        Mô tả
      </Typography>
      <CKEditor
        ref={editorRef}
        editor={ClassicEditor}
        data={initialDescriptionRef.current.description}
        onChange={(event, editor) => {
          const data = editor.getData();
          const plainText = htmlToText(data); // Convert HTML to plain text
          setIsNotChangeData(false);
          setSpaceInfo((prev) => ({
            ...prev,
            description: plainText, // Save as plain text
          }));
        }}
        onInit={(editor) => {
          editor.editing.view.change((writer) => {
            writer.setStyle(
              'height',
              '300px',
              editor.editing.view.document.getRoot()
            );
          });
        }}
        config={{
          toolbar: [
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
          ],
        }}
      />
    <Typography
        variant="h6"
        style={{
          fontWeight: 700,
          fontSize: '20px',
          paddingBottom: '10px',
        }}
        fullWidth
      >
        Diện tích
      </Typography>
      <TextField
        label="Diện tích (m²)"
        variant="outlined"
        fullWidth
        value={spaceInfo?.area || ''}
        onChange={handleAreaChange}
      />
    </Stack>
  );
}
