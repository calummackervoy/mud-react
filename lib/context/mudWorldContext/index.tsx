import {
    ReactElement,
    createContext,
    useState,
    useEffect,
} from 'react';

import {
    Thing,
    SolidDataset,
    getSolidDataset,
  } from "@inrupt/solid-client";

import { MUD, MUDAPI } from "../../MUD";
import { getFilteredThings } from "../../utils";

export interface IMudWorldContext {
    settlements: [Thing];
    settlementDataSet: SolidDataset;
}

export const MudWorldContext = createContext<IMudWorldContext>({settlements: null, settlementDataSet: null});

export const MudWorldProvider = ({
    worldWebId,
    children
}): ReactElement => {
    const [ settlementDataSet, setSettlementDataSet ] = useState(null);
    const [ settlements, setSettlements ] = useState(null);

    useEffect(() => {
        const URL = worldWebId + MUDAPI.settlementsPath;
        getSolidDataset(URL).then((dataset) => {
            setSettlementDataSet(dataset);
            setSettlements(getFilteredThings(dataset));
        });
    }, []);

    return(
        <MudWorldContext.Provider
            value={{
                settlementDataSet,
                settlements
            }}
        >
            {children}
        </MudWorldContext.Provider>
    );
};