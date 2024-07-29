// LinkBudgetToolbar.tsx
import React from 'react';
import { Button } from "devextreme-react";
import { Item, Toolbar } from "devextreme-react/data-grid";
import { FC } from "react";

interface LinkBudgetToolbarProps {
    isEditMode: boolean,
    isEngineer: boolean,
    isUpdateTemplateEnabled: boolean,
    onNewDataset: () => void,
    openDataset: () => void,
    onSaveData: () => void,
    onSaveAs: () => void,
    onEditStart: () => void,
    onEditEnd: () => void,
    onRefresh: () => void,
    onExport: () => void,
    onSetTemplateAsDefault: () => void
}

const LinkBudgetToolbar: FC<LinkBudgetToolbarProps> = ({
    isEditMode,
    isEngineer,
    isUpdateTemplateEnabled,
    onNewDataset,
    openDataset,
    onSaveData,
    onSaveAs,
    onEditStart,
    onEditEnd,
    onRefresh,
    onExport,
    onSetTemplateAsDefault
}: LinkBudgetToolbarProps) => {

    return (
        <Toolbar>
            <Item location="before" visible={isEditMode}>
                <Button
                    icon="add"
                    onClick={onNewDataset} // Pass the function reference directly
                    text="New"
                />
            </Item>

            <Item location="before" visible={true}>
                <Button
                    icon="newfolder"
                    onClick={openDataset}
                    hint="Other Templates"
                />
            </Item>
            <Item location="before" visible={isEditMode}>
                <Button icon="save" text="Save" onClick={onSaveData} />
            </Item>
            <Item location="before" visible={isEditMode}>
                <Button
                    icon="box"
                    text="Save As"
                    onClick={onSaveAs}
                />
            </Item>
            <Item location="before" visible={isEditMode}>
                <Button
                    icon="tableproperties"
                    onClick={onEditEnd}
                    text="Done Editing"
                />
            </Item>
            <Item location="before" visible={true}>
                <Button
                    icon="refresh"
                    onClick={onRefresh}
                    hint="Refresh"
                />
            </Item>
            <Item location="before" visible={!isEditMode && isEngineer}>
                <Button
                    icon="tableproperties"
                    onClick={onEditStart}
                    hint="Edit"
                />
            </Item>
            <Item location="before">
                <Button
                    icon="exportxlsx"
                    onClick={onExport}
                    hint="Export Excel"
                />
            </Item>
            <Item location="before" visible={!isEditMode && isEngineer}>
                <Button
                    icon="pinright"
                    onClick={onSaveData}
                    hint="Save Layout"
                />
            </Item>
            <Item location="before" visible={true}>
                <Button
                    icon="save"
                    disabled={!isUpdateTemplateEnabled}
                    onClick={onSetTemplateAsDefault}
                    hint="Save Template as Default"
                />
            </Item>
        </Toolbar>
    )
}

export default LinkBudgetToolbar;
