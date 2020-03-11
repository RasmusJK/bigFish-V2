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
  //Function to handling title change
  const handleTitleChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        title: text,
      }));
  };
  //Function to handling description change
  const handleDescriptionChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        description: text,
      }));
  };
  //Function to handle tag change
  const handleTagChange = (text) => {
    setInputs((inputs) =>
        ({
          ...inputs,
          tag: text,
        }));
  };

  //Function to upload new media/pictures with metadata and description. Setting the app Tag for the post
  const handleUpload = async (file, navigation, setMedia,tag) => {
    const filename = file.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    // fix jpg mimetype
    if (type === 'image/jpg') {
      type = 'image/jpeg';
    }
    const moreData = {
      description: inputs.description,
      latitude: file.exif.GPSLatitude,
      longitude: file.exif.GPSLongitude
      };

    console.log('lokaatiola', {latitude: file.exif.GPSLatitude});

    const fd = new FormData();
    fd.append('title', inputs.title);
    fd.append('description', JSON.stringify(moreData)); //inputs.description
    fd.append('file', {uri: file.uri, name: filename, type});

    console.log('FD:', fd);

    try {
      const token = await AsyncStorage.getItem('userToken');


      const resp = await fetchFormData('media', fd, token);

      console.log('upl resp test tästä saa id ', resp.file_id);
      if (resp.message) {
        console.log('token',token);
        handleTag(resp.file_id, tag,token);
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

  //Function to handle modifications to existing postings
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

  //Function to handle the apps Tag so it shows only the posts from this app
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
    handleTagChange,
    inputs,
    errors,
    loading,
    setErrors,
    setInputs,
  };
};

export default useUploadForm;
