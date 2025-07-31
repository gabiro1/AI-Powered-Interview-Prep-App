import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewURL, setPreviewURL] = useState(preview || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      if (setPreview) setPreview(preview);
      setPreviewURL(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewURL('');
    if (setPreview) setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onChooseFile = () => inputRef.current.click();

  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image/*'
        onChange={handleImageChange}
        ref={inputRef}
        className='hidden'
      />

      {!image ? (
        <div
          className='w-20 h-20 flex items-center justify-center bg-orange-50 rounded-full relative cursor-pointer'
          onClick={onChooseFile}
        >
          <LuUser className='text-4xl text-orange-500' />
          <button
            type='button'
            className='w-8 h-8 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full absolute -bottom-1 -right-1'
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={preview || previewURL}
            alt='profile picture'
            className='w-20 h-20 rounded-full object-cover'
          />
          <button
            type='button'
            onClick={handleRemoveImage}
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
