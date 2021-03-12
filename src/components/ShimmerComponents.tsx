import * as React from 'react';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';


export class PersonaShimmer extends React.Component<any, any> {
    public render() {
        const wrapperStyles = { display: 'flex' };
        const getCustomElements = (): JSX.Element => {
            return (
                <div style={wrapperStyles}>
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
        };
        return <Shimmer customElementsGroup={getCustomElements()} />;
    }
}