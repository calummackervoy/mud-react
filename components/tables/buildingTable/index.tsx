import {HTMLAttributes, useState, useEffect} from "react";

import {
    Thing,
    getUrlAll,
    getThing,
    getStringNoLocale,
} from "@inrupt/solid-client";

import {
    Table,
    TableColumn,
    CombinedDataProvider,
    Text
} from "@inrupt/solid-ui-react";

import {
  Box,
  Button,
  Typography
} from "@material-ui/core";

import { RDF, VCARD, FOAF } from "@inrupt/lit-generated-vocab-common";
import { MUD } from "../../../lib/MUD";
import useMudWorld from "../../../lib/hooks/useMudWorld";

import styles from "./buildingTable.module.css";

export default function BuildingTable(
    {settlement, goBack} : {settlement: Thing, goBack: () => void}): React.ReactElement {

    const [ buildingThings, setBuildingThings ] = useState(null);
    const { settlementDataSet } = useMudWorld();

    //pull in the buildings from the parameterised settlement
    useEffect(() => {
        const buildingUrls = getUrlAll(settlement, MUD.hasBuilding);
        let buildingArr = [];
        buildingUrls.forEach((url) => {
            buildingArr.push({
                dataset: settlementDataSet,
                thing: getThing(settlementDataSet, url)
            });
        });
        setBuildingThings(buildingArr);
    }, []);

    let tableContent = <h3>Loading...</h3>;

    if(buildingThings) {
        if(buildingThings.length > 0) {
            tableContent = (
                <>
                <Typography gutterBottom variant="h6" component="h3">
                    {getStringNoLocale(settlement, VCARD.fn)}
                </Typography>
                <Table things={buildingThings}>
                    <TableColumn property={VCARD.fn} header="Name" />
                    <TableColumn property={MUD.owner} header="Owner" dataType="url" body={({ value }) => (
                        <CombinedDataProvider datasetUrl={value} thingUrl={value}>
                            <Text property={VCARD.fn.value} />
                        </CombinedDataProvider>
                    )} />
                </Table>
                </>
            );
        }

        else tableContent = <h3>This Settlement is empty!</h3>;
    }

    return (
    <>
        <Box>
            <Button onClick={goBack}>
                Go Back
            </Button>
        </Box>
        <Box>
            {tableContent}
        </Box>
    </>
    );
}