import { sp } from "@pnp/sp";
import { IAttachmentInfo } from "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/items/types"
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/fields";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

import { MyLists } from '../enums/MyLists';
import { IARInvoice, ISaveARInvoice } from '../interfaces/IARInvoice';

export const UploadARInvoiceAttachments = async (attachments: any[], arInvoiceId: number) => {
    if (!attachments) {
        return undefined;
    }

    let item = await sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(arInvoiceId);
    let uploadResults = [];
    for (let attachmentIndex = 0; attachmentIndex < attachments.length; attachmentIndex++) {
        const attachment = attachments[attachmentIndex];
        uploadResults.push(await item.attachmentFiles.add(attachment.name, attachment.getRawFile()));
    }
    return uploadResults;
}

export const CreateARInvoice = async (data: any) => {
    console.log(data);
    const { AccountCodes, Attachments, Customer, ApproverEmails, Invoice } = data;

    let itemAddResult = await sp.web.lists.getByTitle(MyLists['AR Invoice Requests']).items.add(Invoice);
    let newARInvoice = (await itemAddResult).data;

    let uploadResult = await UploadARInvoiceAttachments(Attachments, newARInvoice.ID);

    debugger;
};

