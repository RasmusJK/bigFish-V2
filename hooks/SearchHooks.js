import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {getTaggedMedia} from './APIHooks';

//const token = await AsyncStorage.getItem('userToken');



const searchGet = async(search,tag) => {
  const allMedia = await getTaggedMedia(tag);
  const searchData = search.toLowerCase();
  let searchResults = [];
  allMedia.forEach(file => {
    const lowerTitle = file.title.toLowerCase();
    if (lowerTitle.includes(searchData)){
      console.log('search result: ', file);
      searchResults.push(file);
    }
  });
  return searchResults;
};

export {searchGet};


