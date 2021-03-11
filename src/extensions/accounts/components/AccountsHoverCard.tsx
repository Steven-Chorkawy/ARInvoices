import * as React from 'react';
import { ExpandingCardMode, HoverCard, HoverCardType, IExpandingCardProps } from 'office-ui-fabric-react/lib/HoverCard';
import { DetailsList, buildColumns, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { IAccount } from '../../../interfaces/IARInvoice';
import { IHoverCard, IPlainCardProps } from '@fluentui/react';

export interface IAccountsHoverCardProps {
    accounts: IAccount[];
}

export default class AccountsHoverCard extends React.Component<IAccountsHoverCardProps, any> {
    private _sumAccounts = (accounts: IAccount[]) => {
        let sum = 0;
        for (let accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
            const account = accounts[accountIndex];
            sum += Number(account.Total_x0020_Invoice);
        }
        return sum;
    }

    private onRenderItemColumn = (item: any, index: number, column: IColumn) => {
        const fieldContent = item[column.fieldName as keyof IAccount] as string;
        debugger;
        switch (column.key) {
            case 'Amount':
            case 'Total_x0020_Invoice':
                return <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(fieldContent))}</span>;
            case 'HST_x0020_Taxable':
                return <span>{fieldContent ? 'Yes' : 'No'}</span>;
            default:
                return <span>{fieldContent}</span>;
        }
    }

    private onRenderCompactCard = (items: IAccount[]) => {

        return (<div style={{ padding: '10px' }}>
            <DetailsList
                items={items}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={this.onRenderItemColumn}
                columns={[
                    { key: 'Account_x0020_Code', name: 'Account Code', fieldName: 'Account_x0020_Code', minWidth: 200 },
                    { key: 'Amount', name: 'Amount', fieldName: 'Amount', minWidth: 150 },
                    { key: 'HST_x0020_Taxable', name: 'HST Taxable', fieldName: 'HST_x0020_Taxable', minWidth: 100 },
                    { key: 'Total_x0020_Invoice', name: 'Total', fieldName: 'Total_x0020_Invoice', minWidth: 150 }
                ]}
            />
        </div>);
    }

    public render() {
        return (
            <HoverCard
                instantOpenOnClick={true}
                type={HoverCardType.plain}
                plainCardProps={{
                    onRenderPlainCard: this.onRenderCompactCard,
                    renderData: this.props.accounts
                }}>
                <div style={{ minWidth: '254px', maxWidth: '400px', cursor: 'pointer' }}>
                    {this.props.accounts.map(account => {
                        return (<div>
                            <span>{account.Account_x0020_Code}</span>
                            <b style={{ paddingLeft: '10px', paddingRight: '10px' }}>|</b>
                            <span style={{ float: 'right' }}>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.Total_x0020_Invoice)}
                            </span>
                        </div>);
                    })}
                    <hr />
                    <div>
                        <span>Total: </span>
                        <span style={{ float: 'right' }}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this._sumAccounts(this.props.accounts))}
                        </span>
                    </div>
                </div>
            </HoverCard>
        );
    }
}