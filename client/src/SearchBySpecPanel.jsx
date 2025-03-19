import { useEffect, useMemo, useState } from 'react';

export default function SearchBySpecPanel(props) {
  /* eslint-disable react/prop-types */
  const { onUpdate } = props;
  const [inputSpec, setInputSpec] = useState();

  useEffect(() => {
    if (inputSpec) {
      // do something
    }
  }, [onUpdate, inputSpec]);

  const specPreview = useMemo(() => {
    if (inputSpec) {
      return null
    } else {
      return null;
    }
  }, [inputSpec]);

  return (
    <div className='search-by-image-panel'>
      <input type="file" accept="application/JSON" className='image-upload-button' onChange={(e) => { setInputSpec(e.currentTarget.files[0]) }} />
      {inputSpec ? <h3>Preview</h3> : null}
      {specPreview}
    </div>
  );
}
