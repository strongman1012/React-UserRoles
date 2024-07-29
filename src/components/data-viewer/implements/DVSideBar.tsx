import React from "react";
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { FC, useEffect, useState } from "react";
import DataObjectIcon from '@mui/icons-material/DataObject';
import { Query } from "../types/dataViewer";
import { Tab, Tabs, useTheme } from "@mui/material";
import { Theme } from "@material-ui/core";

const tabs = [
	{
		id: 1,
		name: 'Internal',
	},
	{
		id: 2,
		name: 'External',
	}
];

interface SidebarProps {
	query: Query | undefined;
	queries: Query[],
	onChange: (query: Query) => void
}

const DVSideBard: FC<SidebarProps> = (props: SidebarProps) => {

	const [queries, setQueries] = useState<Query[]>([]);
	const [activeTab, setActiveTab] = useState<number>(1);
	const [selectedQuery, setSelectedQuery] = useState<Query>();
	const theme = useTheme<Theme>();

	useEffect(() => {
		filterQueries(props.queries);
	}, [props.queries, activeTab]);

	/**
	 * Filter Query
	 */
	const filterQueries = (queries: Query[]) => {

		const filteredQueries: Query[] = queries.filter(
			(query: Query) => query.isExternal === (activeTab === 1 ? false : true)
		);

		// Set Init Query
		setQueries(filteredQueries);
		setSelectedQuery(filteredQueries[0]);
	}

	/**
	 * Handle click
	 */
	const handleTabsChange = (event: React.ChangeEvent<HTMLSelectElement>, value: number): void => {
		setActiveTab(value)
	}

	const handleListItemClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		query: Query,
	) => {
		setSelectedQuery(query);
		props.onChange(query);
	};

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column' }} style={{ backgroundColor: theme.palette.background.default }}>

				<Box sx={{
					height: '100%',
					minWidth: 180,
					borderRight: 1,
					borderColor: 'rgba(0, 0, 0, 0.12)',
				}}>
					<Tabs
						onChange={() => handleTabsChange}
						value={activeTab}
						indicatorColor="primary"
					>
						{tabs.map((tab, idx) => {
							return <Tab key={idx} label={tab.name} value={tab.id} sx={{ color: theme.palette.text.primary, py: 2.5 }} />
						})}
					</Tabs>

					<Divider />

					<List dense={true} component="nav" aria-label="main mailbox folders">
						{props.queries.map((query: Query, idx: number) => {
							return (
								<ListItemButton key={idx}
									selected={selectedQuery?.url === query.url}
									onClick={(e) => handleListItemClick(e, query)}>
									<ListItemIcon sx={{ minWidth: '36px' }} >
										<DataObjectIcon style={{ color: theme.palette.text.primary }} />
									</ListItemIcon>
									<ListItemText data-testid={query.name} primary={query.name} sx={{ color: theme.palette.text.primary }} />
								</ListItemButton>
							)
						})}
					</List>
				</Box>
			</Box>
		</>
	)
}

export default DVSideBard;
