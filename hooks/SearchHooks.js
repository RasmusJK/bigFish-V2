//Gets all posts with tag then checks if search matches with title.
import {getTaggedMedia} from './APIHooks';

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


