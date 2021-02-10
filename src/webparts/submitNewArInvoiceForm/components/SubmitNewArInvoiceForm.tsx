import * as React from 'react';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { MyLists } from '../../../enums/MyLists';
import * as MyFormComponents from '../../../components/MyFormComponents';
import { GetChoiceFieldValues } from '../../../MyHelperMethods/HelperMethods';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface ISubmitNewArInvoiceFormProps {
  description?: string;
  context: any;
  submitCallback?: any;
}

export interface ISubmitNewArInvoiceFormState {
  departments?: any[];
  standardTerms?: any[];
}

export default class SubmitNewArInvoiceForm extends React.Component<ISubmitNewArInvoiceFormProps, ISubmitNewArInvoiceFormState> {

  constructor(props) {
    super(props);

    this.state = {
      departments: undefined,
      standardTerms: undefined
    };

    GetChoiceFieldValues(MyLists["AR Invoice Requests"], 'Department').then(values => {
      this.setState({ departments: values });
    });

    GetChoiceFieldValues(MyLists['AR Invoice Requests'], 'Standard_x0020_Terms').then(values => {
      this.setState({ standardTerms: values });
    });
  }

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
        initialValues={{
          Date: new Date(),
          Urgent: false,
          Standard_x0020_Terms: 'NET 30, 1% INTEREST CHARGED',
          // GLAccounts: [],
          // Department: this.state.currentUser && this.state.currentUser.Props['SPS-Department'],     
        }}
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 1200 }}>
            <fieldset className={'k-form-fieldset'}>
              <b><legend className={'k-form-legend'}>Create New AR Invoice</legend></b>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <FieldWrapper>
                  <Field
                    id="Requested_x0020_By"
                    name="Requested_x0020_By"
                    label="Requested By"
                    wrapperStyle={{ width: '100%' }}
                    context={this.props.context}
                    userEmail={this.props.context.pageContext.user.email}
                    component={MyFormComponents.FormPersonaDisplay}
                  />
                </FieldWrapper>
                <Field
                  id={'Date'}
                  name={'Date'}
                  label={'* Date'}
                  component={MyFormComponents.FormDatePicker}
                  //validator={MyValidators.dateValidator}
                  wrapperStyle={{ width: '50%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Field
                  id="Department"
                  name="Department"
                  label="* Department"
                  wrapperStyle={{ width: '45%' }}
                  data={this.state.departments ? this.state.departments : []}
                  //validator={MyValidators.departmentValidator}
                  component={MyFormComponents.FormDropDownList}
                />
                <Field
                  id="Urgent"
                  name="Urgent"
                  label="Urgent"
                  onLabel="Yes"
                  offLabel="No"
                  wrapperStyle={{ width: '50%' }}
                  labelPlacement={'before'}
                  component={MyFormComponents.FormCheckbox}
                  hint={'Flag emails as high priority.'}
                />
              </div>


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
