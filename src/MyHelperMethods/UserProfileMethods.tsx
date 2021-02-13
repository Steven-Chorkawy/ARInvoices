import { sp } from "@pnp/sp";

/**
* Get user profile details.
* @param loginName A Users LoginName
* @param callBack Call Back method is passed the users profile.
*/
export const GetUserProfileProperties = async (loginName: string, callBack: Function) => {
  sp.profiles.getPropertiesFor(loginName).then(userProfileRes => {
    // This converts UserProfileProperties from an array of key value pairs [{Key:'', Value: ''},{Key:'', Value: ''}]
    // Into an array of objects [{'Key': 'Value'}, {'Key: 'Value'}]
    let props = {};
    userProfileRes.UserProfileProperties.map(p => {
      props[p.Key] = p.Value;
    });
    userProfileRes['Props'] = { ...props };

    callBack(userProfileRes);
  });
};

export const GetUserByLoginName = async (loginName: string): Promise<any> => {
  return await sp.web.siteUsers.getByLoginName(loginName).get();
};

export const GetUsersByLoginName = async (users: Array<any>): Promise<Array<any>> => {
  let returnOutput: Array<any> = [];
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    returnOutput.push(await GetUserByLoginName(user.loginName));
  }
  return returnOutput;
};