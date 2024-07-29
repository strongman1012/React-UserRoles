import React from 'react';
import { FC, useEffect, useState } from "react";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { formatDate } from "devextreme/localization";
import List from 'devextreme-react/list';
import ArrayStore from "devextreme/data/array_store";
import { Box } from "@mui/material";
import { Button } from 'devextreme-react/button';
import DataSource from "devextreme/data/data_source";
import { LinkbudgetApi } from "../../../../services/link-budget/api-linkbudget";
import { DatasetName } from "../../types/LinkBudgetTypes";

interface IOpen {
    visible: boolean;
    selected: DatasetName;
    datasetNames: DatasetName[];
    loadLinkBudgetDatasetNames: () => void;
    onHide: () => void;
    onOk: (name: string, id: number) => void;
}

const Open: FC<IOpen> = (props: IOpen) => {

    const [dataSource, setDataSource] = useState<DataSource>();
    const [selectedItem, setSelectedItem] = useState<{ selectedIndex: number, selectedName: string }>({ selectedIndex: -1, selectedName: '' });
    const isEngineer = true;

    useEffect(() => {
        props.visible && getFileNames();
    }, [props.visible, props.datasetNames]);

    const getFileNames = async () => {

        const ds: any = new ArrayStore({
            key: 'id',
            data: props.datasetNames
        });
        setDataSource(ds);

        props.datasetNames.map((d: DatasetName, idx: number) => {
            if (d.name === props.selected.name) {
                setSelectedItem({ selectedName: props.selected.name, selectedIndex: idx });
            }
        });
    }

    const handleOk = () => {
        if (selectedItem.selectedName !== '') {
            props.onOk(selectedItem.selectedName, selectedItem.selectedIndex);
        } else {
            alert('Please select a dataset');
        }
    }

    const onSelected = (args: any) => {
        if (args.addedItems.length > 0) {
            const selectedItem = args.addedItems[0];
            setSelectedItem({ selectedName: selectedItem.name, selectedIndex: selectedItem.id });
        }
    }

    const okButtonOptions = {
        text: 'OK',
        onClick: handleOk,
    };

    const cancelButtonOptions = {
        text: 'Cancel',
        onClick: props.onHide,
    };

    const ListHeader = () => {
        return (
            <>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderBottom: '2px solid #ddd'
                }}>
                    <Box>Template Name</Box>
                    <Box>Last Updated</Box>
                </Box>
            </>
        )
    }

    const handleDeleteDataset = async (item: DatasetName) => {
        if (item.name !== props.selected.name) {
            // if (
            //     window.confirm(
            //         `Are you sure you wish to delete ${item.name}?`
            //     )
            // ) {
            // Send Dataset Name Delete Request
            try {
                const deleteResponse = await LinkbudgetApi.deleteLinkBudget(item.id);
                if (deleteResponse.success) {
                    props.loadLinkBudgetDatasetNames();
                }
            } catch (err) {
                console.log(err);
            }
            // }
        } else {
            alert('Currently loaded link budget cannot be deleted');
        }
    };

    const renderDataSetItem = (item: DatasetName) => {
        const d = item.updatedAt
            ? formatDate(new Date(item.updatedAt), "shortDateshortTime")
            : formatDate(new Date(), "shortDateshortTime");
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '38px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <i className="dx-icon-textdocument" style={{ marginRight: 6, fontSize: '18px' }}></i>
                    <span className="dx-button-text">{item.name}</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{d.toString()}</span>
                    {isEngineer && item.name !== props.selected.name &&
                        <Button
                            icon="clear"
                            onClick={() => handleDeleteDataset(item)}
                            className="listClearButton"
                            stylingMode="text"
                            style={{ marginLeft: 6 }}
                        />}
                </Box>
            </Box>
        )
    }

    return (
        <>
            <Popup
                width={500}
                height='auto'
                showTitle={true}
                title="Link Budget Templates"
                visible={props.visible}
                showCloseButton={true}
                onHiding={props.onHide}
                resizeEnabled={true}
            >
                <Position
                    at="top"
                    my="center"
                    collision="fit"
                    offset="0 300"
                />

                <ToolbarItem
                    widget="dxButton"
                    toolbar="bottom"
                    location="after"
                    options={okButtonOptions}
                />

                <ToolbarItem
                    widget="dxButton"
                    toolbar="bottom"
                    location="after"
                    options={cancelButtonOptions}
                />

                <Box sx={{ border: '1px solid #ddd' }}>
                    <ListHeader />
                    <List
                        dataSource={dataSource}
                        height={250}
                        selectionMode="single"
                        onSelectionChanged={onSelected}
                        itemRender={renderDataSetItem}
                    />
                </Box>


            </Popup>
        </>
    )
}

export default Open;