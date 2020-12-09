import * as React from 'react';
import {
  Container, Form, Button
} from 'semantic-ui-react';

export function ImageForm({handleClose, onChange, value}) {
    return (
        <Form onSubmit={handleClose}>
            <Form.Field
            required
            name="Image URL"
            label="Image URL"
            placeholder="Enter image URL"
            control="input"
            type="text"
            value={value}
            onChange={onChange}
                />
            <Button positive type="submit">Submit</Button>
        </Form>
    )
}