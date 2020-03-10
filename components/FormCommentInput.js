import React from 'react';
import {Input, Body, Badge, Item, Text, Container, Header, Content} from 'native-base';
import PropTypes from 'prop-types';

const FormCommentInput = (props) => {
    const {error, ...otherProps} = props;
    return (
        <Body>
            <Container>
                <Header/>
                <Content>
                    <Item regular>
                        <Input
                            {...otherProps}
                        />
                    </Item>
                </Content>
            </Container>
            {error &&
            <Badge><Text>{error}</Text></Badge>
            }
        </Body>
    );
};

FormCommentInput.propTypes = {
    success: PropTypes.bool,
    error: PropTypes.string,
};

export default FormCommentInput;
