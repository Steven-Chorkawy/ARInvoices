
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/fields";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { MyLists } from '../enums/MyLists';

export const GetChoiceFieldValues = async (listName: MyLists, internalNameOrTitle: string): Promise<any[]> => {
    let field: any = await sp.web.lists.getByTitle(listName).fields.getByTitle(internalNameOrTitle).select('Choices').get();
    return field.Choices;
}