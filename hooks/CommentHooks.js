import {useState} from 'react';
import {AsyncStorage} from 'react-native';
import {fetchFormData, fetchGET, fetchPUT, getAllMedia, getUserMedia} from './APIHooks';

const getComments = async (props) => {
    try {
        console.log('getComment props: ', props);

        const token = await AsyncStorage.getItem('userToken');
        const id = props.file;
        const json = await fetchGET('comments/file', id, token);

        /*  json format:
    getComments:  Array []
    commentList props:  Object {
        "file": 601,
    }   */
        /*console.log('jsonComment: ', comment);
        console.log('json: ', json);
        console.log('comment.comment: ', comment.comment);*/
        /*json.forEach(comment => console.log('Comments foreach ', comment.comment));
        const addComment = (data) => {
            //console.log('addComment: ', data);
            comments.push(data.comment)
        };
        */

        console.log('getComment returning value: ', json);
        return json;
    }catch(e){
        console.log('getComments error: ', e);
    }
};

const setComments = () => {
    
};

export{
    setComments,
    getComments
}