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
import { Upload, UploadFileInfo, UploadFileStatus } from '@progress/kendo-react-upload';


import { IArInvoiceSubComponentProps } from './ArInvoiceDetails';
import { MyLists } from '../../../enums/MyLists';
import { UploadARInvoiceAttachments } from '../../../MyHelperMethods/DataLayerMethods';
import IDataOperations from '../../../interfaces/IDataOperations';
import { ISPListAttachment } from '../../../interfaces/IARInvoice';

export interface IAttachmentsComponentProps extends IArInvoiceSubComponentProps, IDataOperations { }

export interface IAttachmentsComponentState {
    AttachmentFiles: any[];
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
export class AttachmentsComponent extends React.Component<IAttachmentsComponentProps, IAttachmentsComponentState> {
    constructor(props) {
        super(props);
        this.state = {
            AttachmentFiles: this.props.invoice.AttachmentFiles ?
                this.props.invoice.AttachmentFiles.map((a, index) => {
                    return {
                        ...a,
                        progress: 100,
                        status: UploadFileStatus.Uploaded,
                        uid: index.toString(),
                        name: a.FileName
                    };
                }) :
                undefined
        };
    }

    public AttachmentItem = e => <CustomAttachmentItem {...e} />;

    private onAdd = e => {
        let newFiles = e.affectedFiles.map(file => ({
            status: UploadFileStatus.Uploading,
            name: file.name,
            progress: 0,
            uid: file.uid
        }));

        this.setState({
            AttachmentFiles: [
                ...this.state.AttachmentFiles,
                ...newFiles
            ]
        });

        UploadARInvoiceAttachments(e.affectedFiles, this.props.invoice.ID).then(results => {
            let uploadSuccess = true;
            for (let resultsIndex = 0; resultsIndex < results.length; resultsIndex++) {
                const result = results[resultsIndex];
                if (result.error) {
                    let failedFile = {
                        status: UploadFileStatus.UploadFailed,
                        progress: 100,
                        name: result.name,
                        uid: result.uid
                    };
                    let failedFileIndex = this.state.AttachmentFiles.findIndex(f => f.uid === result.uid);
                    let stateFiles = this.state.AttachmentFiles;
                    stateFiles[failedFileIndex] = { ...failedFile };
                    this.setState({ AttachmentFiles: stateFiles });
                    // This will force the form to re-render. 
                    uploadSuccess = false;
                }
            }

            if (uploadSuccess) {
                this.props.onSave(e);
            }
        });
    }

    private onRemove = e => { }

    public render() {
        return (
            <Card style={{ width: '100%' }} key={JSON.stringify(this.state.AttachmentFiles)}>
                <CardBody>
                    <CardTitle><b>Attachments</b></CardTitle>
                    <Upload
                        batch={false}
                        multiple={true}
                        listItemUI={this.AttachmentItem}
                        onAdd={this.onAdd}
                        onRemove={this.onRemove}
                        defaultFiles={this.state.AttachmentFiles ? this.state.AttachmentFiles : undefined}
                    />
                </CardBody>
            </Card>
        );
    }
}