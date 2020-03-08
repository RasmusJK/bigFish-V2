/* eslint-disable max-len */
import React, {useState} from 'react';
import PropTypes from 'prop-types';

/*
 Need to figure out why CommentList isn't passing the data to this context.
 */

const CommentContext = React.createContext([{}, p => {}]);

const commentArray = [];

const commentObject = {
    allComments: [],
};

const CommentProvider = (props) => {
    console.log('commentProvider props: ', props);
    const [comment, setComment] = useState(commentObject);
    return (
        <CommentContext.Provider value={[comment, setComment]}>
            {props.children}
        </CommentContext.Provider>
    );
};

CommentProvider.propTypes = {
    children: PropTypes.node,
};

export {CommentContext, CommentProvider};
