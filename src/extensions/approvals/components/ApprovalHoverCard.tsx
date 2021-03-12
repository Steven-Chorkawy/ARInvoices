import * as React from 'react';
import { ExpandingCardMode, HoverCard, HoverCardType, IExpandingCardProps } from 'office-ui-fabric-react/lib/HoverCard';
import { DetailsList, buildColumns, IColumn, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { IAccount, IApproval } from '../../../interfaces/IARInvoice';
import { IHoverCard, IPlainCardProps } from '@fluentui/react';

export interface IApprovalHoverCardProps {
    approval: IApproval;
}

export default class ApprovalHoverCard extends React.Component<IApprovalHoverCardProps, any> {

    private _parseStatusIntoClassString = (status: string) => {
        let output = '';
        switch (status.toLowerCase()) {
            case 'approve':
                output = 'sp-css-backgroundColor-successBackground40';
                break;
            case 'waiting':
                output = 'sp-css-backgroundColor-blueBackground17';
                break;
            case 'reject':
                output = 'sp-css-backgroundColor-errorBackground50';
                break;
            default:
                output = 'sp-css-color-neutralPrimary';
                break;
        }

        return output;
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
                    renderData: this.props.approval
                }}>
                <div
                    style={{ display: 'inline-flex', alignItems: 'center', height: '28px', overflow: 'hidden', paddingRight: '8px', borderRadius: '12px', margin: '2px' }}
                    className={`${this._parseStatusIntoClassString(this.props.approval.Status)} ms-fontColor-neutralSecondary`}
                >
                    <img
                        style={{ width: '28px', height: '28px', display: 'block', borderRadius: '50%' }}
                        src={`/_layouts/15/userphoto.aspx?size=S&accountname=${this.props.approval.Assigned_x0020_To.EMail}`}
                    />
                    <div style={{ paddingLeft: '5px', whiteSpace: 'nowrap', fontSize: '12px' }} className="nameplate-title">
                        <div>
                            {this.props.approval.Assigned_x0020_To.Title} | {this.props.approval.Status}
                        </div>
                        <div>
                            {this.props.approval.Request_x0020_Type}
                        </div>
                    </div>
                </div>
            </HoverCard>
        );
    }
}