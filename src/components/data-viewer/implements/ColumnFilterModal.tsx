import React from "react";
import {
	Box, Button, Checkbox, Dialog, DialogActions,
	DialogContent, DialogTitle, FormControlLabel
} from "@mui/material";
import { FC } from "react";

export interface ColumnFilter {
	label: string;
	selected: boolean;
}
interface Props {
	isOpen: boolean;
	columns: ColumnFilter[];
	onClose: () => void;
	onColumnToggle: (column: ColumnFilter) => void;
	onSelectAll: (selectAll: boolean) => void;
}
const ColumnFilterModal: FC<Props> = ({
	isOpen,
	columns,
	onClose,
	onColumnToggle,
	onSelectAll,
}) => {
	const allSelected = columns?.every((column) => column.selected);

	const handleSelectAll = () => {
		onSelectAll(!allSelected);
	};

	return (
		<Dialog open={isOpen} onClose={onClose} fullWidth>
			<DialogTitle>Column Selector</DialogTitle>
			<DialogContent>
				<FormControlLabel
					control={<Checkbox checked={allSelected} onChange={handleSelectAll} data-testid="filter_column_select_all" />}
					label="Select All"
				/>
				<Box sx={{ display: 'flex', flexDirection: 'column' }}>
					{columns?.map((column) => (
						<FormControlLabel
							key={column.label}
							control={
								<Checkbox
									checked={column.selected}
									onChange={() => onColumnToggle(column)}
								/>
							}
							label={column.label}
						/>
					))}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ColumnFilterModal