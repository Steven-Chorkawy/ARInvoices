import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './Approvals.module.scss';
import { IApproval } from '../../../interfaces/IARInvoice';
import ApprovalHoverCard from './ApprovalHoverCard';

export interface IApprovalsProps {
  approvals: IApproval[];
}

const LOG_SOURCE: string = 'Approvals';

export default class Approvals extends React.Component<IApprovalsProps, {}> {


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
            this.props.approvals.map(approval => <ApprovalHoverCard approval={approval} />) :
            <div>No Approvals</div>
        }
      </div>
    );
  }
}
