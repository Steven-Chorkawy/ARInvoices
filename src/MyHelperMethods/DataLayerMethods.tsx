import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/fields";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/items/types";

import { MyLists } from '../enums/MyLists';
import * as ApprovalEnum from '../enums/Approvals';

import { IARInvoice, IApproval, IAccount } from '../interfaces/IARInvoice';
import { BuildURLToDocument } from './HelperMethods';

export const GetApprovals_Batch = async (ids: number[]): Promise<IApproval[]> => {
    let list = sp.web.lists.getByTitle(MyLists["AR Invoice Approvals"]);
    let batch = sp.web.createBatch();
    let approvals = [];

    for (let index = 0; index < ids.length; index++) {
        list.items.getById(ids[index])
            .select(`
            *, 
            Assigned_x0020_To/EMail, 
            Assigned_x0020_To/ID, 
            Assigned_x0020_To/Name, 
            Assigned_x0020_To/Title,
            Author/EMail,
            Author/ID,
            Author/Name, 
            Author/Title
            `)
            .expand('Assigned_x0020_To, Author')
            .inBatch(batch).get()
            .then(f => {
                approvals.push(f);
            });
    }

    await batch.execute();
    return approvals;
};

export const GetAccounts_Batch = async (ids: number[]): Promise<IAccount[]> => {
    let list = sp.web.lists.getByTitle(MyLists["AR Invoice Accounts"]);
    let batch = sp.web.createBatch();
    let accounts = [];
    for (let index = 0; index < ids.length; index++) {
        list.items.getById(ids[index])
            .inBatch(batch).get()
            .then(f => {
                accounts.push(f);
            }).catch(reason => {
                console.log('something went wrong!');
                console.log(reason);
            });
    }

    await batch.execute();
    return accounts;
};

export const GetInvoiceByID = async (id: number): Promise<IARInvoice> => {
    let item: IItem = sp.web.lists.getByTitle(MyLists["AR Invoice Requests"])
        .items.getById(id);

    let output: IARInvoice = await item
        .select(`
            *,
            Requested_x0020_By/Title, 
            Requested_x0020_By/ID, 
            Requested_x0020_By/Name, 
            Requested_x0020_By/EMail,
            Customer/ID,
            Customer/Title,
            Customer/GP_x0020_ID,
            Customer/Contact_x0020_Name,
            Customer/Mailing_x0020_Address,
            Customer/Telephone_x0020_Number,
            Accounts/ID
        `).expand("Requested_x0020_By, Customer, Accounts").get();

    output.Date = new Date(output.Date);

    if (output.ApprovalsId.length > 0) {
        output.Approvals = await GetApprovals_Batch(output.ApprovalsId);
    }

    if (output.AccountsId.length > 0) {
        output.Accounts = await GetAccounts_Batch(output.AccountsId);
    }

    if (output.Attachments) {
        output.AttachmentFiles = await item.attachmentFiles();
        let webInfoUrl = await (await sp.web.get()).Url;
        for (let attachmentIndex = 0; attachmentIndex < output.AttachmentFiles.length; attachmentIndex++) {
            const attachment = output.AttachmentFiles[attachmentIndex];
            output.AttachmentFiles[attachmentIndex].URL = await BuildURLToDocument(attachment.FileName, id, webInfoUrl);
        }
    }

    return output;
};

export const UploadARInvoiceAttachments = async (attachments: any[], arInvoiceId: number): Promise<any[]> => {
    if (!attachments) {
        return null;
    }

    let item = await sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(arInvoiceId);
    let output = [];

    for (let attachmentIndex = 0; attachmentIndex < attachments.length; attachmentIndex++) {
        const attachment = attachments[attachmentIndex];
        try {
            output.push(await item.attachmentFiles.add(attachment.name, attachment.getRawFile()));
        }
        catch (e) {
            output.push({ ...attachment, error: { ...e } });
        }
    }

    return output;
};

//#region AR Invoice Accounts
export const CreateARInvoiceAccounts = async (accounts: any[], arInvoiceId: number): Promise<void> => {
    if (!accounts) {
        return null;
    }

    let accountList = sp.web.lists.getByTitle(MyLists["AR Invoice Accounts"]);
    let arInvoiceRequestList = sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]);
    let currentAccounts = await accountList.items.filter(`AR_x0020_InvoiceId eq ${arInvoiceId}`).get();

    for (let accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
        const account = { ...accounts[accountIndex], AR_x0020_InvoiceId: arInvoiceId };
        // Create the AR Invoice Account. 
        let itemAddResult = accountList.items.add(account);
        currentAccounts.push((await itemAddResult).data);
    }

    // Add the accounts to the AR Invoice Request.
    if (currentAccounts.length > 0) {
        arInvoiceRequestList.items.getById(arInvoiceId).update({
            AccountsId: { 'results': currentAccounts.map(a => { return a.Id; }) }
        });
    }
};

export const DeleteARInvoiceAccounts = async (account: any) => {
    sp.web.lists.getByTitle(MyLists["AR Invoice Accounts"]).items.getById(account.ID).delete();
};

export const UpdateARInvoiceAccounts = async (data: any[]): Promise<any> => {
    let output = [];
    for (let accountIndex = 0; accountIndex < data.length; accountIndex++) {
        const account = data[accountIndex];
        let iUpdateRes = await sp.web.lists.getByTitle(MyLists["AR Invoice Accounts"]).items.getById(account.ID)
            .update({ ...account });
        output.push(await iUpdateRes.item.get());
    }
    return output;
};
//#endregion


export const CreateApprovalRequest = async (approvers: any[], arInvoiceId: number, requestType: ApprovalEnum.ApprovalRequestTypes = ApprovalEnum.ApprovalRequestTypes["Department Approval Required"]): Promise<void> => {
    if (!approvers) {
        return null;
    }

    let approvalsList = sp.web.lists.getByTitle(MyLists["AR Invoice Approvals"]);
    let arInvoiceRequestList = sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]);
    let approvalRequestResults = [];

    for (let approverIndex = 0; approverIndex < approvers.length; approverIndex++) {
        const approver = approvers[approverIndex];
        let itemAddResult = approvalsList.items.add({
            Title: `AR Invoice ${arInvoiceId} Approval Request`,
            AR_x0020_InvoiceId: arInvoiceId,
            ARInvoiceID_Number: arInvoiceId, // Only using this field because PowerAutomate cannot get the value of AR_x0020_InvoiceId.
            Assigned_x0020_ToId: approver.Id,
            Request_x0020_Type: requestType
        });
        approvalRequestResults.push((await itemAddResult).data);
    }

    if (approvalRequestResults.length > 0) {
        arInvoiceRequestList.items.getById(arInvoiceId).update({
            ApprovalsId: { results: approvalRequestResults.map(a => { return a.Id; }) }
        });
    }
};

export const UpdateApprovalRequest = async (approvalId: number, responseStatus: string | ApprovalEnum.ApprovalStatus, responseMessage: string): Promise<any> => {
    try {
        let iUpdateRes = await sp.web.lists.getByTitle(MyLists["AR Invoice Approvals"]).items.getById(approvalId)
            .update({
                Status: responseStatus,
                Response_x0020_Message: responseMessage
            });
        return await iUpdateRes.item.get();
    } catch (error) {
        console.log('Could not complete your approval.');
        console.log(error);
        alert('Could not complete your approval.  Please contact helpdesk@clarington.net');
        return undefined;
    }
};

export const CreateARInvoice = async (data: any): Promise<void> => {
    const { Accounts, Attachments, Customer, ApproverEmails, Approvers, Invoice } = data;

    let itemAddResult = await sp.web.lists.getByTitle(MyLists['AR Invoice Requests']).items.add(Invoice);
    let newARInvoice = (await itemAddResult).data;

    // Append the ID to the title so users can determine which invoice they're looking at in the approval center.
    sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(newARInvoice.ID).update({ Title: `${newARInvoice.Title} - ${newARInvoice.ID}` });

    await UploadARInvoiceAttachments(Attachments, newARInvoice.ID);
    await CreateARInvoiceAccounts(Accounts, newARInvoice.ID);
    await CreateApprovalRequest(Approvers, newARInvoice.ID);
};

export const UpdateARInvoice = async (data: any) => {
    console.log('update ar invoice');
    console.log(data);

    const {
        Accounts,
        AccountsId,
        Approvals,
        ApprovalsId,
        AttachmentFiles,
        Customer,
        Requested_x0020_By,
        ...invoice
    } = data;

    // Update the invoice properties. 
    const iUpdateRes = await sp.web.lists.getByTitle(MyLists["AR Invoice Requests"]).items.getById(invoice.ID)
        .update({ ...invoice });

    // Create and update the accounts. 
    for (let accountIndex = 0; accountIndex < Accounts.length; accountIndex++) {
        const account = Accounts[accountIndex];
        account.ID ?
            await UpdateARInvoiceAccounts([account]) :
            await CreateARInvoiceAccounts([account], invoice.ID);
    }

    return;
};

