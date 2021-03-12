import * as React from 'react';
import { HoverCard, HoverCardType } from 'office-ui-fabric-react/lib/HoverCard';
import { IApproval } from '../../../interfaces/IARInvoice';
import { ActivityItem, DefaultButton, mergeStyleSets, PrimaryButton, Stack } from 'office-ui-fabric-react';
import { ApprovalStatus } from '../../../enums/Approvals';
import IMyUser from '../../../interfaces/IMyUser';

export interface IApprovalHoverCardProps {
    approval: IApproval;
    currentUser: IMyUser;
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

    private _getActivityItemProps = (approval: IApproval) => {
        const classNames = mergeStyleSets({
            exampleRoot: {
                marginTop: '20px',
            },
            nameText: {
                fontWeight: 'bold',
            },
        });

        let output = [{
            key: 1,
            activityDescription: [
                <span
                    key={1}
                    className={classNames.nameText}
                >{approval.Author.Title}</span>,
                <span key={2}> requested </span>,
                <span key={3} className={classNames.nameText}>{approval.Request_x0020_Type}</span>,
            ],
            activityPersonas: [{ imageUrl: `/_layouts/15/userphoto.aspx?size=S&accountname=${approval.Author.EMail}` }],
            comments: approval.Notes,
            timeStamp: approval.Created,
        }];

        if (approval.Status !== ApprovalStatus.Waiting) {
            output.push({
                key: 2,
                activityDescription: [
                    <span
                        key={1}
                        className={classNames.nameText}
                    >{approval.Assigned_x0020_To.Title}</span>,
                    <span key={2}> responded with </span>,
                    <span key={3} className={classNames.nameText}>{approval.Status}</span>,
                ],
                activityPersonas: [{ imageUrl: `/_layouts/15/userphoto.aspx?size=S&accountname=${approval.Assigned_x0020_To.EMail}` }],
                comments: approval.Response_x0020_Message,
                timeStamp: approval.Modified,
            });
        }

        return output;
    }

    private onRenderCompactCard = (data) => {
        const approval: IApproval = data.approval;
        const currentUser: IMyUser = data.currentUser;
        return (
            <div style={{ padding: '10px' }}>
                {
                    this._getActivityItemProps(approval).map((item: { key: string | number }) => {
                        return <ActivityItem {...item} key={item.key} />;
                    })
                }
                {
                    approval.Assigned_x0020_To.EMail === currentUser.email && approval.Status === ApprovalStatus.Waiting &&
                    <Stack horizontal horizontalAlign="space-around" style={{ marginTop: '10px' }}>
                        <PrimaryButton iconProps={{ iconName: 'Accept' }} text="Approve" />
                        <DefaultButton iconProps={{ iconName: 'ChromeClose' }} text="Deny" />
                    </Stack>
                }
            </div>
        );
    }

    public render() {
        return (
            <HoverCard
                instantOpenOnClick={true}
                type={HoverCardType.plain}
                plainCardProps={{
                    onRenderPlainCard: this.onRenderCompactCard,
                    renderData: { ...this.props }
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