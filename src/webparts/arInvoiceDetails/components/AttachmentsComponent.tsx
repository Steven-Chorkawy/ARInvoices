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
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';
import { Upload, UploadFileStatus } from '@progress/kendo-react-upload';


import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import { MyLists } from '../../../enums/MyLists';
import { UploadARInvoiceAttachments } from '../../../MyHelperMethods/DataLayerMethods';
import IDataOperations from '../../../interfaces/IDataOperations';

export interface IAttachmentsComponentProps extends IArInvoiceSubComponentProps, IDataOperations {
    
}

class CustomAttachmentItem extends React.Component<any, any> {
    public render() {
        const { files } = this.props;
        return (
            files.map(file => {
                return (
                    <div key={file.name} className='k-file-single'>
                        <span className='k-progress' style={{ width: `${file.progress ? file.progress : 0}%`, transition: 'opacity 0.5s ease-in-out 0s;' }}></span>
                        <span className='k-file-name-size-wrapper'>
                            {
                                file.URL ?
                                    <a href={file.URL} target='_blank' data-interception='off'>
                                        <span className='k-file-name' title={file.name}>{file.name}</span>
                                    </a> :
                                    <span className='k-file-name' title={file.name}>{file.name}</span>
                            }
                            <span className='k-file-size'></span>
                        </span>
                    </div>
                );
            })
        );
    }
}

/**
 * This class displays the generic invoice metadata. 
 */
export class AttachmentsComponent extends React.Component<IAttachmentsComponentProps> {
    constructor(props) {
        super(props);
        debugger;
    }

    public AttachmentItem = e => <CustomAttachmentItem {...e} />;

    private onAdd = e => {
        debugger;
        this.props.onSave(e);
        UploadARInvoiceAttachments(e.affectedFiles, this.props.invoice.ID);
    }

    private onRemove = e => {
        debugger;
    }

    public render() {
        return (
            <Card style={{ width: '100%' }}>
                <CardBody>
                    <CardTitle><b>Attachments</b></CardTitle>
                    <Upload
                        batch={false}
                        multiple={true}
                        listItemUI={this.AttachmentItem}
                        onAdd={this.onAdd}
                        onRemove={this.onRemove}
                        defaultFiles={this.props.invoice.AttachmentFiles ?
                            this.props.invoice.AttachmentFiles.map((attachment, index) => {
                                return ({
                                    name: attachment.FileName,
                                    progress: 100,
                                    status: UploadFileStatus.Uploaded,
                                    uid: index.toString(),
                                    URL: attachment.URL
                                });
                            }) :
                            undefined
                        }
                    />
                </CardBody>
            </Card>
        );
    }
}