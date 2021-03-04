import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './Approvals.module.scss';
import { IApproval } from '../../../interfaces/IARInvoice';

export interface IApprovalsProps {
  approvals: IApproval[];
}

const LOG_SOURCE: string = 'Approvals';

export default class Approvals extends React.Component<IApprovalsProps, {}> {
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

  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: Approvals mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: Approvals unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.cell}>
        {
          this.props.approvals ?
            this.props.approvals.map(approval => {
              // return <div>{approval.Assigned_x0020_To.Title} | {approval.Status}</div>;
              return (
                <div>
                  <div
                    style={{ display: 'inline-flex', alignItems: 'center', height: '28px', overflow: 'hidden', paddingRight: '8px', borderRadius: '12px', margin: '2px' }}
                    className={`${this._parseStatusIntoClassString(approval.Status)} ms-fontColor-neutralSecondary`}
                  >
                    <img
                      style={{ width: '28px', height: '28px', display: 'block', borderRadius: '50%' }}
                      src={`/_layouts/15/userphoto.aspx?size=S&accountname=${approval.Assigned_x0020_To.EMail}`} title={approval.Assigned_x0020_To.Title}
                    />
                    <div
                      style={{ paddingLeft: '5px', whiteSpace: 'nowrap', fontSize: '12px' }}
                      title={approval.Assigned_x0020_To.Title} className="nameplate-title">
                      <div>
                        {approval.Assigned_x0020_To.Title} | {approval.Status}
                      </div>
                      <div>
                        {approval.Request_x0020_Type}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) :
            <div>No Approvals</div>
        }
      </div>
    );
  }
}
