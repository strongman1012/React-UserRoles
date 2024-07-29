import React from 'react';
import { FC, useEffect, useState } from "react";
import LinkBudget from "./LinkBudget";
import { sampleSource } from "../assets/sampleData";
import { LinkbudgetApi } from "../../../services/link-budget/api-linkbudget";
import { DatasetName } from "../types/LinkBudgetTypes";

interface LinkButdgetComponentProps {
    themeName: string,
    onChangeTheme: (name: string) => void
}

const LinkBudgetComponent: FC<LinkButdgetComponentProps> = (props: LinkButdgetComponentProps) => {

    const [datasetNames, setDatasetNames] = useState<DatasetName[]>([]);

    useEffect(() => {
        getDatasetNames();
    }, []);

    const getDatasetNames = async () => {

        try {
            const responseData = await LinkbudgetApi.getLinkBudgetDatasetNames();

            if (responseData && !('error' in responseData)) {
                setDatasetNames(responseData.names);
            }
        } catch (err: any) {
            console.log(err);
        }
    }

    const onSaveLinkBudget = () => {
        // 
    }

    const onLoadLinkBudget = () => {
        //
    }

    return (
        <LinkBudget
            source={sampleSource}
            templateId={13}
            preRunResults={[]}
            isEngineer={true}
            linkBudgetDatasetNames={datasetNames}
            loadLinkBudgetDatasetNames={getDatasetNames}
            linkBudgetTemplates={[]}
            linkBudgetLoaded={true}
            saveLinkBudget={onSaveLinkBudget}
            loadLinkBudget={onLoadLinkBudget}
            themeName={props.themeName}
            onChangeTheme={(name: string) => props.onChangeTheme(name)}
        />
    )
}

export default LinkBudgetComponent;
