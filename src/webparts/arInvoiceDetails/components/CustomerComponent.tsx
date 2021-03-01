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
import { IARInvoice } from '../../../interfaces/IARInvoice';
import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';
import * as MyValidator from '../../../MyHelperMethods/Validators';
import * as MyFormComponents from '../../../components/MyFormComponents';
import { MyLists } from '../../../enums/MyLists';


/**
 * This class displays the generic invoice metadata. 
 */
export class CustomerComponent extends React.Component<IArInvoiceSubComponentProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            showCustomerDropDown: this.props.invoice.CustomerId !== null,
            displayCustomerList: undefined,
            allCustomerList: undefined
        };

        sp.web.lists.getByTitle(MyLists.Customers).items.getAll().then(values => {
            this.setState({
              allCustomerList: values,
              displayCustomerList: values
            });
          });
    }

    //#region Customer Field Methods
    /**
       * Render each customer item.
       * @param li List Item Element
       * @param itemProps List Item Props
       */
    private customerItemRender = (li, itemProps) => {
        return React.cloneElement(li, li.props, <span>{itemProps.dataItem.Title} | {itemProps.dataItem.Mailing_x0020_Address}</span>);
    }

    private customerFilterChange = e => {
        setTimeout(() => {
            this.setState({
                displayCustomerList: filterBy(this.state.allCustomerList.slice(), e.filter)
            });
        }, 500);
    }
    //#endregion

    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Customer Details</b></CardTitle>
                    {
                        this.props.inEditMode ?
                            <div>
                                {
                                    this.state.showCustomerDropDown ?
                                        <FieldWrapper>
                                            <Field
                                                id="Customer"
                                                name="Customer"
                                                label="* Customer"
                                                wrapperStyle={{ width: '100%' }}
                                                data={this.state.displayCustomerList}
                                                dataItemKey="Id"
                                                textField="Title"
                                                validator={MyValidator.requiresCustomer}
                                                allowCustom={false}
                                                itemRender={this.customerItemRender}
                                                component={MyFormComponents.FormComboBox}
                                                filterable={true}
                                                suggest={true}
                                                onFilterChange={this.customerFilterChange}
                                                onChange={e => {
                                                    this.props.formRenderProps.onChange('CustomerId', { value: e.value ? e.value.Id : undefined });
                                                    this.props.formRenderProps.onChange('Title', { value: e.value ? `AR Invoice: ${e.value.Title}` : undefined });
                                                }}
                                            />
                                        </FieldWrapper> :
                                        <div>
                                            <FieldWrapper>
                                                <Field
                                                    id="Customer_x0020_Name"
                                                    name="Customer_x0020_Name"
                                                    label="* Customer Name"
                                                    validator={MyValidator.requireCustomerName}
                                                    component={MyFormComponents.FormInput}
                                                    onChange={e => {
                                                        this.props.formRenderProps.onChange('Title', { value: e.value ? `AR Invoice: ${e.value}` : undefined });
                                                    }}
                                                />
                                            </FieldWrapper>
                                            <FieldWrapper>
                                                <Field
                                                    id="Customer_x0020_Details"
                                                    name="Customer_x0020_Details"
                                                    label="Customer Details"
                                                    component={MyFormComponents.FormTextArea}
                                                />
                                            </FieldWrapper>
                                        </div>
                                }
                                <p
                                    style={{ cursor: 'pointer' }}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.setState(
                                            { showCustomerDropDown: !this.state.showCustomerDropDown },
                                            () => {
                                                this.props.formRenderProps.onChange('Title', { value: this.props.invoice.Title });
                                                if (this.state.showCustomerDropDown) {
                                                    // Remove Customer Name and Details field. 
                                                    this.props.formRenderProps.onChange('Customer_x0020_Name', { value: undefined });
                                                    this.props.formRenderProps.onChange('Customer_x0020_Details', { value: undefined });
                                                }
                                                else {
                                                    // Remove the Customer field. 
                                                    this.props.formRenderProps.onChange('Customer', { value: undefined });
                                                    this.props.formRenderProps.onChange('CustomerId', { value: null });
                                                }
                                            }
                                        );
                                    }}
                                >Click to {this.state.showCustomerDropDown ? 'manually enter customer details.' : 'search for customers.'}</p>
                            </div> :
                            <div className='row'>
                                <div className='col-md-5'>
                                    <Label>Name:</Label>
                                    {
                                        this.props.invoice.Customer ?
                                            <p>{this.props.invoice.Customer.Title}</p> :
                                            <p>{this.props.invoice.Customer_x0020_Name}</p>
                                    }
                                </div>
                                <div className='col-md-6'>
                                    <Label>Details:</Label>
                                    {
                                        this.props.invoice.Customer ?
                                            <p>{this.props.invoice.Customer.Mailing_x0020_Address}</p> :
                                            <p>{this.props.invoice.Customer_x0020_Details}</p>
                                    }
                                </div>
                            </div>
                    }
                </CardBody>
            </Card>
        );
    }
}