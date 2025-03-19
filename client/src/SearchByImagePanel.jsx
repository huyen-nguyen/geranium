import { useEffect, useMemo, useState } from 'react';
import './SearchByImagePanel.css'

export default function SearchByImagePanel(props) {
  /* eslint-disable react/prop-types */
  const { onUpdate } = props;
  const [inputImage, setInputImage] = useState();

  useEffect(() => {
    if (inputImage) {

      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      const convertToBase64AndUpdate = async (file) => {
        const base = await toBase64(file);
        onUpdate(base);
      };
      convertToBase64AndUpdate(inputImage);
    }
  }, [onUpdate, inputImage]);

  const imagePreview = useMemo(() => {
    if (inputImage) {
      return <img className='image-preview' src={URL.createObjectURL(inputImage)} />
    } else {
      return null;
    }
  }, [inputImage]);

  return (
    <div className='search-by-image-panel'>
      <input type="file" accept="image/*" className='image-upload-button' onChange={(e) => { setInputImage(e.currentTarget.files[0]) }} />
      {inputImage ? <h3>Preview</h3> : null}
      {imagePreview}
    </div>
  );
}
