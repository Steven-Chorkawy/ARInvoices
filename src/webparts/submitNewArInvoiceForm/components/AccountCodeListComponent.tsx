import * as React from 'react';

import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { Card, CardTitle, CardSubtitle, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Checkbox, MaskedTextBox, NumericTextBox } from '@progress/kendo-react-inputs';
import { Label, Error, Hint, FloatingLabel } from '@progress/kendo-react-labels';

import { IAccount } from '../../../interfaces/IARInvoice';
import IDataOperations from '../../../interfaces/IDataOperations';
import * as MyValidator from '../../../MyHelperMethods/Validators';
import * as MyFormComponents from '../../../components/MyFormComponents';


import { Field, FieldWrapper, FormElement } from '@progress/kendo-react-form';
import { Fields } from '@pnp/sp/fields';

//#region Interfaces
interface IAccountCodeListComponent extends IDataOperations {
    data: any;
    inEditMode?: boolean;
}

interface IAccountCodeItemProps extends IAccountCodeListComponent {
    dataItem: IAccount;
    index: number;
    field: string;

}

interface IAccountCodeItemState {
    item: IAccount;
}


//#endregion

//#region Component Methods
const MyHeader = (props) => {
    return (
        <ListViewHeader style={{ color: 'rgb(160, 160, 160)', fontSize: 14 }} className='pl-3 pb-2 pt-2'>
            {
                props.onAdd &&
                <Button
                    look='flat'
                    icon='plus'
                    primary={true}
                    onClick={e => {
                        e.preventDefault();
                        props.onAdd();
                    }}
                >Add New Account</Button>
            }
        </ListViewHeader>
    );
};
//#endregion

class AccountCodeItem extends React.Component<IAccountCodeItemProps, IAccountCodeItemState> {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.dataItem
        };
    }

    /**
     * If HST_x0020_Taxable is TRUE:    return e.item.Amount * 0.13
     * If HST_x0020_Taxable is FALSE:   return 0
     */
    private _calculateHSTAmount = e => {
        return (e.item.HST_x0020_Taxable === true) ? e.item.Amount * 0.13 : 0;
    }

    public render() {
        return (
            <Card>
                <CardBody>
                    <div className={'row'}>
                        <div className={'col-md-10'} style={{ paddingRight: '0px' }}>
                            {
                                (this.props.inEditMode || this.props.dataItem.ID === undefined) ?
                                    <div>
                                        <Field
                                            name={`Accounts[${this.props.index}].Account_x0020_Code`}
                                            component={MyFormComponents.FormMaskedTextBox}
                                            mask="000-00-000-00000-0000"
                                            validator={MyValidator.glCodeValidator}
                                            required={true}
                                            label={'Account Code'}
                                        />
                                        <Field
                                            name={`Accounts[${this.props.index}].Amount`}
                                            component={MyFormComponents.FormNumericTextBox}
                                            required={true}
                                            format="c2"
                                            min={0}
                                            validator={MyValidator.required}
                                            label={'Amount'}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <FieldWrapper>
                                                <Label>Apply HST</Label>
                                                <Field
                                                    name={`Accounts[${this.props.index}].HST_x0020_Taxable`}
                                                    component={MyFormComponents.FormCheckbox}
                                                />
                                            </FieldWrapper>
                                            <FieldWrapper>
                                                <Label style={{ alignItems: 'baseline' }}>HST</Label>
                                                <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) : 0)}</p>
                                            </FieldWrapper>
                                            <FieldWrapper>
                                                <Label style={{ alignItems: 'baseline' }}>Total</Label>
                                                <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) + this.state.item.Amount : 0)}</p>
                                            </FieldWrapper>
                                        </div>
                                    </div> :
                                    <div>
                                        <FieldWrapper>
                                            <Label>Account Codes</Label>
                                            <p>{this.state.item.Account_x0020_Code}</p>
                                        </FieldWrapper>
                                        <FieldWrapper>
                                            <Label>Amount</Label>
                                            <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount)}</p>
                                        </FieldWrapper>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <FieldWrapper>
                                                <Label>Apply HST</Label>
                                                <p>{this.state.item.HST_x0020_Taxable ? "Yes" : "No"}</p>
                                            </FieldWrapper>
                                            <FieldWrapper>
                                                <Label style={{ alignItems: 'baseline' }}>HST</Label>
                                                <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) : 0)}</p>
                                            </FieldWrapper>
                                            <FieldWrapper>
                                                <Label style={{ alignItems: 'baseline' }}>Total</Label>
                                                <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.state.item.Amount ? this._calculateHSTAmount(this.state) + this.state.item.Amount : 0)}</p>
                                            </FieldWrapper>
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className={'col-md-1'} style={{ paddingRight: '0px' }}>
                            {
                                this.props.onDelete && this.props.dataItem.ID &&
                                <Button icon={'delete'} look={'flat'} title={'Delete'}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.props.onDelete({ invoice: this.props.dataItem, dataIndex: this.props.index });
                                    }}
                                />
                            }
                            {
                                (this.props.onRemove && this.props.dataItem.ID === undefined) &&
                                <Button icon={'close'} look={'flat'} title={'remove'}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.props.onRemove({ dataIndex: this.props.index });
                                    }}
                                />
                            }
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export class AccountCodeListComponent extends React.Component<IAccountCodeListComponent, any> {
    //AccountCodeItem = props => <AccountCodeItem {...props} saveItem={this.saveData} deleteItem={this.deleteItem} />
    public AccountCodeItem = e => <AccountCodeItem {...e} {...this.props} />;

    public render() {
        return (
            <ListView
                data={this.props.data}
                item={this.AccountCodeItem}
                // style={{ width: "100%", height: 500 }}
                header={() => MyHeader(this.props)}
            />
        );
    }
}
