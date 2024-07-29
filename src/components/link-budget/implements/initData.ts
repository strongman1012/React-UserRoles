import { menuItemPositions } from "../types/LinkBudgetTypes";

export const initRow = {
    id: 'new_item_id',
    group: '',
    name: '',
    title: '',
    value: 0,
    jsonata_exp: '=0',
    user_exp: '=0',
    order: 1,
    notes: ''
};

export const initWidths = {
    collapse: ['5%', '15%', '15%', '10%'],
    expanded: ['5%', '10%', '10%', '10%', '8%', '15%', '15%']
};

export const initNewData = {
    id: -1,
    name: 'new_data_set',
    type: 0,
    status: 0,
    items: [
        initRow
    ],
    width: initWidths
}

export const contextMenuItems = [
    { position: menuItemPositions.above, text: 'Insert new above' },
    { position: menuItemPositions.below, text: 'Insert new item below' },
    { position: menuItemPositions.delete, text: 'Delete selected item' }
];