import * as React from 'react';

// PNP Imports
import { sp } from "@pnp/sp";
import "@pnp/sp/profiles";
import "@pnp/sp/webs";
import "@pnp/sp/profiles";
import "@pnp/sp/site-users";
import { ISiteUserInfo } from '@pnp/sp/site-users/types';

// Office UI Imports
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';

// My Imports 
import { GetUserProfile } from '../MyHelperMethods/UserProfileMethods';


interface IPersonaComponentProps {
    userEmail: string;
    personaSize?: PersonaSize;
}

interface IPersonaComponentState {
    userProfile: any;
}

export class PersonaComponent extends React.Component<IPersonaComponentProps, IPersonaComponentState> {

    constructor(props) {
        super(props);

        this.state = {
            userProfile: undefined
        };

        this.setUserProfileFromEmail(this.props.userEmail);
    }

    private setUserProfileFromEmail = (email: string) => {
        sp.web.siteUsers.getByEmail(email).get().then(value => {
            GetUserProfile(value.LoginName, e => {
                this.setState({
                    userProfile: e
                });
            });
        });
    }

    public render() {
        let user = this.state.userProfile;
        return (
            user ?
                <Persona
                    imageUrl={user.PictureUrl}
                    imageInitials={`${user.Props['FirstName'].charAt(0)} ${user.Props['LastName'].charAt(0)}`}
                    text={`${user.Props['FirstName']} ${user.Props['LastName']}`}
                    size={this.props.personaSize ? this.props.personaSize : PersonaSize.size40}
                    secondaryText={user.Title}
                /> :
                <div style={{ display: 'flex' }}>
                    <ShimmerElementsGroup
                        shimmerElements={[
                            { type: ShimmerElementType.circle, height: 40 },
                            { type: ShimmerElementType.gap, width: 16, height: 40 },
                        ]}
                    />
                    <ShimmerElementsGroup
                        flexWrap
                        width="100%"
                        shimmerElements={[
                            { type: ShimmerElementType.line, width: '100%', height: 10, verticalAlign: 'bottom' },
                            { type: ShimmerElementType.line, width: '90%', height: 8 },
                            { type: ShimmerElementType.gap, width: '10%', height: 20 },
                        ]}
                    />
                </div>
        );
    }
}