import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import OrganizationChart from "src/components/OrgChart/ChartContainer";
import {
  TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl,
  Box, Container, Card, CardHeader, CardContent, Divider, Dialog, DialogTitle, DialogContent, Drawer, IconButton,
  Typography
} from "@mui/material";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { DataGrid, Column, SearchPanel, Paging, Pager, FilterRow, Selection } from 'devextreme-react/data-grid';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import { fetchBusinessUnitsList } from 'src/reducers/businessUnits/businessUnitsSlice';
import { fetchTeamsList } from '../../reducers/teams/teamsSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/store/hooks';
import { fetchRoles } from 'src/reducers/roles/rolesSlice';
import { fetchUsersList } from 'src/reducers/users/usersSlice';

// Updated to include className for highlighted nodes
const buildOrgChart = (units, highlightedNodes = [], selectedUser = null, parent_id = null) => {
  return units
    .filter(unit => unit.parent_id === parent_id)
    .map(unit => ({
      id: unit.id,
      name: unit.name,
      title: unit.admin_name,
      className: highlightedNodes.includes(unit.id) ? "team-level" : selectedUser?.business_unit_id === unit.id ? "user-level" : "",
      type: "businessUnit",
      children: buildOrgChart(units, highlightedNodes, selectedUser, unit.id)
    }));
}

const teamOrgChart = (teams, business, selectedUser = null, hoveredNode = null) => {
  if (business)
    return {
      id: "top_team",
      name: "Teams",
      title: business.name,
      type: "teamRoot",
      className: hoveredNode === "top_team" ? "team-level" : "",
      children: teams.map(team => ({
        id: team.id,
        name: team.name,
        title: team.business_name,
        className: hoveredNode === team.id ? "team-level" : selectedUser?.team_ids?.split(',').includes(String(team.id)) ? "user-level" : "",
        type: "team"
      }))
    };
}

const OrgChart = () => {
  const orgchart = useRef(null);
  const dispatch = useAppDispatch();
  const [filename, setFilename] = useState("organization_chart");
  const [fileextension, setFileextension] = useState("png");
  const [isLoading, setIsLoading] = useState(true);
  const [businessData, setBusinessData] = useState({});
  const [teamData, setTeamData] = useState({});
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer visibility
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [hoveredTeamId, setHoveredTeamId] = useState(null);
  const businessUnits = useSelector((state) => state.businessUnits.businessUnitsList);
  const teams = useSelector((state) => state.teams.teamsList);
  const allUsers = useSelector((state) => state.users.usersList);
  const roles = useSelector((state) => state.roles.allRoles);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [usersListModal, setUsersListModal] = useState(false);
  const setting = useSelector((state) => state.settings.setting);

  useEffect(() => {
    dispatch(fetchBusinessUnitsList());
    dispatch(fetchTeamsList());
    dispatch(fetchUsersList());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (businessUnits && teams) {
      const businessChartData = buildOrgChart(businessUnits, highlightedNodes, selectedUser);
      const topBusinessUnit = businessUnits.filter(unit => unit.parent_id === null)?.[0];
      const teamChartData = teamOrgChart(teams, topBusinessUnit, selectedUser, hoveredTeamId);
      setBusinessData(businessChartData?.[0]);
      setTeamData(teamChartData);
      setIsLoading(false);
    }
  }, [businessUnits, teams, highlightedNodes, selectedUser, hoveredTeamId]);

  // Memoizing defaultPageSize based on the setting
  const defaultPageSize = useMemo(() => {
    return setting?.rowsPerPage ? setting.rowsPerPage : 20;
  }, [setting]);

  // Memoizing allowedPageSizes based on defaultPageSize
  const allowedPageSizes = useMemo(() => {
    return [defaultPageSize, 2 * defaultPageSize, 3 * defaultPageSize];
  }, [defaultPageSize]);

  const handleNodeHover = (node) => {
    if (!node) {
      setHighlightedNodes([]);
      setHoveredTeamId(null);
      return;
    }
    setSelectedUser(null);
    setHoveredTeamId(node.id);
    // If the hovered node is a team, find its corresponding business unit
    const businessUnit = businessUnits.find(unit => unit.name === node.title);

    if (businessUnit) {
      // Find parents of the business unit
      const parentNodes = [];
      let currentNode = businessUnit;

      const findParentNode = (id) => {
        return businessUnits.find(unit => unit.id === id);
      };
      while (currentNode) {
        parentNodes.push(currentNode.id);
        currentNode = findParentNode(currentNode.parent_id);
      }
      setHighlightedNodes([...parentNodes, node.id]); // Highlight the team and its parent business units
    } else {
      setHighlightedNodes([node.id]); // If it's not a team, highlight just the node
    }
  };

  const handleNodeClick = (node) => {
    if (!node) {
      setSelectedMembers([]);
      return;
    }

    let members = [];
    if (node.type === "team") {
      members = allUsers.filter(user =>
        user.team_ids ? user.team_ids.split(',').includes(String(node.id)) : false
      );
    } else if (node.type === "businessUnit") {
      members = allUsers.filter(user => user.business_unit_id === node.id);
    }

    setSelectedMembers(members);
    setUsersListModal(true);
  };

  const exportTo = () => {
    if (orgchart.current) {
      orgchart.current.exportTo(filename, fileextension);
    }
  };

  const onNameChange = (event) => {
    setFilename(event.target.value);
  };

  const onExtensionChange = (event) => {
    setFileextension(event.target.value);
  };

  const getRoleNames = (roleIds) => {
    if (!roleIds) return '';
    const ids = roleIds.split(',').map(id => parseInt(id, 10));
    return ids.map(id => roles.find(role => role.id === id)?.name).filter(name => name).join(', ');
  };

  const getTeamNames = (teamIds) => {
    if (!teamIds) return '';
    const ids = teamIds.split(',').map(id => parseInt(id, 10));
    return ids.map(id => teams.find(team => team.id === id)?.name).filter(name => name).join(', ');
  };

  const toggleDrawer = (isOpen) => {
    setDrawerOpen(isOpen); // Open/Close drawer
  };

  const onSelectionChanged = useCallback(({ selectedRowsData }) => {
    const data = selectedRowsData[0];
    setSelectedUser(data);
  }, []);

  return (
    <>
      <Container maxWidth={false}>
        <LoadingScreen show={isLoading} />
        <Box sx={{ pt: 3 }}>
          <Card variant="outlined">
            <CardHeader title="Data Control Hierarchy"
              action={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => toggleDrawer(!drawerOpen)}>
                    <Diversity3Icon sx={{ color: '#f7f7f7', mr: 2 }} />
                  </IconButton>
                  <TextField
                    id="txt-filename"
                    label="Filename"
                    value={filename}
                    onChange={onNameChange}
                    variant="outlined"
                    size="small"
                    sx={{
                      marginRight: "2rem", background: (theme) => `${theme.palette.background.paper}`, borderRadius: '4px',
                      '& .MuiInputLabel-root': {
                        color: '#2d2d2d',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#f7f7f7',
                      }
                    }}
                  />
                  <FormControl component="fieldset" style={{ marginRight: "2rem" }}>
                    <RadioGroup
                      row
                      value={fileextension}
                      onChange={onExtensionChange}
                    >
                      <FormControlLabel value="png" control={<Radio sx={{
                        '& .MuiSvgIcon-root': {
                          background: (theme) => `${theme.palette.background.paper}`,
                          borderRadius: '10px'
                        }
                      }} />} label="png" />
                      <FormControlLabel value="pdf" control={<Radio sx={{
                        '& .MuiSvgIcon-root': {
                          background: (theme) => `${theme.palette.background.paper}`,
                          borderRadius: '10px'
                        }
                      }} />} label="pdf" />
                    </RadioGroup>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={exportTo}
                    sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}
                  >
                    Export
                  </Button>
                </div>
              }
            />
            <Divider />
            <CardContent sx={{ position: 'relative', display: 'flex' }}>
              <Drawer
                anchor="left"
                variant="persistent"
                open={drawerOpen}
                PaperProps={{
                  sx: {
                    width: 240,
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    margin: '2px',
                    borderRight: '2px solid #e34747'
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography>UserList</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <DataGrid
                    dataSource={allUsers}
                    key={defaultPageSize}
                    keyExpr="id"
                    columnAutoWidth={true}
                    showRowLines={true}
                    showBorders={true}
                    allowColumnResizing={true}
                    rowAlternationEnabled={true}
                    hoverStateEnabled={true}
                    onSelectionChanged={onSelectionChanged}
                  >
                    <Selection mode="single" />
                    <FilterRow visible={true} />
                    <SearchPanel visible={true} />
                    <Paging defaultPageSize={defaultPageSize} />
                    <Column dataField="lastName" caption="Last Name" />
                    <Column dataField='firstName' caption='First Name' />
                  </DataGrid>
                </Box>
              </Drawer>
              <Box sx={{ flexGrow: 1 }}>
                {businessData && (
                  <Box height={470}>
                    <OrganizationChart ref={orgchart} datasource={businessData} pan={true} zoom={true} onClickNode={handleNodeClick} />
                  </Box>
                )}
                {teamData && (
                  <Box height={250}>
                    <OrganizationChart ref={orgchart} datasource={teamData} pan={true} zoom={true} onHoverNode={handleNodeHover} onClickNode={handleNodeClick} />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Dialog open={usersListModal} onClose={() => setUsersListModal(false)} maxWidth={false}>
          <DialogTitle sx={{ background: (theme) => `${theme.palette.primary.main}`, color: '#f7f7f7', height: '45px' }}>Users List</DialogTitle>
          <DialogContent sx={{ marginY: 3 }}>
            {setting && defaultPageSize && allowedPageSizes && (
              <DataGrid
                dataSource={selectedMembers}
                key={defaultPageSize}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
                allowColumnResizing={true}
                rowAlternationEnabled={true}
              >
                <FilterRow visible={true} />
                <SearchPanel visible={true} />
                <Paging defaultPageSize={defaultPageSize} />
                <Pager showPageSizeSelector={true} allowedPageSizes={allowedPageSizes} />
                <Column dataField="userName" caption="User Name" />
                <Column dataField='email' caption='Email' />
                <Column dataField="fullName" caption="Full Name" />
                <Column dataField='mobilePhone' caption='Mobile Phone' />
                <Column dataField='mainPhone' caption='Main Phone' />
                <Column
                  dataField='role_ids'
                  caption='Roles'
                  cellRender={(cellData) => getRoleNames(cellData.value)}
                />
                <Column dataField="business_name" caption="Business Unit" />
                <Column
                  dataField='team_ids'
                  caption='Teams'
                  cellRender={(cellData) => getTeamNames(cellData.value)}
                />
              </DataGrid>)}
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default OrgChart;
