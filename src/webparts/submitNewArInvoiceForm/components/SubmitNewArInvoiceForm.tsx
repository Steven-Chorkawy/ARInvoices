import * as React from 'react';
import { ISubmitNewArInvoiceFormProps } from './ISubmitNewArInvoiceFormProps';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { MyLists } from '../../../enums/MyLists';
import * as MyFormComponents from '../../../components/MyFormComponents';


import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class SubmitNewArInvoiceForm extends React.Component<ISubmitNewArInvoiceFormProps, {}> {
  public render(): React.ReactElement<ISubmitNewArInvoiceFormProps> {

    const handleSubmit = (dataItem) => {
      alert(JSON.stringify(dataItem, null, 2));
      sp.web.lists.getByTitle(MyLists['AR Invoice Requests']).items.add(dataItem).then(value => {
        alert('It worked!');
        this.props.submitCallback && this.props.submitCallback();
      });
    };

    return (
      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 1200 }}>
            <fieldset className={'k-form-fieldset'}>
              <legend className={'k-form-legend'}>Create New AR Invoice</legend>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <FieldWrapper>
                  {/* <Field
                    id="Requested_x0020_By"
                    name="Requested_x0020_By"
                    label="Requested By"
                    wrapperStyle={{ width: '100%' }}
                    context={this.props.context}
                    userEmail={this.props.context.pageContext.user.email}
                    component={MyFormComponents.FormPersonaDisplay}
                  /> */}
                </FieldWrapper>
                {/* <Field
                  id={'Date'}
                  name={'Date'}
                  label={'* Date'}
                  component={MyFormComponents.FormDatePicker}
                  //validator={MyValidators.dateValidator}
                  wrapperStyle={{ width: '50%' }}
                /> */}
              </div>

              {/* <Field
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
              /> */}

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
