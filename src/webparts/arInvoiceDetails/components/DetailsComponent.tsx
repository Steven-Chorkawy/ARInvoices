import * as React from 'react';
// PnP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Kendo Imports. 
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { filterBy } from '@progress/kendo-data-query';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';
import { Button } from '@progress/kendo-react-buttons';

/**
 * This class displays the generic invoice metadata. 
 */
export default class DetailsComponent extends React.Component<any, any> {
    constructor(props) {
        super(props);

    }

    public render() {
        return (
            <div>

            </div>
        );
    }
}