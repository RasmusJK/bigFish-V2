import { useState } from "react";
import validate from 'validate.js';

const useCommentForm = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});

    const handleCommentChange = text => {
        setInputs(inputs => ({
            ...inputs,
            comment: text
        }));
    };

    return {
        handleCommentChange,
        inputs
    };
};

export default useCommentForm;