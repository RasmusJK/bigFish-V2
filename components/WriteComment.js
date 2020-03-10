import React, {useState, useEffect, useContext} from 'react';
import {
    Content,
    Form,
    Button,
    Text,
    Item,
    Spinner,
} from 'native-base';

import PropTypes from 'prop-types';
import FormTextInput from '../components/FormTextInput';
import useUploadForm from '../hooks/UploadHooks';
import {commentConstraints} from '../constants/validationConst';
import {validateField} from "../utils/validation";
import uploadComment from '../hooks/CommentHooks';

const WriteComment = (props) => {
    const [send, setSend] = useState(false);
    const [comment, setComment] = useState({});

    const {
        handleCommentChange,
        handleCommentUpload,
        inputs,
        errors,
        setErrors,
        setInputs,
        loading,
    } = useUploadForm();

    const validationProperties = {
        text: {text: inputs.text},
    };

    const validate = (field, value) => {
        console.log('validation Properties: ', validationProperties[field]);
        setErrors(()=>({
            ...errors,
            [field]: validateField({[field]: value},
                commentConstraints),
            fetch: undefined,
        }));
    };

    const reset = () => {
        setErrors({});
        setInputs({});
    };

    const handleComment = (text) => {
        handleCommentChange(text);
        validate('text', text);
    };

    const checkErrors = () => {
        console.log('errors', errors);
        if (errors.text !== undefined) {
            setSend(false);
        } else {
            setSend(true);
        }
    };

    useEffect(()=> {
       checkErrors();
    },[errors]);

    console.log('send comment', send);

    const upload = () => {
        console.log('reg field errors', errors);
        uploadComment();
        reset();
    };

    useEffect(() => {
        checkErrors();
    }, [errors]);

    console.log('send', send);

    return (
        <Content>
            {loading ? (
                <Spinner/>
            ) : (
                <Form>
                    <Item>
                        <FormTextInput
                            placeholder='Write here'
                            onChangeText={handleComment}
                            value={inputs.comment}
                        />
                    </Item>
                    {send &&
                    <Button full onPress={upload}>
                        <Text>Upload</Text>
                    </Button>
                    }
                </Form>
            )}
        </Content>
    );
};

// proptypes here
WriteComment.propTypes = {
    navigation: PropTypes.object,
};

export default WriteComment;
