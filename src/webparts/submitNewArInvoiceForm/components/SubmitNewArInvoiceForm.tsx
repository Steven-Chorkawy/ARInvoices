import * as React from 'react';
import styles from './SubmitNewArInvoiceForm.module.scss';
import { ISubmitNewArInvoiceFormProps } from './ISubmitNewArInvoiceFormProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';


export default class SubmitNewArInvoiceForm extends React.Component<ISubmitNewArInvoiceFormProps, {}> {
  public render(): React.ReactElement<ISubmitNewArInvoiceFormProps> {

    const handleSubmit = (dataItem) => alert(JSON.stringify(dataItem, null, 2));

    return (
      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ width: 400 }}>
            <fieldset className={'k-form-fieldset'}>
              <legend className={'k-form-legend'}>Create New AR Invoice</legend>
              <Field
                id={'Title'}
                name={'Title'}
                label={'Title'}
                component={TextField}
              // validator={nameValidator}
              />
              <Field
                id={'Invoice_x0020_Number'}
                name={'Invoice_x0020_Number'}
                label={'Invoice Number'}
                // mask={'(999) 000-00-00-00'}
                // hint={'Hint: Your active phone number.'}
                component={TextField}
              // validator={phoneValidator}
              />

              <div className="k-form-buttons">
                <Button
                  primary={true}
                  type={'submit'}
                  disabled={!formRenderProps.allowSubmit}
                >Submit AR Invoice</Button>
                <Button onClick={formRenderProps.onFormReset}>Clear</Button>
              </div>
            </fieldset>
          </FormElement>
        )}
      />
    );
  }
}
