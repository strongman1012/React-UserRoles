import React, { useRef, useState, useEffect } from "react";
import OrganizationChart from "src/components/OrgChart/ChartContainer";
import {
  TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl,
  Box, Container, Card, CardHeader, CardContent, Divider
} from "@mui/material";
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import { fetchBusinessUnits } from 'src/reducers/businessUnits/businessUnitsSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/store/hooks';

const buildOrgChart = (units, parent_id = null) => {
  return units
    .filter(unit => unit.parent_id === parent_id)
    .map(unit => ({
      id: unit.id,
      name: unit.name,
      title: unit.admin_name,
      children: buildOrgChart(units, unit.id)
    }));
}

const OrgChart = () => {
  const orgchart = useRef(null);
  const dispatch = useAppDispatch();
  const [filename, setFilename] = useState("organization_chart");
  const [fileextension, setFileextension] = useState("png");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const businessUnits = useSelector((state) => state.businessUnits.allBusinessUnits);

  useEffect(() => {
    dispatch(fetchBusinessUnits());
  }, [dispatch]);

  useEffect(() => {
    if (businessUnits) {
      const chartData = buildOrgChart(businessUnits);
      setData(chartData?.[0]);
      setIsLoading(false);
    }
  }, [businessUnits]);

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

  return (
    <>
      <Container maxWidth={false}>
        <LoadingScreen show={isLoading} />
        <Box sx={{ pt: 3 }}>
          <Card variant="outlined">
            <CardHeader title="Organization Chart"
              action={
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <CardContent>
              {data && (
                <OrganizationChart ref={orgchart} datasource={data} pan={true} zoom={true} />
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default OrgChart;
