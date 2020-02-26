import React from 'react';
import {Input, Body, Badge, Item, Text} from 'native-base';
import PropTypes from 'prop-types';

const FormTextInput = (props) => {
  const {error, ...otherProps} = props;
  return (
    <Body>
      <Item>
        <Input
          {...otherProps}
        />
      </Item>
      {error &&
      <Badge><Text>{error}</Text></Badge>
      }
    </Body>
  );
};

FormTextInput.propTypes = {
  success: PropTypes.bool,
  error: PropTypes.string,
};

export default FormTextInput;
