import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {
  fetchFormData,
  fetchPOST,
  fetchPUT,
  getAllMedia,
  getUserMedia,
} from './APIHooks';

const useUploadForm = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        title: text,
      }));
  };

  const handleDescriptionChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        description: text,
      }));
  };

  const handleUpload = async (file, navigation, setMedia, longitude, latitude) => {
    const filename = file.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    // fix jpg mimetype
    if (type === 'image/jpg') {
      type = 'image/jpeg';
    }
    const moreData = {
      description: inputs.description,
      longitude: longitude,
      latitude: latitude
    }
    console.log('moredata', moreData);

    const fd = new FormData();
    fd.append('title', inputs.title);
    fd.append('description', inputs.description);
    fd.append('file', {uri: file.uri, name: filename, type});

    console.log('FD:', fd);

    try {
      const token = await AsyncStorage.getItem('userToken');


      const resp = await fetchFormData('media', fd, token);

      console.log('upl resp test tästä saa id ', resp.file_id);
      if (resp.message) {
        console.log('token',token);
        handleTag(resp.file_id, 'fishforum',token);
        const data = await getAllMedia();
        setMedia((media) =>
          ({
            ...media,
            allFiles: data,
          }));
        setLoading(false);
        navigation.push('Home');
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleModify = async (id, navigation, setMedia) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const resp = await fetchPUT('media', id, inputs, token);
      console.log('upl resp', resp);
      if (resp.message) {
        const data = await getUserMedia(token);
        setMedia((media) =>
          ({
            ...media,
            myFiles: data,
          }));
        setLoading(false);
        navigation.pop();
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const handleTag = async (file_id,tag,token) =>{
    try {

      const resp = await fetchPOST('tags',{file_id,tag},token);
      console.log('tag resp',resp);

    }catch (e) {
      console.log(e.message);
    }
  };

  return {
    handleTitleChange,
    handleDescriptionChange,
    handleUpload,
    handleModify,
    inputs,
    errors,
    loading,
    setErrors,
    setInputs,
  };
};

export default useUploadForm;
